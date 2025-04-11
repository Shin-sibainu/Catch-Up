# ブックマーク機能の実装フロー

## 1. データベース設計

### テーブル構造

```prisma
model articles {
  id              String      @id @default(dbgenerated("gen_random_uuid()"))
  externalid      String
  title           String
  url             String
  author          String?
  publishedat     DateTime    @db.Timestamptz(6)
  likes           Int?        @default(0)
  sourceid        String
  bookmarkcount   Int?        @default(0)
  createdat       DateTime?   @default(now()) @db.Timestamptz(6)
  updatedat       DateTime?   @default(now()) @db.Timestamptz(6)
  sources         sources     @relation(fields: [sourceid], references: [id])
  bookmarks       bookmarks[]

  @@unique([sourceid, externalid])
}

model bookmarks {
  id        String    @id @default(dbgenerated("gen_random_uuid()"))
  userid    String
  articleid String
  createdat DateTime? @default(now()) @db.Timestamptz(6)
  articles  articles  @relation(fields: [articleid], references: [id])
  users     users     @relation(fields: [userid], references: [id])

  @@unique([userid, articleid])
}
```

## 2. API エンドポイントの実装

### ブックマーク処理のエンドポイント

```typescript
// app/api/articles/route.ts

// 型定義
type BookmarkResult = {
  action: "added" | "removed";
  dbArticle: any;
  bookmarkedAt?: string;
};

// ブックマークの切り替えを行う関数
async function toggleBookmark(
  tx: any,
  userId: string,
  articleId: string
): Promise<{ action: "added" | "removed"; bookmarkedAt?: string }> {
  const bookmarkExists = await tx.bookmarks.findFirst({
    where: {
      userid: userId,
      articleid: articleId,
    },
  });

  if (bookmarkExists) {
    await tx.bookmarks.delete({
      where: {
        userid_articleid: {
          userid: userId,
          articleid: articleId,
        },
      },
    });
    return { action: "removed" };
  }

  const bookmark = await tx.bookmarks.create({
    data: {
      userid: userId,
      articleid: articleId,
    },
  });

  return {
    action: "added",
    bookmarkedAt: bookmark.createdat.toISOString(),
  };
}

// POSTエンドポイント
export async function POST(request: Request) {
  try {
    const { article } = await request.json();
    const session = await auth();

    if (!article || !session?.userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const result = await prisma.$transaction(async (tx) => {
      return await handleBookmarkTransaction(tx, article, session.userId);
    });

    return NextResponse.json({
      success: true,
      action: result.action,
      bookmarkedAt: result.bookmarkedAt,
      message:
        result.action === "added"
          ? "ブックマークを追加しました"
          : "ブックマークを解除しました",
    });
  } catch (error) {
    // エラーハンドリング
  }
}
```

## 3. フロントエンドの実装

### 記事リストコンポーネント

```typescript
// components/trending/article-list.tsx

export const ArticleList: FC<ArticleListProps> = ({
  articles,
  type = "trending",
  onBookmarkChange,
}) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [bookmarkingStates, setBookmarkingStates] = useState<{
    [key: string]: boolean;
  }>({});

  // 記事のブックマーク処理
  const handleBookmark = async (article: Article) => {
    if (!user) {
      toast({
        title: "エラー",
        description: "ブックマークするにはログインが必要です",
        variant: "destructive",
      });
      return;
    }

    try {
      setBookmarkingStates((prev) => ({ ...prev, [article.id]: true }));

      const response = await bookmarkArticle(user.id, article);

      if (response.success) {
        const isNowBookmarked = response.action === "added";

        toast({
          title: "成功",
          description: isNowBookmarked
            ? "記事をブックマークしました"
            : "ブックマークを解除しました",
        });

        onBookmarkChange(article.id, isNowBookmarked, response.bookmarkedAt);
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "ブックマークに失敗しました",
        variant: "destructive",
      });
    } finally {
      setBookmarkingStates((prev) => ({ ...prev, [article.id]: false }));
    }
  };
};
```

### ブックマーク状態の管理

```typescript
// components/trending/trending-articles.tsx

export const TrendingArticles = ({
  initialArticles,
  initialSources,
}: TrendingArticlesProps) => {
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedType, setSelectedType] = useState("trending");
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  // 選択されたタイプとソースに基づいて記事をフィルタリング
  const getFilteredArticles = () => {
    // まず、タイプでフィルタリング
    let typeFilteredArticles =
      selectedType === "bookmarks"
        ? articles.filter((article) => article.isBookmarked)
        : articles;

    // 「保存した記事」タブの場合のみ、ブックマークした日付でソート
    if (selectedType === "bookmarks") {
      typeFilteredArticles = [...typeFilteredArticles].sort((a, b) => {
        const aTime = a.bookmarkedAt ? new Date(a.bookmarkedAt).getTime() : 0;
        const bTime = b.bookmarkedAt ? new Date(b.bookmarkedAt).getTime() : 0;
        return bTime - aTime;
      });
    }

    // 次に、ソースでフィルタリング
    return selectedSource === "all"
      ? typeFilteredArticles
      : typeFilteredArticles.filter(
          (article) => article.source === selectedSource
        );
  };
};
```

## 4. ブックマーク機能の主な特徴

1. **リアルタイムな状態更新**

   - ブックマーク操作後、即座に UI 上で状態が反映
   - トースト通知による操作フィードバック
   - ブックマークボタンのローディング状態表示

2. **日付順ソート**

   - 「保存した記事」タブでは、ブックマークした日時の新しい順にソート
   - `bookmarkedAt`タイムスタンプを使用して正確な順序を維持

3. **エラーハンドリング**

   - 未ログイン状態でのブックマーク試行時のエラー表示
   - API 通信エラー時のフォールバック処理
   - トランザクションによるデータ整合性の確保

4. **パフォーマンス最適化**
   - クライアントサイドでのフィルタリングとソート
   - 状態更新の最適化による不要な再レンダリングの防止

## 5. 今後の改善点

1. **ブックマーク同期**

   - 複数デバイス間でのリアルタイム同期
   - オフライン対応とキャッシュ戦略

2. **パフォーマンス改善**

   - 大量のブックマークがある場合の仮想スクロール実装
   - ページネーションの導入

3. **機能拡張**

   - ブックマークのカテゴリ分け
   - ブックマークの検索機能
   - ブックマークの共有機能

4. **UI/UX 改善**
   - ドラッグ&ドロップによる並び替え
   - ブックマークのバッチ操作（一括削除など）
   - フィルタリングオプションの拡充
