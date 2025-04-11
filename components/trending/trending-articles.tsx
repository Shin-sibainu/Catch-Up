"use client";

import { FC, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleList } from "./article-list";
import { SourceSelector } from "./source-selector";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export const TrendingArticles: FC = () => {
  const [selectedSource, setSelectedSource] = useState("all");
  const { user } = useUser();

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
  };

  return (
    <div>
      <div className="mb-8">
        <SourceSelector
          selectedSource={selectedSource}
          onSourceChange={handleSourceChange}
        />
      </div>
      <Tabs defaultValue="trending" className="w-full">
        <TabsList
          className={cn(
            "grid w-full mb-8",
            user ? "grid-cols-3" : "grid-cols-2"
          )}
        >
          <TabsTrigger value="trending">トレンド</TabsTrigger>
          <TabsTrigger value="latest">最新</TabsTrigger>
          {user && <TabsTrigger value="bookmarks">保存済み</TabsTrigger>}
        </TabsList>
        <TabsContent value="trending">
          <ArticleList type="trending" source={selectedSource} />
        </TabsContent>
        <TabsContent value="latest">
          <ArticleList type="latest" source={selectedSource} />
        </TabsContent>
        {user && (
          <TabsContent value="bookmarks">
            <ArticleList
              type="bookmarks"
              source={selectedSource}
              userId={user.id}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
