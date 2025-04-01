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
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedType, setSelectedType] = useState("trending");
  // 記事の状態を管理
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  // ブックマーク状態が変更されたときのハンドラー
  const handleBookmarkChange = (
    articleId: string,
    isBookmarked: boolean,
    bookmarkedAt?: string
  ) => {
    setArticles((prevArticles) => {
      // 対象の記事を見つける
      const targetArticle = prevArticles.find(
        (article) => article.id === articleId
      );
      if (!targetArticle) return prevArticles;

      // 対象の記事以外の配列を作成
      const otherArticles = prevArticles.filter(
        (article) => article.id !== articleId
      );

      // 更新された記事
      const updatedArticle = {
        ...targetArticle,
        isBookmarked,
        bookmarkedAt,
      };

      // ブックマークが追加された場合は配列の先頭に、
      // 解除された場合は元の位置に戻す
      if (isBookmarked) {
        return [updatedArticle, ...otherArticles];
      } else {
        return [...otherArticles, updatedArticle];
      }
    });
  };

  // 選択されたタイプとソースに基づいて記事をフィルタリング
  const getFilteredArticles = () => {
    // まず、タイプでフィルタリング
    const typeFilteredArticles =
      selectedType === "bookmarks"
        ? articles.filter((article) => article.isBookmarked)
        : articles;

    // 次に、ソースでフィルタリング
    return selectedSource === "all"
      ? typeFilteredArticles
      : typeFilteredArticles.filter(
          (article) => article.source === selectedSource
        );
  };

  const filteredArticles = getFilteredArticles();

  return (
    <div className="space-y-8">
      <SourceSelector
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
        sources={initialSources}
      />
      <Tabs
        value={selectedType}
        className="w-full"
        onValueChange={setSelectedType}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending">人気の記事</TabsTrigger>
          <TabsTrigger value="latest">新着記事</TabsTrigger>
          <TabsTrigger value="bookmarks">保存した記事</TabsTrigger>
        </TabsList>
        <TabsContent value="trending">
          <ArticleList
            articles={filteredArticles}
            type="trending"
            onBookmarkChange={handleBookmarkChange}
          />
        </TabsContent>
        <TabsContent value="latest">
          <ArticleList
            articles={filteredArticles}
            type="latest"
            onBookmarkChange={handleBookmarkChange}
          />
        </TabsContent>
        <TabsContent value="bookmarks">
          <ArticleList
            articles={filteredArticles}
            type="bookmarks"
            onBookmarkChange={handleBookmarkChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
