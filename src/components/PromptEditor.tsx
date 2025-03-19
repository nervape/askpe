'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RotateCcw, Save } from 'lucide-react';

interface PromptEditorProps {
  defaultPrompt: string;
  onPromptChange: (newPrompt: string) => void;
}

export function PromptEditor({ defaultPrompt, onPromptChange }: PromptEditorProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [isEdited, setIsEdited] = useState(false);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setIsEdited(e.target.value !== defaultPrompt);
  };

  const handleSave = () => {
    onPromptChange(prompt);
    setIsEdited(false);
  };

  const handleReset = () => {
    setPrompt(defaultPrompt);
    setIsEdited(false);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div>
        <h3 className="text-lg font-medium mb-1 text-gray-800 dark:text-gray-200">System Prompt</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Customize how the AI assistant responds by editing the system prompt.
        </p>
      </div>
      
      <Textarea
        value={prompt}
        onChange={handlePromptChange}
        className="flex-1 min-h-[200px] p-4 bg-white dark:bg-gray-700 border-cream-100 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus-visible:ring-rose-200 dark:focus-visible:ring-rose-200/50 transition-colors"
        placeholder="Enter a system prompt for the AI assistant..."
      />
      
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="border-cream-100 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-gray-800 transition-colors"
          disabled={!isEdited}
        >
          <RotateCcw className="mr-1 h-4 w-4" /> Reset
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-rose-200 hover:bg-rose-100 dark:bg-rose-200/80 dark:hover:bg-rose-200/60 text-gray-700 dark:text-gray-800 transition-colors"
          disabled={!isEdited}
        >
          <Save className="mr-1 h-4 w-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
} 