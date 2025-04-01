import { Article, Source } from "../types/article";
import { fetchHackerNewsArticles } from "./hackernews";
import { fetchQiitaArticles } from "./qiita";
import { fetchZennArticles } from "./zenn";
import { prisma } from "@/lib/prisma";

export type ArticleType = "trending" | "latest" | "bookmarks";

// キャッシュオプション用の型
export type FetchOptions = {
  revalidate?: number | false;
  userId?: string; // ユーザーIDを追加
};

// ブックマーク状態を取得する関数
async function getBookmarkStatuses(
  userId: string,
  articles: Article[]
): Promise<Record<string, { isBookmarked: boolean; bookmarkedAt?: string }>> {
  try {
    // ユーザーの存在確認
    const user = await prisma.users.findUnique({
      where: { clerkid: userId },
    });

    if (!user) {
      console.error("User not found");
      return {};
    }

    // 1. まず、記事のソースIDを取得
    const sourceNames = Array.from(new Set(articles.map((a) => a.source)));

    const sources = await prisma.sources.findMany({
      where: {
        name: { in: sourceNames },
      },
    });

    const sourceMap = Object.fromEntries(sources.map((s) => [s.name, s.id]));

    // 2. 記事を検索してブックマーク状態を取得
    const dbArticles = await prisma.articles.findMany({
      where: {
        AND: [
          { externalid: { in: articles.map((a) => a.id) } },
          { sourceid: { in: Object.values(sourceMap) } },
        ],
      },
      include: {
        bookmarks: {
          where: { userid: user.id },
          select: { userid: true, createdat: true },
        },
      },
    });

    // 3. ブックマーク状態のマップを作成
    const bookmarkMap: Record<
      string,
      { isBookmarked: boolean; bookmarkedAt?: string }
    > = {};
    dbArticles.forEach((article) => {
      const bookmark = article.bookmarks[0];
      bookmarkMap[article.externalid] = {
        isBookmarked: article.bookmarks.length > 0,
        bookmarkedAt: bookmark?.createdat?.toISOString(),
      };
    });

    return bookmarkMap;
  } catch (error) {
    console.error("Error fetching bookmark statuses:", error);
    return {};
  }
}

export async function fetchAllArticles(
  source: string = "all",
  options: FetchOptions = { revalidate: 21600 }
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

    // ユーザーIDが提供された場合、ブックマーク状態を取得
    if (options.userId) {
      const bookmarkStatuses = await getBookmarkStatuses(
        options.userId,
        articles
      );
      articles = articles.map((article) => ({
        ...article,
        isBookmarked: bookmarkStatuses[article.id]?.isBookmarked || false,
        bookmarkedAt: bookmarkStatuses[article.id]?.bookmarkedAt,
      }));
    }

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
    const response = await fetch(`/api/bookmarks?userId=${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch bookmarked articles");
    }
    return await response.json();
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
): Promise<{
  success: boolean;
  action: "added" | "removed";
  bookmarkedAt?: string;
}> {
  try {
    const response = await fetch("/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        article,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to bookmark article");
    }

    const result = await response.json();
    return {
      success: result.success,
      action: result.action,
      bookmarkedAt: result.bookmarkedAt,
    };
  } catch (error) {
    console.error("ブックマーク処理エラー:", error);
    return {
      success: false,
      action: "removed",
      bookmarkedAt: undefined,
    };
  }
}
