import axios from 'axios';

interface SentimentScore {
  positive: number;
  negative: number;
  neutral: number;
  overall: number;
}

export async function getSocialSentiment(symbol: string): Promise<SentimentScore> {
  try {
    // Fetch from multiple sources and aggregate
    const [redditSentiment, twitterSentiment] = await Promise.all([
      getRedditSentiment(symbol),
      getTwitterSentiment(symbol),
    ]);

    return combineScores([redditSentiment, twitterSentiment]);
  } catch (error) {
    return getDefaultScore();
  }
}

async function getRedditSentiment(symbol: string): Promise<SentimentScore> {
  // Using public Reddit API
  const response = await axios.get(
    `https://www.reddit.com/search.json?q=${symbol}&sort=new&limit=100`
  );

  return analyzePosts(response.data.data.children);
}

async function getTwitterSentiment(symbol: string): Promise<SentimentScore> {
  // Using Twitter public search
  const response = await axios.get(
    `https://nitter.net/search?q=%24${symbol}&f=tweets`
  );

  return analyzeTwitterPosts(response.data);
}

function analyzePosts(posts: any[]): SentimentScore {
  // Simple sentiment analysis based on keywords
  const sentiments = posts.map(post => analyzeText(post.data.title));
  return calculateAverageScore(sentiments);
}

function analyzeTwitterPosts(html: string): SentimentScore {
  // Extract tweets and analyze sentiment
  const tweets = extractTweets(html);
  const sentiments = tweets.map(tweet => analyzeText(tweet));
  return calculateAverageScore(sentiments);
}

function analyzeText(text: string): SentimentScore {
  // Basic sentiment analysis using keyword matching
  const positive = countKeywords(text, positiveKeywords);
  const negative = countKeywords(text, negativeKeywords);
  const total = text.split(' ').length;

  return {
    positive: positive / total,
    negative: negative / total,
    neutral: (total - positive - negative) / total,
    overall: (positive - negative) / total,
  };
}

function getDefaultScore(): SentimentScore {
  return {
    positive: 0,
    negative: 0,
    neutral: 1,
    overall: 0,
  };
}

const positiveKeywords = [
  'bull', 'buy', 'long', 'up', 'gain', 'profit', 'moon', 'rocket',
  'breakthrough', 'success', 'growth', 'strong', 'potential',
];

const negativeKeywords = [
  'bear', 'sell', 'short', 'down', 'loss', 'crash', 'fail', 'risk',
  'weak', 'debt', 'bankruptcy', 'decline', 'drop',
];

function countKeywords(text: string, keywords: string[]): number {
  const lowercaseText = text.toLowerCase();
  return keywords.reduce((count, keyword) => 
    count + (lowercaseText.match(new RegExp(keyword, 'g')) || []).length, 0
  );
}

function calculateAverageScore(scores: SentimentScore[]): SentimentScore {
  const total = scores.length || 1;
  return {
    positive: scores.reduce((sum, score) => sum + score.positive, 0) / total,
    negative: scores.reduce((sum, score) => sum + score.negative, 0) / total,
    neutral: scores.reduce((sum, score) => sum + score.neutral, 0) / total,
    overall: scores.reduce((sum, score) => sum + score.overall, 0) / total,
  };
}

function combineScores(scores: SentimentScore[]): SentimentScore {
  return calculateAverageScore(scores);
}

function extractTweets(html: string): string[] {
  // Basic tweet extraction from HTML
  const tweetRegex = /<div class="tweet-content">([^<]+)<\/div>/g;
  const matches = [...html.matchAll(tweetRegex)];
  return matches.map(match => match[1]);
}