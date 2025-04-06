import { Article } from "../types/article";
import { FetchOptions } from "./articles";

// 環境変数からベースURLを取得し、デフォルト値も設定
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";
// 記事数を増やすためのパラメータを追加
const ZENN_API_URL = `${API_BASE}/api/zenn`;

export async function fetchZennArticles(
  options: FetchOptions = { revalidate: 21600 }
): Promise<Article[]> {
  try {
    const response = await fetch(ZENN_API_URL, {
      next: { revalidate: options.revalidate },
    });

    console.log(response.ok);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    if (!data?.articles || !Array.isArray(data.articles)) {
      console.error("Invalid response format from Zenn API");
      return [];
    }

    return data.articles.map((article: any) => ({
      id: article.id?.toString() || "",
      title: article.title || "",
      url: article.path ? `https://zenn.dev${article.path}` : "",
      author: article.user?.name || "Unknown",
      likes: typeof article.liked_count === "number" ? article.liked_count : 0,
      timestamp: article.published_at
        ? new Date(article.published_at).toISOString()
        : new Date().toISOString(),
      source: "zenn" as const,
      emoji: article.emoji || undefined,
      bookmarks: article.bookmarked_count || 0,
      publication: article.publication
        ? {
            name: article.publication.name || "",
            displayName: article.publication.display_name || "",
            avatarUrl: article.publication.avatar_small_url || undefined,
          }
        : undefined,
    }));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching Zenn articles:", error.message);
    } else {
      console.error("Error fetching Zenn articles:", error);
    }
    return [];
  }
}
