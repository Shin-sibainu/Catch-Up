import { NextResponse } from "next/server";
import { Article } from "@/lib/types/article";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

// 型定義
type BookmarkResult = {
  action: "added" | "removed";
  dbArticle: any;
  bookmarkedAt?: string;
};

// sourceの存在確認と作成
async function ensureSourceExists(sourceId: string): Promise<string> {
  const source = await prisma.sources.findUnique({
    where: { name: sourceId },
  });

  if (!source) {
    const newSource = await prisma.sources.create({
      data: {
        name: sourceId,
        enabled: true,
      },
    });
    return newSource.id;
  }

  return source.id;
}

// 記事の存在確認と取得
async function findExistingArticle(externalId: string, sourceName: string) {
  const source = await prisma.sources.findUnique({
    where: { name: sourceName },
  });

  if (!source) return null;

  const article = await prisma.articles.findFirst({
    where: {
      externalid: externalId,
      sourceid: source.id,
    },
  });
  return article;
}

// ユーザーの存在確認と作成
async function findUser(clerkId: string) {
  try {
    let existingUser = await prisma.users.findUnique({
      where: { clerkid: clerkId },
    });

    if (!existingUser) {
      // Clerkからユーザー情報を取得
      const clerkUser = await currentUser();
      if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
        throw new Error("ユーザーのメールアドレスが見つかりません");
      }

      // ユーザーが存在しない場合は作成
      existingUser = await prisma.users.create({
        data: {
          clerkid: clerkId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: clerkUser.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
            : undefined,
          imageurl: clerkUser.imageUrl,
          createdat: new Date(),
          updatedat: new Date(),
        },
      });
    }

    return existingUser;
  } catch (error) {
    console.error("Error finding/creating user:", error);
    throw error;
  }
}

// トランザクション処理を独立した関数に分離
async function handleBookmarkTransaction(
  tx: any,
  article: Article,
  clerkUserId: string
): Promise<BookmarkResult> {
  try {
    // 1. ユーザーの存在確認とソースの確認を並列で実行
    const [dbUser, source] = await Promise.all([
      findUser(clerkUserId),
      tx.sources.upsert({
        where: { name: article.source },
        create: { name: article.source },
        update: {},
      }),
    ]);

    if (!dbUser) {
      throw new Error(
        "ユーザーが見つかりません。システム管理者に連絡してください。"
      );
    }

    // 2. 記事の存在確認と保存を1回のクエリで実行
    const dbArticle = await tx.articles.upsert({
      where: {
        sourceid_externalid: {
          sourceid: source.id,
          externalid: article.id,
        },
      },
      create: {
        externalid: article.id,
        title: article.title,
        url: article.url,
        author: article.author,
        publishedat: new Date(article.timestamp),
        likes: article.likes,
        sourceid: source.id,
      },
      update: {
        likes: article.likes,
      },
    });

    // 3. ブックマークの処理を最適化
    const existingBookmark = await tx.bookmarks.findUnique({
      where: {
        userid_articleid: {
          userid: dbUser.id,
          articleid: dbArticle.id,
        },
      },
    });

    let action: "added" | "removed";
    let bookmarkedAt: string | undefined;

    if (existingBookmark) {
      await tx.bookmarks.delete({
        where: {
          userid_articleid: {
            userid: dbUser.id,
            articleid: dbArticle.id,
          },
        },
      });
      action = "removed";
    } else {
      const bookmark = await tx.bookmarks.create({
        data: {
          userid: dbUser.id,
          articleid: dbArticle.id,
        },
      });
      action = "added";
      bookmarkedAt = bookmark.createdat.toISOString();
    }

    return {
      action,
      dbArticle,
      bookmarkedAt,
    };
  } catch (error) {
    console.error("Transaction error:", error);
    throw error;
  }
}

// 記事の検索または作成を行う関数
async function findOrCreateArticle(
  tx: any,
  article: Article,
  sourceId: string
) {
  const existingArticle = await findExistingArticle(article.id, article.source);

  if (existingArticle) {
    // 既存の記事のURLを更新
    return await tx.articles.update({
      where: { id: existingArticle.id },
      data: {
        url: article.url,
        likes: article.likes || 0,
        bookmarkcount: article.bookmarks || 0,
        title: article.title,
        author: article.author || "",
      },
    });
  }

  return await tx.articles.create({
    data: {
      externalid: article.id,
      title: article.title,
      url: article.url,
      author: article.author || "",
      publishedat: new Date(article.timestamp),
      likes: article.likes || 0,
      sourceid: sourceId,
      bookmarkcount: article.bookmarks || 0,
    },
  });
}

// ブックマークの切り替えを行う関数
async function toggleBookmark(
  tx: any,
  userId: string,
  articleId: string
): Promise<{ action: "added" | "removed"; bookmarkedAt?: string }> {
  const bookmarkExists = await tx.bookmarks.findFirst({
    where: {
      userid: userId,
      articleid: articleId,
    },
  });

  if (bookmarkExists) {
    await tx.bookmarks.delete({
      where: {
        userid_articleid: {
          userid: userId,
          articleid: articleId,
        },
      },
    });
    return { action: "removed" };
  }

  const bookmark = await tx.bookmarks.create({
    data: {
      userid: userId,
      articleid: articleId,
    },
  });

  return {
    action: "added",
    bookmarkedAt: bookmark.createdat.toISOString(),
  };
}

// POSTエンドポイントのメイン処理
export async function POST(request: Request) {
  try {
    const { article } = await request.json();
    const session = await auth();

    if (!article || !session?.userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // トランザクションで全ての操作を実行
    const result = await prisma.$transaction(async (tx) => {
      return await handleBookmarkTransaction(tx, article, session.userId);
    });

    return NextResponse.json({
      success: true,
      action: result.action,
      bookmarkedAt: result.bookmarkedAt,
      message:
        result.action === "added"
          ? "ブックマークを追加しました"
          : "ブックマークを解除しました",
    });
  } catch (error) {
    console.error("Error in bookmark process:", error);

    // エラーメッセージとステータスコードの設定
    let errorMessage = "サーバーエラーが発生しました";
    let statusCode = 500;

    if (error instanceof Error) {
      if (
        error.message ===
        "ユーザーが見つかりません。システム管理者に連絡してください。"
      ) {
        errorMessage = error.message;
        statusCode = 404;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: statusCode }
    );
  }
}

// DELETE: ブックマークの削除
export async function DELETE(request: Request) {
  try {
    const { userId, articleId } = await request.json();

    if (!userId || !articleId) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    await prisma.bookmarks.delete({
      where: {
        userid_articleid: {
          userid: userId,
          articleid: articleId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "ブックマークを削除しました",
    });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
