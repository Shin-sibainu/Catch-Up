import useSWR from "swr";
import { Article } from "../types/article";

interface ZennArticle extends Article {
  path?: string;
}

interface ZennResponse {
  articles: ZennArticle[];
}

interface Bookmark {
  articleId: string;
  createdAt: string;
  article: Article;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("APIリクエストに失敗しました");
  }
  return res.json();
};

export type ArticleType = "trending" | "latest" | "bookmarks";

export function useArticles(
  source: string = "all",
  userId?: string,
  type: ArticleType = "trending"
) {
  const {
    data: zennData,
    error: zennError,
    mutate: mutateZenn,
  } = useSWR<ZennResponse>(
    source === "all" || source === "zenn" ? "/api/zenn" : null,
    fetcher
  );

  const {
    data: qiitaData,
    error: qiitaError,
    mutate: mutateQiita,
  } = useSWR<Article[]>(
    source === "all" || source === "qiita" ? "/api/qiita" : null,
    fetcher
  );

  const {
    data: hackerNewsData,
    error: hackerNewsError,
    mutate: mutateHN,
  } = useSWR<Article[]>(
    source === "all" || source === "hackernews" ? "/api/hackernews" : null,
    fetcher
  );

  // ブックマーク状態を取得
  const {
    data: bookmarkData,
    error: bookmarkError,
    mutate: mutateBookmarks,
  } = useSWR(userId ? `/api/bookmarks/${userId}` : null, fetcher);

  const articles: Article[] = [];

  if (zennData?.articles) {
    articles.push(
      ...zennData.articles.map((article) => {
        const bookmarked = bookmarkData?.find(
          (bookmark: Bookmark) => bookmark.articleId === article.id
        );
        return {
          ...article,
          source: "zenn" as const,
          isBookmarked: !!bookmarked,
          bookmarkedAt: bookmarked?.createdAt || null,
        };
      })
    );
  }

  if (qiitaData) {
    articles.push(
      ...qiitaData.map((article) => {
        const bookmarked = bookmarkData?.find(
          (bookmark: Bookmark) => bookmark.articleId === article.id
        );
        return {
          ...article,
          source: "qiita" as const,
          isBookmarked: !!bookmarked,
          bookmarkedAt: bookmarked?.createdAt || null,
        };
      })
    );
  }

  if (hackerNewsData) {
    articles.push(
      ...hackerNewsData.map((article) => {
        const bookmarked = bookmarkData?.find(
          (bookmark: Bookmark) => bookmark.articleId === article.id
        );
        return {
          ...article,
          source: "hackernews" as const,
          isBookmarked: !!bookmarked,
          bookmarkedAt: bookmarked?.createdAt || null,
        };
      })
    );
  }

  // 記事のフィルタリングとソート
  let filteredArticles = [...articles];

  // ブックマーク済み記事のフィルタリング
  if (type === "bookmarks" && bookmarkData) {
    // ブックマークデータから記事情報を取得
    filteredArticles = bookmarkData.map((bookmark: Bookmark) => ({
      ...bookmark.article,
      isBookmarked: true,
      bookmarkedAt: bookmark.createdAt,
    }));
  }

  // 記事のソート
  filteredArticles.sort((a, b) => {
    if (type === "latest") {
      // 最新順（日付の降順）
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (type === "trending") {
      // トレンド順（人気度の降順）
      const aScore = a.likes + (a.bookmarks || 0);
      const bScore = b.likes + (b.bookmarks || 0);
      return bScore - aScore;
    } else if (type === "bookmarks") {
      // ブックマークした日時の新しい順
      const aTime = a.bookmarkedAt ? new Date(a.bookmarkedAt).getTime() : 0;
      const bTime = b.bookmarkedAt ? new Date(b.bookmarkedAt).getTime() : 0;
      return bTime - aTime;
    }
    return 0;
  });

  const isLoading =
    ((source === "all" || source === "zenn") && !zennData && !zennError) ||
    ((source === "all" || source === "qiita") && !qiitaData && !qiitaError) ||
    ((source === "all" || source === "hackernews") &&
      !hackerNewsData &&
      !hackerNewsError);

  const error = zennError || qiitaError || hackerNewsError;

  return {
    articles: filteredArticles.slice(0, 30),
    isLoading,
    error,
    mutate: async (updatedArticles?: Article[]) => {
      if (updatedArticles) {
        // 即座に状態を更新（Optimistic Update）
        const newArticles = filteredArticles.map((article) => {
          const updatedArticle = updatedArticles.find(
            (a) => a.id === article.id
          );
          if (updatedArticle) {
            return {
              ...article,
              ...updatedArticle,
              isBookmarked: updatedArticle.isBookmarked,
              bookmarkedAt: updatedArticle.bookmarkedAt,
            };
          }
          return article;
        });

        // 各データソースの状態を即座に更新
        if (source === "all" || source === "zenn") {
          await mutateZenn((data) => {
            if (!data) return data;
            return {
              articles: data.articles.map((article) => {
                const updatedArticle = updatedArticles.find(
                  (a) => a.id === article.id
                );
                return updatedArticle
                  ? { ...article, isBookmarked: updatedArticle.isBookmarked }
                  : article;
              }),
            };
          }, false);
        }
        if (source === "all" || source === "qiita") {
          await mutateQiita(
            (data) =>
              data?.map((article) => {
                const updatedArticle = updatedArticles.find(
                  (a) => a.id === article.id
                );
                return updatedArticle
                  ? { ...article, isBookmarked: updatedArticle.isBookmarked }
                  : article;
              }),
            false
          );
        }
        if (source === "all" || source === "hackernews") {
          await mutateHN(
            (data) =>
              data?.map((article) => {
                const updatedArticle = updatedArticles.find(
                  (a) => a.id === article.id
                );
                return updatedArticle
                  ? { ...article, isBookmarked: updatedArticle.isBookmarked }
                  : article;
              }),
            false
          );
        }

        // ブックマークデータも更新
        if (userId) {
          await mutateBookmarks((data: Bookmark[]) => {
            const updatedBookmarks = [...(data || [])];
            updatedArticles.forEach((article) => {
              const bookmarkIndex = updatedBookmarks.findIndex(
                (b) => b.articleId === article.id
              );
              if (article.isBookmarked && bookmarkIndex === -1) {
                updatedBookmarks.push({
                  articleId: article.id,
                  createdAt: new Date().toISOString(),
                  article: article,
                });
              } else if (!article.isBookmarked && bookmarkIndex !== -1) {
                updatedBookmarks.splice(bookmarkIndex, 1);
              }
            });
            return updatedBookmarks;
          }, false);
        }

        return newArticles;
      }
    },
  };
}
