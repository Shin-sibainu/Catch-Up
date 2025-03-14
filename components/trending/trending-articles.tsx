"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleList } from "./article-list";
import { SourceSelector } from "./source-selector";

export const TrendingArticles = () => {
  const [selectedSource, setSelectedSource] = useState("all");

  return (
    <div className="space-y-8">
      <SourceSelector 
        selectedSource={selectedSource} 
        onSourceChange={setSelectedSource} 
      />
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>
        <TabsContent value="trending">
          <ArticleList source={selectedSource} type="trending" />
        </TabsContent>
        <TabsContent value="latest">
          <ArticleList source={selectedSource} type="latest" />
        </TabsContent>
        <TabsContent value="bookmarks">
          <ArticleList source={selectedSource} type="bookmarks" />
        </TabsContent>
      </Tabs>
    </div>
  );
};