import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { NewsItem } from '../services/newsService';
import { formatDistanceToNow } from 'date-fns';

interface NewsFeedProps {
  news: NewsItem[];
  isLoading: boolean;
}

export function NewsFeed({ news, isLoading }: NewsFeedProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No recent news available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <article key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-4"
          >
            <div className="flex justify-between items-start gap-4">
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt="" 
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {item.summary}
                </p>
                <div className="flex items-center text-xs text-gray-500 gap-4">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                  </span>
                  <span className="flex items-center gap-1">
                    <ExternalLink size={12} />
                    {item.source}
                  </span>
                </div>
              </div>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}