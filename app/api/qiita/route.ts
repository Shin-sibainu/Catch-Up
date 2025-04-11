import { NextResponse } from "next/server";

export const revalidate = 300; // 5分ごとに再検証

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": `Mozilla/5.0 (compatible; CatchUp/1.0; +${siteUrl})`,
    };

    // トークンがある場合のみ、Authorizationヘッダーを追加
    if (process.env.QIITA_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.QIITA_TOKEN}`;
    }

    const response = await fetch(
      "https://qiita.com/api/v2/items?per_page=20&query=stocks:>10&sort=stock",
      {
        headers,
        next: {
          revalidate: 300, // 5分ごとに再検証
        },
      }
    );

    if (!response.ok) {
      console.error(`Qiita API error: Status ${response.status}`);
      throw new Error(`Qiita API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // 必要な情報のみを抽出してマッピング
    const articles = data.map((article: any) => ({
      id: article.id?.toString() || "",
      title: article.title || "",
      url: article.url || "",
      author: article.user?.name || article.user?.id || "Unknown",
      likes: typeof article.likes_count === "number" ? article.likes_count : 0,
      bookmarks:
        typeof article.stocks_count === "number" ? article.stocks_count : 0,
      timestamp: article.created_at || new Date().toISOString(),
      source: "qiita" as const,
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching from Qiita API:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch articles",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
