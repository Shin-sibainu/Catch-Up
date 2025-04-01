import { NextResponse } from "next/server";
import { Article } from "@/lib/types/article";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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

// ユーザーの存在確認
async function findUser(clerkId: string) {
  try {
    const existingUser = await prisma.users.findUnique({
      where: { clerkid: clerkId },
    });

    if (!existingUser) {
      throw new Error(
        "ユーザーが見つかりません。システム管理者に連絡してください。"
      );
    }

    return existingUser;
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
}

// トランザクション処理を独立した関数に分離
async function handleBookmarkTransaction(
  tx: any,
  article: Article,
  clerkUserId: string
): Promise<BookmarkResult> {
  // 1. ユーザーの存在確認
  const dbUser = await findUser(clerkUserId);

  // 2. sourceの存在確認と作成
  const sourceId = await ensureSourceExists(article.source);

  // 3. 記事の存在確認と保存
  const dbArticle = await findOrCreateArticle(tx, article, sourceId);

  // 4. ブックマークの処理
  const bookmarkResult = await toggleBookmark(tx, dbUser.id, dbArticle.id);

  return {
    action: bookmarkResult.action,
    dbArticle,
    bookmarkedAt: bookmarkResult.bookmarkedAt,
  };
}

// 記事の検索または作成を行う関数
async function findOrCreateArticle(
  tx: any,
  article: Article,
  sourceId: string
) {
  const existingArticle = await findExistingArticle(article.id, article.source);

  if (existingArticle) {
    return existingArticle;
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
