import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const clerkId = params.userId;
    console.log("API - clerkId:", clerkId);

    // ClerkIDからユーザーを検索
    const user = await prisma.users.findUnique({
      where: { clerkid: clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ユーザーのブックマーク一覧を取得
    const bookmarks = await prisma.bookmarks.findMany({
      where: {
        userid: user.id, // 内部のユーザーIDを使用
      },
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

    console.log("API - bookmarks:", bookmarks);

    // レスポンスデータの整形
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

    console.log("API - formattedBookmarks:", formattedBookmarks);

    return NextResponse.json(formattedBookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}
