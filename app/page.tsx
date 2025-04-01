import PageHeader from "@/components/common/page-header";
import { TrendingArticles } from "@/components/trending/trending-articles";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { fetchAllArticles, getSources } from "@/lib/dal/articles";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  return (
    <main className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader
        title="Catch Up"
        description="エンジニアのための技術記事トレンドをまとめてチェック"
      />
      <Suspense fallback={<LoadingSkeleton />}>
        <ArticlesContainer />
      </Suspense>
    </main>
  );
}

async function ArticlesContainer() {
  const { userId } = await auth();

  // ユーザーIDを渡してfetchAllArticlesを呼び出し
  const articles = await fetchAllArticles("all", {
    revalidate: 21600,
    userId: userId || undefined,
  });
  const sources = await getSources();

  return (
    <TrendingArticles initialArticles={articles} initialSources={sources} />
  );
}
