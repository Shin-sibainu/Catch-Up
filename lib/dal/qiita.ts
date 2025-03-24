import { Article } from "../types/article";
import { FetchOptions } from "./articles";

// 環境変数からベースURLを取得し、デフォルト値も設定
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";
const QIITA_API_URL = `${API_BASE}/api/qiita`;

export async function fetchQiitaArticles(
  options: FetchOptions = { revalidate: 21600 }
): Promise<Article[]> {
  try {
    const response = await fetch(QIITA_API_URL, {
      next: { revalidate: options.revalidate },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Invalid response format from Qiita API");
      return [];
    }

    return data.map((article: any) => ({
      id: article.id?.toString() || "",
      title: article.title || "",
      url: article.url || "",
      author: article.user?.name || article.user?.id || "Unknown",
      likes: typeof article.likes_count === "number" ? article.likes_count : 0,
      timestamp: article.created_at
        ? new Date(article.created_at).toISOString()
        : new Date().toISOString(),
      source: "qiita" as const,
      bookmarks: article.stocks_count || 0,
    }));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching Qiita articles:", error.message);
    } else {
      console.error("Error fetching Qiita articles:", error);
    }
    return [];
  }
}
