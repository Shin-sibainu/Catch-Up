import { Article, Source } from "../types/article";
import { fetchHackerNewsArticles } from "./hackernews";
import { fetchQiitaArticles } from "./qiita";
import { fetchZennArticles } from "./zenn";

export type ArticleType = "trending" | "latest" | "bookmarks";

// キャッシュオプション用の型
export type FetchOptions = {
  revalidate?: number | false;
};

export async function fetchAllArticles(
  source: string = "all",
  options: FetchOptions = { revalidate: 21600 } // デフォルトで6時間
): Promise<Article[]> {
  try {
    let articles: Article[] = [];

    if (source === "all" || source === "zenn") {
      const zennArticles = await fetchZennArticles(options);
      articles = [...articles, ...zennArticles];
    }

    if (source === "all" || source === "qiita") {
      const qiitaArticles = await fetchQiitaArticles(options);
      articles = [...articles, ...qiitaArticles];
    }

    if (source === "all" || source === "hackernews") {
      const hnArticles = await fetchHackerNewsArticles(options);
      articles = [...articles, ...hnArticles];
    }

    // ソートやスライスをせずに全記事を返す
    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

/**
 * ソース情報を取得
 */
export async function getSources(): Promise<Source[]> {
  try {
    // 静的なソース情報を返す（将来的にDBから取得に変更できる）
    const sources: Source[] = [
      {
        id: 1,
        name: "zenn",
        label: "Zenn",
        enabled: true,
      },
      {
        id: 2,
        name: "qiita",
        label: "Qiita",
        enabled: true,
      },
      {
        id: 3,
        name: "hackernews",
        label: "Hacker News",
        enabled: true,
      },
    ];

    return sources;
  } catch (error) {
    console.error("ソース取得エラー:", error);
    return [];
  }
}

/**
 * ユーザーのブックマーク記事を取得
 */
export async function getUserBookmarkedArticles(
  userId: string
): Promise<Article[]> {
  try {
    // 将来的にはDBからユーザーのブックマーク記事を取得
    // 現状は空配列を返す
    return [];
  } catch (error) {
    console.error("ブックマーク記事取得エラー:", error);
    return [];
  }
}

/**
 * 記事をブックマークする
 */
export async function bookmarkArticle(
  userId: string,
  article: Article
): Promise<boolean> {
  try {
    // 将来的にはDBに保存する実装
    console.log(`ブックマーク追加: ユーザー ${userId}, 記事 ${article.id}`);
    return true;
  } catch (error) {
    console.error("ブックマーク追加エラー:", error);
    return false;
  }
}

/**
 * ブックマークを解除する
 */
export async function removeBookmark(
  userId: string,
  articleId: string
): Promise<boolean> {
  try {
    // 将来的にはDBから削除する実装
    console.log(`ブックマーク削除: ユーザー ${userId}, 記事 ${articleId}`);
    return true;
  } catch (error) {
    console.error("ブックマーク削除エラー:", error);
    return false;
  }
}
