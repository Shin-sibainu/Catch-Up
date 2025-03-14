import useSWR from 'swr';
import { Article } from '@/lib/types/article';
import { fetchAllArticles, ArticleType } from '@/lib/api/articles';

export function useArticles(source: string, type: ArticleType = 'trending') {
  const { data, error, isLoading } = useSWR(
    ['articles', source, type],
    () => fetchAllArticles(source, type),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false
    }
  );

  return {
    articles: data || [],
    isLoading,
    isError: error
  };
}