import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// エラーメッセージの定義
const ERROR_MESSAGES = {
  USER_NOT_FOUND: "ユーザーが見つかりません",
  DB_CONNECTION: "データベース接続エラー",
  GENERAL: "ブックマークの取得に失敗しました",
} as const;

export async function GET(
  request: Request,
  { params: { userId: clerkId } }: { params: { userId: string } }
) {
  try {
    if (!clerkId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // 開発環境でのみデバッグ情報を出力
    if (process.env.NODE_ENV === "development") {
      const dbUrl = process.env.DATABASE_URL;
      console.log("Database URL exists:", !!dbUrl);
      console.log("ClerkID:", clerkId);
    }

    // ClerkIDからユーザーを検索
    const user = await prisma.users.findUnique({
      where: { clerkid: clerkId },
    });

    if (!user) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.USER_NOT_FOUND },
        { status: 404 }
      );
    }

    // クエリの制限を設定
    const MAX_BOOKMARKS = 100; // 一度に取得できるブックマークの最大数

    // ユーザーのブックマーク一覧を取得（制限付き）
    const bookmarks = await prisma.bookmarks.findMany({
      where: { userid: user.id },
      include: {
        articles: {
          include: {
            sources: true,
          },
        },
      },
      orderBy: {
        createdat: "desc",
      },
      take: MAX_BOOKMARKS, // 最大件数を制限
    });

    const formattedBookmarks = bookmarks.map((bookmark) => ({
      articleId: bookmark.articles.externalid,
      createdAt: bookmark.createdat,
      article: {
        id: bookmark.articles.externalid,
        title: bookmark.articles.title,
        url: bookmark.articles.url,
        author: bookmark.articles.author,
        likes: bookmark.articles.likes || 0,
        bookmarks: bookmark.articles.bookmarkcount || 0,
        timestamp: bookmark.articles.publishedat.toISOString(),
        source: bookmark.articles.sources.name,
      },
    }));

    return NextResponse.json(formattedBookmarks);
  } catch (error) {
    // 開発環境でのみ詳細なエラー情報を出力
    if (process.env.NODE_ENV === "development") {
      console.error("Error details:", error);
    }

    if (
      error instanceof Error &&
      error.message.includes("FATAL: Tenant or user not found")
    ) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.DB_CONNECTION },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.GENERAL },
      { status: 500 }
    );
  }
}
