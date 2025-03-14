import axios from 'axios';
import { Article } from '../types/article';

const QIITA_API_ENDPOINT = '/api/qiita';

export async function fetchQiitaArticles(): Promise<Article[]> {
  try {
    const response = await axios.get(QIITA_API_ENDPOINT);
    
    if (!Array.isArray(response.data)) {
      console.error('Invalid response format from Qiita API');
      return [];
    }
    
    return response.data.map((article: any) => ({
      id: article.id?.toString() || '',
      title: article.title || '',
      url: article.url || '',
      author: article.user?.name || article.user?.id || 'Unknown',
      likes: typeof article.likes_count === 'number' ? article.likes_count : 0,
      timestamp: article.created_at ? new Date(article.created_at).toISOString() : new Date().toISOString(),
      source: 'qiita' as const,
      bookmarks: article.stocks_count || 0
    }));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching Qiita articles:', error.message);
    } else {
      console.error('Error fetching Qiita articles:', error);
    }
    return [];
  }
}