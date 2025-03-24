import { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, ThumbsUp } from "lucide-react";
import { Article } from "@/lib/types/article";

interface ArticleListProps {
  articles: Article[];
  type?: "trending" | "latest" | "bookmarks";
}

const sourceColors = {
  zenn: "border-t-[#3EA8FF]",
  qiita: "border-t-[#55C500]",
  hackernews: "border-t-[#FF6600]",
};

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

  // 記事がない場合のメッセージ
  if (sortedArticles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {type === "bookmarks"
          ? "ブックマークされた記事はありません"
          : "記事が見つかりませんでした"}
      </div>
    );
  }

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
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {article.emoji && <span className="mr-2">{article.emoji}</span>}
              {article.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="font-medium truncate">{article.author}</span>
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
                {article.likes}
              </span>
              {article.bookmarks !== undefined && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Bookmark className="h-4 w-4" />
                    {article.bookmarks}
                  </span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {new Date(article.timestamp).toLocaleDateString("ja-JP")}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-auto">
            <Button variant="outline" size="sm">
              <Bookmark className="mr-2 h-4 w-4" />
              保存
            </Button>
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
              onClick={() => window.open(article.url, "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              読む
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
