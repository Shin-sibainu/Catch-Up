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

// Markdownの**太字**をHTMLの<strong>太字</strong>に変換する関数を追加
function markdownToHtml(text: string): string {
  // 太字
  let html = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // 箇条書き（* で始まる連続行を<ul><li>...</li></ul>に変換）
  // html = html.replace(/(^|\n)((\* .+(\n|$))+)/g, (match, p1, p2) => {
  //   const items = p2
  //     .trim()
  //     .split(/\n/)
  //     .filter((line: string) => /^\* /.test(line))
  //     .map((line: string) => `<li>${line.replace(/^\* /, "").trim()}</li>`)
  //     .join("");
  //   return `\n<ul>${items}</ul>`;
  // });
  // 番号付きリスト（1. ... で始まる連続行を<ol><li>...</li></ol>に変換）
  html = html.replace(/(^|\n)((\d+\. .+(\n|$))+)/g, (match, p1, p2) => {
    const items = p2
      .trim()
      .split(/\n/)
      .filter((line: string) => /^\d+\. /.test(line))
      .map((line: string) => `<li>${line.replace(/^\d+\. /, "").trim()}</li>`)
      .join("");
    return `\n<ol>${items}</ol>`;
  });
  // * で始まる行をすべて<ul><li>...</li></ul>に
  html = html.replace(/^\* (.+)$/gm, "<ul><li>$1</li></ul>");
  // 連続した</ul><ul>を1つにまとめる
  html = html.replace(/<\/ul>\s*<ul>/g, "");
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI要約</DialogTitle>
          <DialogDescription>記事タイトル: {article.title}</DialogDescription>
        </DialogHeader>
        <div className="py-4 min-h-[60px] max-h-[60vh] overflow-y-auto">
          {fetchingBody ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin h-5 w-5" />
              記事本文を取得中...
            </div>
          ) : fetchError ? (
            <div className="text-red-500">{fetchError}</div>
          ) : summaryError ? (
            <div className="text-red-500">{summaryError}</div>
          ) : isSummarizing ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="relative">
                <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
                <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-yellow-400 animate-pulse" />
              </div>
              <div className="text-lg font-semibold text-purple-700">
                AIが要約を生成しています
              </div>
              <div className="text-sm text-muted-foreground animate-pulse">
                しばらくお待ちください...
              </div>
            </div>
          ) : (
            <div
              className="whitespace-pre-line text-base"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(summary) }}
            />
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
