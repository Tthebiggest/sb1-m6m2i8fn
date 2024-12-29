import axios from 'axios';
import { API_CONFIG } from '../utils/apiConfig';
import { checkRateLimit } from '../utils/apiUtils';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

export async function fetchAssetNews(symbol: string, type: 'stock' | 'crypto'): Promise<NewsItem[]> {
  try {
    checkRateLimit('NEWS_API');
    
    const query = type === 'crypto' 
      ? `${symbol} cryptocurrency`
      : `${symbol} stock`;

    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: query,
        apiKey: NEWS_API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 5,
      },
    });

    return response.data.articles.map((article: any) => ({
      id: article.url,
      title: article.title,
      summary: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      imageUrl: article.urlToImage,
    }));
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}