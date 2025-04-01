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
  isBookmarked?: boolean;
  bookmarkedAt?: string;
  publication?: {
    name: string;
    displayName: string;
    avatarUrl?: string;
  };
}

export interface Source {
  id: number;
  name: string;
  label: string;
  enabled: boolean;
}

export interface ArticleResponse {
  articles: Article[];
  hasMore: boolean;
  nextCursor?: string;
}
