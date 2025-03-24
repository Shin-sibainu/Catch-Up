# データフェッチの実装フロー

## 1. 基本的なデータフェッチの実装

### 初期の API 実装

記事データを各ソース（Zenn、Qiita、HackerNews）から取得する実装を行いました。

```typescript
// lib/api/zenn.ts, lib/api/qiita.ts, lib/api/hackernews.ts などのファイルを作成
import { Article } from "../types/article";

export async function fetchZennArticles(): Promise<Article[]> {
  // Zenn APIからデータを取得し、Article型に変換
}
```

### 記事の統合と管理

各ソースから取得した記事を一元管理する関数を実装しました。

```typescript
// lib/api/articles.ts
export async function fetchAllArticles(
  source: string = "all"
): Promise<Article[]> {
  try {
    let articles: Article[] = [];

    if (source === "all" || source === "zenn") {
      const zennArticles = await fetchZennArticles();
      articles = [...articles, ...zennArticles];
    }

    if (source === "all" || source === "qiita") {
      const qiitaArticles = await fetchQiitaArticles();
      articles = [...articles, ...qiitaArticles];
    }

    if (source === "all" || source === "hackernews") {
      const hnArticles = await fetchHackerNewsArticles();
      articles = [...articles, ...hnArticles];
    }

    // ソートやスライスをせずに全記事を返す
    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}
```

## 2. URL エラーの解決

環境変数を導入して、Zenn、Qiita、HackerNews の API エンドポイント URL をより柔軟に設定できるようにしました。

```typescript
// lib/api/zenn.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";
const ZENN_API_URL = `${API_BASE}/api/zenn`;
```

## 3. クライアントサイドでのフィルタリングとソート

パフォーマンス向上のため、すべての記事データを一度に取得し、ソートやフィルタリングをクライアントサイドで行う方式を採用しました。

### クライアントコンポーネントでのフィルタリング

```typescript
// components/trending/trending-articles.tsx
export const TrendingArticles = ({
  initialArticles,
  initialSources,
}: TrendingArticlesProps) => {
  // クライアント側の状態だけで管理
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedType, setSelectedType] = useState("trending");

  // 選択されたソースに基づいて記事をフィルタリング
  const filteredArticles =
    selectedSource === "all"
      ? initialArticles
      : initialArticles.filter((article) => article.source === selectedSource);

  return (
    <div className="space-y-8">
      <SourceSelector
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
        sources={initialSources}
      />
      <Tabs
        defaultValue={selectedType}
        className="w-full"
        onValueChange={setSelectedType}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>
        <TabsContent value="trending">
          <ArticleList articles={filteredArticles} type="trending" />
        </TabsContent>
        <TabsContent value="latest">
          <ArticleList articles={filteredArticles} type="latest" />
        </TabsContent>
        <TabsContent value="bookmarks">
          <ArticleList articles={[]} type="bookmarks" />
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

### 記事リストのソート処理

```typescript
// components/trending/article-list.tsx
export const ArticleList = ({
  articles,
  type = "trending",
}: ArticleListProps) => {
  // typeに基づいて記事をソート
  const sortedArticles = [...articles]
    .sort((a, b) => {
      if (type === "latest") {
        // 最新順（日付の降順）
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } else if (type === "trending") {
        // トレンド順（人気度の降順）
        const aScore = a.likes + (a.bookmarks || 0);
        const bScore = b.likes + (b.bookmarks || 0);
        return bScore - aScore;
      }
      return 0; // デフォルト（変更なし）
    })
    .slice(0, 30); // 必要に応じて上位30件に制限

  // ...表示ロジック
};
```

## 4. ISR（インクリメンタル静的再生成）の導入

記事データの取得に ISR を適用し、パフォーマンスを最適化しました。

### キャッシュオプションの導入

```typescript
// lib/api/articles.ts
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

    // ... 他のソースのデータ取得 ...

    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}
```

### 各 API 関数でのキャッシュ設定

```typescript
// lib/api/zenn.ts など
export async function fetchZennArticles(
  options: FetchOptions = { revalidate: 21600 }
): Promise<Article[]> {
  try {
    const response = await fetch(ZENN_API_URL, {
      next: { revalidate: options.revalidate }
    });
    // ...
  }
}
```

### サーバーコンポーネントでの使用

```typescript
// app/page.tsx
async function ArticlesContainer() {
  // fetchAllArticlesを呼び出し、revalidateオプションを設定
  const articles = await fetchAllArticles("all", { revalidate: 21600 });
  const sources = await getSources();

  return (
    <TrendingArticles initialArticles={articles} initialSources={sources} />
  );
}
```

### HackerNews API の修正

HackerNews API の実装を修正し、正しく記事を取得できるようにしました。

```typescript
// lib/api/hackernews.ts
export async function fetchHackerNewsArticles(
  options: FetchOptions = { revalidate: 21600 }
): Promise<Article[]> {
  try {
    // トップストーリーのIDリストを取得
    const topStoriesResponse = await fetch(`${HN_API_URL}/topstories.json`, {
      next: { revalidate: options.revalidate },
    });

    // IDの配列を取得
    const storyIds = await topStoriesResponse.json();

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
    console.error("Error fetching Hacker News articles:", error);
    return [];
  }
}
```

## 5. ブックマーク機能の実装

ユーザーがブックマークした記事を管理する機能を実装しました。

```typescript
// lib/dal/articles.ts
export async function getUserBookmarkedArticles(
  userId: string
): Promise<Article[]> {
  try {
    // 将来的にはDBからユーザーのブックマーク記事を取得
    return [];
  } catch (error) {
    console.error("ブックマーク記事取得エラー:", error);
    return [];
  }
}

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
```

## 6. 今後の改善点

1. **ソースごとのキャッシュ戦略の調整**: 更新頻度に応じて各ソースの revalidate 時間を調整
2. **データベース統合**: ブックマーク機能をデータベースと連携
3. **記事検索機能の実装**: 取得した記事を検索できる機能の追加
4. **パフォーマンスモニタリング**: Web Vitals を監視し、必要に応じて最適化
5. **ユーザー認証との連携**: ブックマーク機能を認証システムと連携
