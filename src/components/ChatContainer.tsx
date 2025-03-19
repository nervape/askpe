'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatForm } from './ChatForm';
import { ChatMessage } from './ChatMessage';
import { ChatMessage as ChatMessageType } from '@/lib/openrouter';
import { ModelSelector, MODEL_OPTIONS } from './ModelSelector';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';
import { DEFAULT_PRESET_ID, PRESETS, Preset, getPresetById } from '@/lib/presets';
import { PresetSelector } from './PresetSelector';

// Book of Answers responses
const BOOK_OF_ANSWERS_PROMPTS = [
  "What guidance awaits me today?",
  "What answer lies beyond the veil?",
  "What wisdom does the oracle share?",
  "What counsel do the stars offer?",
  "What insight awaits my question?",
  "What truth am I seeking?",
  "What mysteries will be revealed?",
  "What answer do the fates provide?",
  "What guidance do the ancient ones provide?",
  "What wisdom does the universe share today?"
];

interface ChatContainerProps {
  initialSystemPrompt: string;
  onPresetChange?: (preset: Preset) => void;
}

export function ChatContainer({ initialSystemPrompt, onPresetChange }: ChatContainerProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      role: 'system',
      content: initialSystemPrompt
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].id);
  const [selectedPresetId, setSelectedPresetId] = useState(DEFAULT_PRESET_ID);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get current preset
  const currentPreset = getPresetById(selectedPresetId);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update the system message when the preset changes
    setMessages(prev => {
      const newMessages = [...prev];
      const systemIndex = newMessages.findIndex(msg => msg.role === 'system');
      
      if (systemIndex >= 0) {
        newMessages[systemIndex] = { ...newMessages[systemIndex], content: currentPreset.systemPrompt };
      } else {
        newMessages.unshift({ role: 'system', content: currentPreset.systemPrompt });
      }
      
      return newMessages;
    });
    
    // Notify parent component about preset change
    if (onPresetChange) {
      onPresetChange(currentPreset);
    }
  }, [currentPreset, onPresetChange]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };
  
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
  };

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * BOOK_OF_ANSWERS_PROMPTS.length);
    return BOOK_OF_ANSWERS_PROMPTS[randomIndex];
  };

  const handleAskForAnswer = async () => {
    setIsLoading(true);
    
    // Use a random prompt from our list
    const promptText = getRandomPrompt();
    
    // Add the "user question" as a hidden thought (not shown in the UI)
    // We'll filter these out in the message display
    const userMessage: ChatMessageType = { 
      role: 'user', 
      content: promptText 
    };
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          model: selectedModel
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: data.content,
      };
      
      setMessages((prev) => {
        // Include the hidden user message in state for API context
        // but we'll filter it out in the UI
        return [...prev, userMessage, assistantMessage];
      });
    } catch (error) {
      console.error('Error getting answer:', error);
      alert('Failed to consult the oracle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cream-50 dark:bg-gray-800 transition-colors">
      <div className="p-2 border-b border-cream-100 dark:border-gray-700 flex items-center gap-2 bg-white dark:bg-gray-700 transition-colors">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-rose-200 dark:hover:text-rose-100 transition-colors"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4 mr-1" />
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </Button>
        {showSettings && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Adjust experience settings
          </div>
        )}
      </div>
      
      {showSettings && (
        <div className="p-4 border-b border-cream-100 dark:border-gray-700 bg-white dark:bg-gray-700 transition-colors space-y-4">
          <PresetSelector
            selectedPresetId={selectedPresetId}
            onPresetChange={handlePresetChange}
          />
          <ModelSelector 
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 bg-cream-50 dark:bg-gray-800 transition-colors">
        {messages
          .filter(m => m.role !== 'system' && m.role !== 'user')
          .map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-cream-100 dark:border-gray-700 bg-white dark:bg-gray-700 transition-colors">
        <ChatForm 
          onAskForAnswer={handleAskForAnswer} 
          isLoading={isLoading} 
          preset={currentPreset}
        />
      </div>
    </div>
  );
} 