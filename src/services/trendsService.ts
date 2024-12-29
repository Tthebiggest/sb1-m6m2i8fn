import axios from 'axios';
import { fetchWithRetry } from '../utils/api';

const GOOGLE_TRENDS_API = 'https://trends.google.com/trends/api/dailytrends';

interface TrendData {
  searchInterest: number;
  relatedQueries: string[];
}

export async function getSearchTrends(query: string): Promise<TrendData> {
  try {
    const response = await axios.get(`${GOOGLE_TRENDS_API}`, {
      params: {
        hl: 'en-US',
        geo: 'US',
        q: query,
      },
    });
    
    return {
      searchInterest: response.data.interest || 0,
      relatedQueries: response.data.queries || [],
    };
  } catch (error) {
    return {
      searchInterest: 0,
      relatedQueries: [],
    };
  }
}