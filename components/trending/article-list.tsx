"use client";

import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  ExternalLink as ExternalLinkIcon,
  ThumbsUp,
  Loader2,
} from "lucide-react";
import { Article } from "@/lib/types/article";
import { bookmarkArticle } from "@/lib/dal/articles";
import { useUser } from "@clerk/nextjs";
import { useArticles, ArticleType } from "@/lib/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { VideoCourses } from "./video-courses";

interface ArticleListProps {
  type?: ArticleType;
  source?: string;
  onBookmarkChange?: () => void;
  userId?: string;
}

const sourceColors = {
  zenn: "border-t-[#3EA8FF]",
  qiita: "border-t-[#55C500]",
  hackernews: "border-t-[#FF6600]",
  courses: "border-t-[#A435F0]",
};

// 仮のデータ（後で実際のデータに置き換え）
const TEMP_COURSES = [
  {
    id: "dev-course-1",
    title:
      "画像生成AI SaaSを作りながらNext.js App RouterとStripeサブスク決済機能が学べる実践開発講座",
    description:
      "Next.js App Router/Stripe/Clerk/Prisma/Stable Difussion APIを使ってAI SaaSを開発します。個人開発では必須のStripe決済機能実装とClerk認証まで学べます。",
    url: "https://www.udemy.com/course/ai-saas-nextjs-app-router-with-stripe/?couponCode=A98108054E0F720932E7",
    thumbnail: "/images/courses/ai-saas-with-nextjs-and-stripe.png",
  },
  {
    id: "dev-course-2",
    title:
      "実例で学ぶNext.js App Routerの基礎とベストプラクティス完全マスター講座",
    description:
      "Next.js AppRouter開発における基礎とベストプラクティスを網羅的に学べる講座です。ルーティング/コンポーネント/データフェッチ/キャッシュ/レンダリング/メタデータ/ミドルウェアまでこの講座1つで完全マスターできます。",
    url: "https://www.udemy.com/course/nextjs-app-router-basic-and-best-practice/?couponCode=E70FB08D750BAD1063E2",
    thumbnail: "/images/courses/nextjs-best-practice-for-udemy-mod.png",
  },
  {
    id: "dev-course-3",
    title:
      "【最先端】Next.js15マスター講座 - ServerActions/新登場HooksをSNS開発で理解しよう -",
    description:
      "Next.js15をSNSを開発で学ぶ講座です。useOptimistic/useFormState/ServerActionsを学ぶことができます。認証はClerkを採用しておりWebhooksを使ってSupabaseとの連携まで行います",
    url: "https://www.udemy.com/course/nextjs15-newhooks-with-sns-dev/?couponCode=393DB5488195D49A9141",
    thumbnail: "/images/courses/nextjs15-new-hooks-shincode-camp.png",
  },
  {
    id: "dev-course-20",
    title:
      "Next.js × shadcn/ui × Supabaseで本格的なWebアプリ開発を学ぶフルスタック講座",
    description:
      "世界トップクラスのエンジニア「shadcn」のプロジェクトからモダンな技術スタックを通して、Webアプリ開発を学ぶ講座です。API Routeを使ったAPI開発やNextAuth.jsを使ったユーザー認証まで幅開く解説しています。",
    url: "https://www.udemy.com/course/nextjs-shadcn-fullstack-webapp-dev/?couponCode=83791B1FC10701AC3864",
    thumbnail: "/images/courses/stripe-with-creating-saas-mod.png",
  },
];

