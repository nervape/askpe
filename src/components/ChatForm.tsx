'use client';

import { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { Sparkles, HelpCircle } from 'lucide-react';

interface ChatFormProps {
  onAskForAnswer: () => void;
  isLoading: boolean;
}

export function ChatForm({ onAskForAnswer, isLoading }: ChatFormProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-4">
      <p className="text-gray-600 dark:text-gray-300 text-center mb-6 italic text-sm max-w-md">
        Focus on your question, press the button, and receive wisdom from the Ape Oracle...
      </p>
      
      <button 
        onClick={onAskForAnswer}
        disabled={isLoading}
        className="bg-rose-200 hover:bg-rose-100 dark:bg-rose-200/80 dark:hover:bg-rose-200/60 
                  text-gray-800 dark:text-gray-800 px-8 py-5 rounded-full 
                  disabled:opacity-50 transition-all shadow-md hover:shadow-lg 
                  transform hover:scale-105 active:scale-95 flex items-center gap-2
                  font-medium text-lg"
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-gray-700 rounded-full border-t-transparent"></div>
            Consulting the oracle...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Reveal My Answer
          </>
        )}
      </button>
      
      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 max-w-xs">
        <div className="flex items-center justify-center mb-1">
          <HelpCircle className="w-3 h-3 mr-1" />
          <span className="font-medium">How it works</span>
        </div>
        <p>Think of a question in your mind, then press the button to receive guidance from the oracle.</p>
      </div>
    </div>
  );
} 