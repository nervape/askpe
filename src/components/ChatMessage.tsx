'use client';

import { ChatMessage as ChatMessageType } from '@/lib/openrouter';
import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useCallback } from 'react';
import { useSocketFeed } from '@/lib/useSocketFeed';
import Image from 'next/image';

interface MessageProps {
  message: ChatMessageType;
  presetId: string;
  languageId: string;
  userPrompt: string;
}

// Helper function to parse translated content
function parseTranslatedContent(content: string): { original: string; translated: string } | null {
  // Check if content follows the translation pattern (has blockquote followed by text)
  // Using a multi-line compatible approach instead of 's' flag
  const lines = content.split(/\r?\n\r?\n/);
  
  // Check if starts with blockquote and has at least two parts
  if (lines.length >= 2 && lines[0].startsWith('>')) {
    const original = lines[0].replace(/^>\s*/, '').trim();
    const translated = lines.slice(1).join('\n\n').trim();
    
    return {
      original,
      translated
    };
  }
  
  return null;
}

export function ChatMessage({ message, presetId, languageId, userPrompt }: MessageProps) {
  // Move hooks to the top level before any conditionals
  const [showOriginal, setShowOriginal] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { shareResponse } = useSocketFeed();
  
  const handleShare = useCallback(async () => {
    if (isShared || isSharing) return;
    
    setIsSharing(true);
    
    try {
      // Parse the content to check if it's translated
      const translatedContent = parseTranslatedContent(message.content);
      
      const responseToShare = {
        responseContent: translatedContent ? translatedContent.translated : message.content,
        originalContent: translatedContent?.original,
        presetId,
        languageId,
        userPrompt,
      };
      
      await shareResponse(responseToShare);
      setIsShared(true);
    } catch (error) {
      console.error('Error sharing response:', error);
    } finally {
      setIsSharing(false);
    }
  }, [message.content, presetId, languageId, userPrompt, isShared, isSharing, shareResponse]);
  
  // Don't display user messages
  if (message.role === 'user') return null;
  
  // Parse the content to check if it's translated
  const translatedContent = parseTranslatedContent(message.content);
  
  return (
    <div className="flex justify-center my-6">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 transition-all">
        <div className="flex items-start mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 p-[2px] mr-3">
            <div className="h-full w-full rounded-full overflow-hidden bg-white flex items-center justify-center">
              <Image 
                src="/ape.webp" 
                alt="Ape Oracle" 
                width={28}
                height={28}
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          
          {translatedContent ? (
            <div className="flex-1">
              <div className="text-lg italic text-gray-700 dark:text-gray-200">
                {showOriginal ? translatedContent.original : translatedContent.translated}
              </div>
              
              <div className="mt-4 border-t border-cream-100 dark:border-gray-600 pt-3 flex justify-between items-center">
                <button 
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="text-xs px-2 py-1 rounded bg-rose-100 dark:bg-rose-200/20 
                            text-rose-500 dark:text-rose-300 hover:bg-rose-200 
                            dark:hover:bg-rose-200/30 transition-colors"
                >
                  {showOriginal ? 'Show Translation' : 'Show Original'}
                </button>
                
                <button
                  onClick={handleShare}
                  disabled={isShared || isSharing}
                  className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                    isShared 
                      ? 'bg-green-100 dark:bg-green-200/20 text-green-600 dark:text-green-300' 
                      : 'bg-rose-100 dark:bg-rose-200/20 text-rose-500 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-200/30'
                  }`}
                >
                  {isSharing ? (
                    <span className="flex items-center gap-1">
                      <div className="animate-spin h-3 w-3 border border-current rounded-full border-t-transparent"></div>
                      Sharing...
                    </span>
                  ) : isShared ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Shared
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      Share
                    </span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="text-lg italic text-gray-700 dark:text-gray-200">
                {message.content}
              </div>
              <div className="mt-4 border-t border-cream-100 dark:border-gray-600 pt-3 flex justify-end">
                <button
                  onClick={handleShare}
                  disabled={isShared || isSharing}
                  className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                    isShared 
                      ? 'bg-green-100 dark:bg-green-200/20 text-green-600 dark:text-green-300' 
                      : 'bg-rose-100 dark:bg-rose-200/20 text-rose-500 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-200/30'
                  }`}
                >
                  {isSharing ? (
                    <span className="flex items-center gap-1">
                      <div className="animate-spin h-3 w-3 border border-current rounded-full border-t-transparent"></div>
                      Sharing...
                    </span>
                  ) : isShared ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Shared
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      Share
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 