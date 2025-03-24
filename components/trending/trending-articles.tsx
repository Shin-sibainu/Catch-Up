"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleList } from "./article-list";
import { SourceSelector } from "./source-selector";
import { Article, Source } from "@/lib/types/article";

interface TrendingArticlesProps {
  initialArticles: Article[];
  initialSources: Source[];
}

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
