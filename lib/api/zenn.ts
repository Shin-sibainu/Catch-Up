import axios from 'axios';
import { Article } from '../types/article';

const ZENN_API_ENDPOINT = '/api/zenn';

export async function fetchZennArticles(): Promise<Article[]> {
  try {
    const response = await axios.get(ZENN_API_ENDPOINT);
    
    if (!response.data?.articles || !Array.isArray(response.data.articles)) {
      console.error('Invalid response format from Zenn API');
      return [];
    }

    return response.data.articles.map((article: any) => ({
      id: article.id?.toString() || '',
      title: article.title || '',
      url: article.path ? `https://zenn.dev${article.path}` : '',
      author: article.user?.name || 'Unknown',
      likes: typeof article.liked_count === 'number' ? article.liked_count : 0,
      timestamp: article.published_at ? new Date(article.published_at).toISOString() : new Date().toISOString(),
      source: 'zenn' as const,
      emoji: article.emoji || undefined,
      bookmarks: article.bookmarked_count || 0,
      publication: article.publication ? {
        name: article.publication.name || '',
        displayName: article.publication.display_name || '',
        avatarUrl: article.publication.avatar_small_url || undefined
      } : undefined
    }));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching Zenn articles:', error.message);
    } else {
      console.error('Error fetching Zenn articles:', error);
    }
    return [];
  }
}