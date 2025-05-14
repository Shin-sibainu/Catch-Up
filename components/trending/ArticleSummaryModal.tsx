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
            <div className="text-red-500">{fetchError}</div>
          ) : summaryError ? (
            <div className="text-red-500">{summaryError}</div>
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
