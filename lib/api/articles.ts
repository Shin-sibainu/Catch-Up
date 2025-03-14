import { Article } from '../types/article';
import { fetchZennArticles } from './zenn';
import { fetchQiitaArticles } from './qiita';
import { fetchHackerNewsArticles } from './hackernews';

export type ArticleType = 'trending' | 'latest' | 'bookmarks';

export async function fetchAllArticles(source: string = 'all', type: ArticleType = 'trending'): Promise<Article[]> {
  try {
    let articles: Article[] = [];

    if (source === 'all' || source === 'zenn') {
      const zennArticles = await fetchZennArticles();
      articles = [...articles, ...zennArticles];
    }

    if (source === 'all' || source === 'qiita') {
      const qiitaArticles = await fetchQiitaArticles();
      articles = [...articles, ...qiitaArticles];
    }

    if (source === 'all' || source === 'hackernews') {
      const hnArticles = await fetchHackerNewsArticles();
      articles = [...articles, ...hnArticles];
    }

    // Sort articles based on type
    if (type === 'trending') {
      // Sort by likes (and bookmarks if available) in descending order
      return articles
        .sort((a, b) => {
          const aScore = a.likes + (a.bookmarks || 0);
          const bScore = b.likes + (b.bookmarks || 0);
          return bScore - aScore;
        })
        .slice(0, 10); // Get top 10 trending articles
    } else if (type === 'latest') {
      // Sort by timestamp in descending order (newest first)
      return articles
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10); // Get 10 most recent articles
    }

    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}