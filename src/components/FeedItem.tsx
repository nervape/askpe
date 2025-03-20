'use client';

import { useState, useEffect } from 'react';
import { SharedResponse } from '@/lib/types';
import { currentUserId, feedDb } from '@/lib/db';
import { Heart } from 'lucide-react';
import { getPresetById } from '@/lib/presets';
import { getLanguageById } from '@/lib/languages';

interface FeedItemProps {
  response: SharedResponse;
  onLike: () => Promise<any>;
  isLiked: boolean;
}

export function FeedItem({ response, onLike, isLiked }: FeedItemProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(response.likeCount);
  const [isLiking, setIsLiking] = useState(false);
  
  // Format the timestamp
  const formattedDate = new Date(response.timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  // Get preset and language info
  const preset = getPresetById(response.presetId);
  const language = getLanguageById(response.languageId);
  
  // Update state when props change
  useEffect(() => {
    setIsLikedState(isLiked);
    setLikeCount(response.likeCount);
  }, [isLiked, response.likeCount]);
  
  const handleLike = async () => {
    if (isLiking) return;
    
    try {
      setIsLiking(true);
      // Invoke the onLike callback but don't update UI optimistically
      // The UI will update when the server responds via WebSocket
      await onLike();
      
      // No optimistic updates - UI will be updated by parent when server responds
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-cream-100 dark:border-gray-600 p-4 transition-colors mb-3">
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 p-[1px] shrink-0">
          <div className="h-full w-full rounded-full overflow-hidden bg-white flex items-center justify-center">
            <img 
              src="/ape.webp" 
              alt="Ape Oracle" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span className="font-medium">{preset.name}</span>
              <span>•</span>
              <span>{formattedDate}</span>
              {response.languageId !== 'en' && (
                <>
                  <span>•</span>
                  <span>{language.name}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            {response.originalContent && (
              <>
                <p className="text-gray-700 dark:text-gray-200 text-sm whitespace-pre-wrap">
                  {showOriginal ? response.originalContent : response.responseContent}
                </p>
                
                {response.languageId !== 'en' && (
                  <button 
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="text-xs px-1.5 py-0.5 mt-2 rounded bg-rose-100 dark:bg-rose-200/20 
                              text-rose-500 dark:text-rose-300 hover:bg-rose-200 
                              dark:hover:bg-rose-200/30 transition-colors"
                  >
                    {showOriginal ? `Show ${language.name}` : 'Show Original'}
                  </button>
                )}
              </>
            )}
            
            {!response.originalContent && (
              <p className="text-gray-700 dark:text-gray-200 text-sm whitespace-pre-wrap">
                {response.responseContent}
              </p>
            )}
          </div>
          
          <div className="mt-2 flex items-center gap-2">
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-300 transition-colors"
            >
              <Heart 
                className={`h-3.5 w-3.5 ${isLikedState ? 'fill-rose-500 text-rose-500 dark:fill-rose-300 dark:text-rose-300' : ''}`} 
              />
              <span>{likeCount > 0 ? likeCount : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 