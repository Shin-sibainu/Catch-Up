import { Article } from "../types/article";
import { FetchOptions } from "./articles";

// HackerNews API のベースURL
const HN_API_URL = "https://hacker-news.firebaseio.com/v0";

export async function fetchHackerNewsArticles(
  options: FetchOptions = { revalidate: 21600 }
): Promise<Article[]> {
  try {
    // トップストーリーのIDリストを取得
    const topStoriesResponse = await fetch(`${HN_API_URL}/topstories.json`, {
      next: { revalidate: options.revalidate },
    });

    if (!topStoriesResponse.ok) {
      throw new Error(
        `Failed to fetch top stories: ${topStoriesResponse.status}`
      );
    }

    // IDの配列を取得
    const storyIds = await topStoriesResponse.json();

    if (!Array.isArray(storyIds)) {
      throw new Error(
        "Invalid response format from Hacker News API: not an array"
      );
    }

    // 最初の30件のIDのみ使用（パフォーマンス対策）
    const topStoryIds = storyIds.slice(0, 30);

    // 各ストーリーの詳細を取得
    const storiesPromises = topStoryIds.map((id) =>
      fetch(`${HN_API_URL}/item/${id}.json`, {
        next: { revalidate: options.revalidate },
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch story ${id}: ${res.status}`);
        }
        return res.json();
      })
    );

    // すべてのストーリーデータを並行して取得
    const stories = await Promise.all(storiesPromises);

    // Article形式にマッピング
    return stories
      .filter((item) => item && item.title) // 無効なアイテムをフィルタリング
      .map((item: any) => ({
        id: item.id?.toString() || "",
        title: item.title || "",
        url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
        author: item.by || "Unknown",
        likes: item.score || 0,
        timestamp: item.time
          ? new Date(item.time * 1000).toISOString()
          : new Date().toISOString(),
        source: "hackernews" as const,
        bookmarks: item.descendants || 0, // コメント数をブックマーク数として使用
      }));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching Hacker News articles:", error.message);
    } else {
      console.error("Error fetching Hacker News articles:", error);
    }
    return [];
  }
}