export const ArticleList: FC<ArticleListProps> = ({
  type = "trending",
  source = "all",
  onBookmarkChange,
  userId,
}) => {
  const { toast } = useToast();
  const { user } = useUser();
  const { articles, isLoading, error, mutate } = useArticles(
    source,
    userId || user?.id,
    type
  );
  const [bookmarkingStates, setBookmarkingStates] = useState<{
    [key: string]: boolean;
  }>({});

  // エラー表示
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        エラーが発生しました。しばらくしてから再度お試しください。
      </div>
    );
  }

  // ローディング表示
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="mt-auto">
              <Skeleton className="h-8 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // typeに基づいて記事をソート
  const sortedArticles = [...articles]
    .filter((article) => {
      // sourceが"courses"の場合は動画講座を表示
      if (source === "courses") {
        return false; // 記事を表示せず、後でVideoCoursesコンポーネントで表示
      }
      // sourceが"all"の場合は全ての記事を表示（courses以外）
      if (source === "all") return article.source !== "courses";
      // それ以外の場合は選択されたソースの記事のみを表示
      return article.source === source;
    })
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
      } else if (type === "bookmarks") {
        // ブックマークした日時の新しい順
        const aTime = a.bookmarkedAt ? new Date(a.bookmarkedAt).getTime() : 0;
        const bTime = b.bookmarkedAt ? new Date(b.bookmarkedAt).getTime() : 0;
        return bTime - aTime;
      }
      return 0; // デフォルト（変更なし）
    })
    .slice(0, 30); // 必要に応じて上位30件に制限

  // sourceが"courses"の場合はVideoCoursesコンポーネントを表示
  if (source === "courses") {
    return <VideoCourses courses={TEMP_COURSES} />;
  }

  // 記事がない場合のメッセージ
  if (sortedArticles.length === 0 && source !== "courses") {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {type === "bookmarks"
          ? "ブックマークされた記事はありません"
          : "記事が見つかりませんでした"}
      </div>
    );
  }

  // 記事のブックマーク処理
  const handleBookmark = async (article: Article) => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "ブックマークするにはログインが必要です",
      });
      return;
    }

    setBookmarkingStates((prev) => ({ ...prev, [article.id]: true }));

    try {
      // 即時的なUI更新のために、楽観的な更新を行う
      const optimisticData = sortedArticles.map((a) => {
        if (a.id === article.id) {
          return {
            ...a,
            isBookmarked: !a.isBookmarked,
            bookmarkedAt: !a.isBookmarked
              ? new Date().toISOString()
              : undefined,
          };
        }
        return a;
      });

      // 楽観的更新を即時反映
      mutate(optimisticData);

      const response = await bookmarkArticle(user.id, article);

      if (response.success) {
        const result = response;

        // サーバーからの応答に基づいて最終的な更新を行う
        const updatedArticles = sortedArticles.map((a) => {
          if (a.id === article.id) {
            return {
              ...a,
              isBookmarked: result.action === "added",
              bookmarkedAt: result.bookmarkedAt,
            };
          }
          return a;
        });

        mutate(updatedArticles);

        toast({
          description:
            result.action === "added"
              ? "ブックマークに追加しました"
              : "ブックマークを解除しました",
        });

        // 親コンポーネントに通知
        onBookmarkChange?.();
      } else {
        // エラー時は楽観的更新を元に戻す
        mutate(sortedArticles);
        toast({
          variant: "destructive",
          description: "ブックマークの更新に失敗しました",
        });
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      // エラー時は楽観的更新を元に戻す
      mutate(sortedArticles);
      toast({
        variant: "destructive",
        description: "ブックマークの更新に失敗しました",
      });
    } finally {
      setBookmarkingStates((prev) => ({ ...prev, [article.id]: false }));
    }
  };

  // 記事リストの表示
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
      {sortedArticles.map((article) => (
        <Card
          key={article.id}
          className={`flex flex-col border-t-4 transition-transform hover:scale-[1.01] ${
            sourceColors[article.source] || ""
          }`}
        >
          <CardHeader>
            <Link
              href={article.url}
              className="text-lg font-semibold line-clamp-2 hover:text-primary transition-colors hover:underline underline-offset-1"
              target="_blank"
              rel="noreferrer"
            >
              {article.emoji && <span className="mr-2">{article.emoji}</span>}
              {article.title}
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="font-medium truncate">
                {article.author || "Unknown"}
              </span>
              {article.publication && (
                <>
                  <span>•</span>
                  <span className="truncate">
                    {article.publication.displayName}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {typeof article.likes === "number"
                  ? article.likes.toLocaleString()
                  : "0"}
              </span>
              {typeof article.bookmarks === "number" && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Bookmark className="h-4 w-4" />
                    {article.bookmarks.toLocaleString()}
                  </span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {article.timestamp
                ? new Date(article.timestamp).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "日付なし"}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-auto">
            <Button
              variant="outline"
              size="sm"
              disabled={bookmarkingStates[article.id]}
              onClick={() => handleBookmark(article)}
              className="min-w-[80px]"
            >
              {bookmarkingStates[article.id] ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bookmark
                  className={`mr-2 h-4 w-4 ${
                    article.isBookmarked ? "fill-current" : ""
                  }`}
                />
              )}
              {bookmarkingStates[article.id]
                ? ""
                : article.isBookmarked
                ? "解除"
                : "保存"}
            </Button>
            <Link href={article.url} target="_blank" rel="noreferrer">
              <Button
                variant="default"
                size="sm"
                className={`${
                  article.source === "zenn"
                    ? "bg-[#3EA8FF]"
                    : article.source === "qiita"
                    ? "bg-[#55C500]"
                    : article.source === "hackernews"
                    ? "bg-[#FF6600]"
                    : ""
                } hover:opacity-90`}
              >
                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                読む
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
