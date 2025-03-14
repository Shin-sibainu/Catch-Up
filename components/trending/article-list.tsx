import { FC } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, ThumbsUp } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import { ArticleType } from "@/lib/api/articles";

interface ArticleListProps {
  source: string;
  type: ArticleType;
}

const sourceColors = {
  zenn: "border-t-[#3EA8FF]",
  qiita: "border-t-[#55C500]",
  hackernews: "border-t-[#FF6600]",
};

export const ArticleList: FC<ArticleListProps> = ({ source, type }) => {
  const { articles, isLoading, isError } = useArticles(source, type);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="flex flex-col animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">記事の取得中にエラーが発生しました。</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
      {articles.map((article) => (
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
                  <span className="truncate">{article.publication.displayName}</span>
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
              {new Date(article.timestamp).toLocaleDateString('ja-JP')}
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
                article.source === 'zenn' ? 'bg-[#3EA8FF]' : 
                article.source === 'qiita' ? 'bg-[#55C500]' : 
                article.source === 'hackernews' ? 'bg-[#FF6600]' : ''
              } hover:opacity-90`}
              onClick={() => window.open(article.url, '_blank')}
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