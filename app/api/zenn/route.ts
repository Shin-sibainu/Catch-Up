import { NextResponse } from "next/server";

export const revalidate = 300; // 5分ごとに再検証

export async function GET() {
  try {
    const response = await fetch("https://zenn.dev/api/articles", {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 300, // 5分ごとに再検証
      },
    });

    if (!response.ok) {
      throw new Error(`Zenn API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // 必要な情報のみを抽出してマッピング
    const articles = data.articles.map((article: any) => ({
      id: article.id?.toString() || "",
      title: article.title || "",
      url: article.path ? `https://zenn.dev${article.path}` : "",
      author: article.user?.name || article.user?.username || "Unknown",
      likes: typeof article.liked_count === "number" ? article.liked_count : 0,
      bookmarks:
        typeof article.bookmarked_count === "number"
          ? article.bookmarked_count
          : 0,
      timestamp: article.published_at || new Date().toISOString(),
      source: "zenn" as const,
      emoji: article.emoji || undefined,
      publication: article.publication
        ? {
            name: article.publication.name || "",
            displayName: article.publication.display_name || "",
            avatarUrl: article.publication.avatar_small_url || undefined,
          }
        : undefined,
    }));

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching from Zenn API:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
