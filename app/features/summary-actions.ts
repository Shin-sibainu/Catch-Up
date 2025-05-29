"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Article } from "@/lib/types/article";
import { decrementUserCredit } from "@/app/features/user-credits";
import { auth } from "@clerk/nextjs/server";

// HTMLタグを除去してプレーンテキストに変換する関数
function stripHtmlTags(html: string): string {
  // HTMLタグを除去
  let text = html.replace(/<[^>]*>/g, "");
  // HTMLエンティティをデコード
  text = text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  // 連続する空白や改行を整理
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

async function fetchArticleBody(article: Article): Promise<string> {
  try {
    switch (article.source) {
      case "zenn": {
        const match = article.url.match(/articles\/([a-zA-Z0-9_-]+)/);
        const slug = match ? match[1] : "";
        if (!slug) return "Zenn記事のslugが取得できませんでした。";
        const res = await fetch(`https://zenn.dev/api/articles/${slug}`);
        if (!res.ok) return `Zenn APIエラー: ${res.status}`;
        const json = await res.json();

        // まずMarkdown形式の本文を試す
        if (json.article?.body_markdown) {
          return json.article.body_markdown;
        }
        // Markdown形式がない場合はHTMLからタグを除去
        if (json.article?.body_html) {
          return stripHtmlTags(json.article.body_html);
        }
        return "Zenn記事の本文が取得できませんでした。";

        return (
          json.article?.body_html || "Zenn記事の本文が取得できませんでした。"
        );
      }
      case "qiita": {
        const match = article.url.match(/items\/([a-zA-Z0-9]+)/);
        const itemId = match ? match[1] : "";
        if (!itemId) return "Qiita記事のIDが取得できませんでした。";
        const res = await fetch(`https://qiita.com/api/v2/items/${itemId}`);
        if (!res.ok) return `Qiita APIエラー: ${res.status}`;
        const json = await res.json();

        // まずMarkdown形式の本文を試す
        if (json.body) {
          return json.body;
        }
        // Markdown形式がない場合はHTMLからタグを除去
        if (json.rendered_body) {
          return stripHtmlTags(json.rendered_body);
        }
        return "Qiita記事の本文が取得できませんでした。";
        return json.rendered_body || "Qiita記事の本文が取得できませんでした。";
      }
      case "hackernews": {
        let id = article.url.split("id=").pop();
        if (!id || isNaN(Number(id))) {
          id = article.url.split("/").pop();
        }
        const res = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        if (!res.ok) return "";
        const json = await res.json();
        if (json.text) {
          return json.text;
        } else if (json.url) {
          return `このHackerNews記事は外部リンク（${json.url}）です。本文はありません。`;
        } else {
          return "このHackerNews記事には本文も外部リンクもありません。";
        }
      }
      default:
        return "";
    }
  } catch (e) {
    return "記事本文の取得中にエラーが発生しました。";
  }
}

export async function summarizeArticle(article: Article): Promise<{
  summary: string;
  fetchError?: string;
  summaryError?: string;
  creditError?: string;
}> {
  // ユーザー認証・クレジット消費
  const { userId } = await auth();
  if (!userId) {
    return { summary: "", creditError: "ログインが必要です" };
  }
  const dec = await decrementUserCredit(userId);
  if (!dec.success) {
    return {
      summary: "",
      creditError: dec.error || "クレジットが不足しています",
    };
  }
  // 本文取得
  const body = await fetchArticleBody(article);
  if (!body) {
    return { summary: "", fetchError: "記事本文が取得できませんでした。" };
  }
  // 外部リンクや取得エラーの場合はそのまま返す
  if (
    body.startsWith("Zenn記事") ||
    body.startsWith("Qiita記事") ||
    body.startsWith("このHackerNews記事")
  ) {
    return { summary: body };
  }
  // Gemini要約
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      summary: "",
      summaryError: "Gemini APIキーが設定されていません。",
    };
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `\n以下のテキストを日本語で、重要なポイントや内容の流れが分かるように、できるだけ詳細に要約してください。\n・要点を漏らさず、内容の構成や流れも分かるようにまとめてください。\n・必要に応じて段落や箇条書きも使ってください。\n・専門用語や固有名詞はそのまま残してください。\n・長くなっても良いので、読み手が内容を把握しやすいようにしてください。\n・要点や重要なポイントは必ず「* 」または「1. 」で始めるMarkdown形式で出力してください。\n\n【本文】\n${body}`;
    const result = await model.generateContent(prompt);
    const summaryRaw =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
      result.response.text ||
      "";
    const summary = typeof summaryRaw === "string" ? summaryRaw : "";
    return { summary };
  } catch (e) {
    return { summary: "", summaryError: "Gemini APIで要約に失敗しました。" };
  }
}
