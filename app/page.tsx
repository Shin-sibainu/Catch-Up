import PageHeader from "@/components/common/page-header";
import { TrendingArticles } from "@/components/trending/trending-articles";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

export default function Home() {
  return (
    <main className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader
        title="Catch Up"
        description="エンジニアのための技術記事トレンドをまとめてチェック"
      />
      <Suspense fallback={<LoadingSkeleton />}>
        <TrendingArticles />
      </Suspense>
    </main>
  );
}
