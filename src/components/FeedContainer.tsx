'use client';

import { FeedItem } from './FeedItem';
import { MessageSquare, Wifi, WifiOff } from 'lucide-react';
import { useSocketFeed } from '@/lib/useSocketFeed';

export function FeedContainer() {
  const { 
    responses, 
    loading, 
    connected, 
    toggleLike, 
    hasUserLiked 
  } = useSocketFeed();
  
  return (
    <div className="h-full flex flex-col bg-cream-50 dark:bg-gray-800 overflow-hidden">
      <div className="p-3 border-b border-cream-100 dark:border-gray-700 bg-white dark:bg-gray-700 flex justify-between items-center">
        <h3 className="text-sm font-medium flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
          <MessageSquare className="h-3.5 w-3.5" />
          Shared Answer Feed
        </h3>
        
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          {connected ? (
            <div className="flex items-center gap-1">
              <Wifi className="h-3 w-3 text-green-500" />
              <span>Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <WifiOff className="h-3 w-3 text-gray-400" />
              <span>Offline</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
          </div>
        ) : responses.length > 0 ? (
          responses.map(response => (
            <FeedItem 
              key={response.id} 
              response={response} 
              onLike={() => toggleLike(response.id)}
              isLiked={hasUserLiked(response.id)}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
            <p>No shared responses yet.</p>
            <p className="mt-1 text-xs">Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );
} 