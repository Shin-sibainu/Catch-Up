import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { Article } from "@/lib/types/article";

interface ArticleSummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: Article;
  isSummarizing: boolean;
  summary: string;
  onTrigger: () => void;
  fetchingBody?: boolean;
  fetchError?: string | null;
  summaryError?: string | null;
}

// Markdownを見やすいHTMLに変換する関数
function markdownToHtml(text: string): string {
  let html = text;

  // 1. 見出しを処理（## で始まる行）
  html = html.replace(
    /^## (.+)$/gm,
    '<h3 class="text-lg font-bold text-gray-800 mt-6 mb-3 pb-2 border-b border-gray-200 first:mt-0">$1</h3>'
  );

  // 2. 太字を処理
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-semibold text-gray-900">$1</strong>'
  );

  // 3. 番号付きリストを処理
  html = html.replace(/^(\d+\. .+)$/gm, (match) => {
    const content = match.replace(/^\d+\. /, "");
    return `<li class="numbered-list-item">${content}</li>`;
  });

  // 4. 箇条書きを処理（見出しでない * で始まる行）
  html = html.replace(/^\* (.+)$/gm, (match, content) => {
    return `<li class="bullet-list-item">${content}</li>`;
  });

  // 5. 連続するリスト項目をグループ化
  html = html.replace(
    /(<li class="numbered-list-item">.*?<\/li>\s*)+/g,
    '<ol class="list-decimal list-inside space-y-2 my-4 pl-4 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">$&</ol>'
  );

  html = html.replace(
    /(<li class="bullet-list-item">.*?<\/li>\s*)+/g,
    '<ul class="space-y-2 my-4 pl-6 bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">$&</ul>'
  );

  // 6. 段落を処理
  html = html
    .split("\n")
    .map((line) => {
      line = line.trim();
      if (!line) return "";
      if (line.startsWith("<")) return line; // HTMLタグはそのまま
      return `<p class="mb-4 text-gray-700 leading-relaxed">${line}</p>`;
    })
    .join("\n");

  // 7. 空の段落を削除
  html = html.replace(/<p[^>]*><\/p>/g, "");

  return html;
}

export const ArticleSummaryModal: React.FC<ArticleSummaryModalProps> = ({
  open,
  onOpenChange,
  article,
  isSummarizing,
  summary,
  onTrigger,
  fetchingBody,
  fetchError,
  summaryError,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          onClick={onTrigger}
          className="min-w-[90px] bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-500 hover:to-pink-500 hover:shadow-sm transition-all duration-200 border-0"
        >
          <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />
          AI要約
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>AI要約</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-2">
            <strong>記事:</strong> {article.title}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 min-h-[60px] max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {fetchingBody || isSummarizing ? (
            <div className="flex flex-col items-center gap-6 py-10">
              <div className="relative flex items-center justify-center mb-2">
                {/* グラデーションのアニメーション円（Tailwindのみ） */}
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-yellow-300 opacity-40 blur-md scale-110 animate-spin" />
                {/* Sparkles複数配置 */}
                <Sparkles className="absolute -top-3 left-3 h-7 w-7 text-yellow-300 animate-pulse" />
                <Sparkles className="absolute top-10 right-0 h-5 w-5 text-pink-400 animate-pulse delay-200" />
                <Sparkles className="absolute bottom-2 left-10 h-4 w-4 text-purple-400 animate-pulse delay-500" />
                <Loader2 className="h-14 w-14 text-purple-500 animate-spin z-10 drop-shadow-lg" />
              </div>
              <div className="text-2xl font-bold text-purple-700 tracking-wide  mb-1">
                AI要約中...
              </div>

              <div className="text-sm text-muted-foreground  text-center">
                しばらくお待ちください。
                <br />
                AIが記事本文を解析し、要点を抽出しています。
              </div>
            </div>
          ) : fetchError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-medium">
                  エラーが発生しました
                </span>
              </div>
              <p className="text-red-600 mt-2 text-sm">{fetchError}</p>
            </div>
          ) : summaryError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-medium">要約エラー</span>
              </div>
              <p className="text-red-600 mt-2 text-sm">{summaryError}</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
              {/* ヘッダー */}
              <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="font-semibold text-gray-800">AI要約結果</span>
              </div>

              {/* 要約内容 */}
              <div
                className="prose prose-sm max-w-none"
                style={{
                  lineHeight: "1.7",
                  fontSize: "15px",
                }}
                dangerouslySetInnerHTML={{ __html: markdownToHtml(summary) }}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">閉じる</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
