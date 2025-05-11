import { NextRequest, NextResponse } from "next/server";
import { Article } from "@/lib/types/article";

async function fetchArticleBody(article: Article): Promise<string> {
  try {
    switch (article.source) {
      case "zenn": {
        // 例: https://zenn.dev/xxx/articles/abc123
        const match = article.url.match(/articles\/([a-zA-Z0-9_-]+)/);
        const slug = match ? match[1] : "";
        if (!slug) return "Zenn記事のslugが取得できませんでした。";
        const res = await fetch(`https://zenn.dev/api/articles/${slug}`);
        if (!res.ok) return `Zenn APIエラー: ${res.status}`;
        const json = await res.json();
        return (
          json.article?.body_html || "Zenn記事の本文が取得できませんでした。"
        );
      }
      case "qiita": {
        // 例: https://qiita.com/xxx/items/abc123
        const match = article.url.match(/items\/([a-zA-Z0-9]+)/);
        const itemId = match ? match[1] : "";
        if (!itemId) return "Qiita記事のIDが取得できませんでした。";
        const res = await fetch(`https://qiita.com/api/v2/items/${itemId}`);
        if (!res.ok) return `Qiita APIエラー: ${res.status}`;
        const json = await res.json();
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

export async function POST(req: NextRequest) {
  try {
    const { article } = await req.json();
    if (!article)
      return NextResponse.json({ error: "No article" }, { status: 400 });
    const body = await fetchArticleBody(article);
    return NextResponse.json({ body });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch article body" },
      { status: 500 }
    );
  }
}
