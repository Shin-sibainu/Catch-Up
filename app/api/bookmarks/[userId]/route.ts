import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // デバッグ用：環境変数の確認
    const dbUrl = process.env.DATABASE_URL;
    console.log("Database URL exists:", !!dbUrl);
    console.log("ClerkID:", clerkId);

    // ClerkIDからユーザーを検索
    const user = await prisma.users.findUnique({
      where: { clerkid: clerkId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", clerkId },
        { status: 404 }
      );
    }

    // ユーザーのブックマーク一覧を取得
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
    // エラーの詳細をログに出力
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
    });

    if (
      error instanceof Error &&
      error.message.includes("FATAL: Tenant or user not found")
    ) {
      return NextResponse.json(
        {
          error: "Database connection error",
          details: "Could not connect to database. Please try again later.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch bookmarks",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
