import { Article } from "@/lib/types/article";

export async function fetchArticleBody(article: Article): Promise<string> {
  try {
    switch (article.source) {
      case "zenn": {
        const slug = article.url.split("/").pop();
        const res = await fetch(`https://zenn.dev/api/articles/${slug}`);
        if (!res.ok) return "";
        const json = await res.json();
        return json.article?.body_html || "";
      }
      case "qiita": {
        const itemId = article.url.split("/").pop();
        const res = await fetch(`https://qiita.com/api/v2/items/${itemId}`);
        if (!res.ok) return "";
        const json = await res.json();
        return json.rendered_body || "";
      }
      case "hackernews": {
        // HackerNewsはURLにid=が含まれる場合と、idのみの場合がある
        let id = article.url.split("id=").pop();
        if (!id || isNaN(Number(id))) {
          // それ以外はURL末尾
          id = article.url.split("/").pop();
        }
        const res = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        if (!res.ok) return "";
        const json = await res.json();
        return json.text || "";
      }
      default:
        return "";
    }
  } catch (e) {
    return "";
  }
}
