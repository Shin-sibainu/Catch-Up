import axios from 'axios';
import { Article } from '../types/article';

const HN_API_URL = 'https://hacker-news.firebaseio.com/v0';

export async function fetchHackerNewsArticles(): Promise<Article[]> {
  try {
    const topStoriesResponse = await axios.get(`${HN_API_URL}/topstories.json`);
    if (!Array.isArray(topStoriesResponse.data)) {
      console.error('Invalid response format from Hacker News API');
      return [];
    }

    const storyIds = topStoriesResponse.data.slice(0, 20);
    const storyPromises = storyIds.map(async (id: number) => {
      try {
        const storyResponse = await axios.get(`${HN_API_URL}/item/${id}.json`);
        const story = storyResponse.data;
        
        if (!story) {
          return null;
        }

        return {
          id: story.id?.toString() || '',
          title: story.title || '',
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
          author: story.by || 'Unknown',
          likes: typeof story.score === 'number' ? story.score : 0,
          timestamp: story.time ? new Date(story.time * 1000).toISOString() : new Date().toISOString(),
          source: 'hackernews' as const
        };
      } catch (error) {
        console.error(`Error fetching Hacker News story ${id}:`, error);
        return null;
      }
    });

    const stories = await Promise.all(storyPromises);
    return stories.filter((story): story is Article => story !== null);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching Hacker News articles:', error.message);
    } else {
      console.error('Error fetching Hacker News articles:', error);
    }
    return [];
  }
}