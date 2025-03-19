export interface Article {
  id: string;
  title: string;
  url: string;
  author: string;
  likes: number;
  timestamp: string;
  source: "zenn" | "qiita" | "hackernews";
  emoji?: string;
  bookmarks?: number;
  publication?: {
    name: string;
    displayName: string;
    avatarUrl?: string;
  };
}

export interface ArticleResponse {
  articles: Article[];
  hasMore: boolean;
  nextCursor?: string;
}
