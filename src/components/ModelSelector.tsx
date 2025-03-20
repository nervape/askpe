'use client';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Sparkles } from 'lucide-react';

export interface ModelOption {
  id: string;
  name: string;
  description: string;
}

const MODEL_OPTIONS: ModelOption[] = [
   { 
    id: 'anthropic/claude-3.5-haiku', 
    name: 'Claude 3 Haiku', 
    description: 'Fast and efficient' 
   },
  { 
    id: 'openai/gpt-3.5-turbo', 
    name: 'GPT-3.5 Turbo', 
    description: 'Can not use in China. Good balance of speed and intelligence' 
  },
  { 
    id: 'openai/gpt-4', 
    name: 'GPT-4', 
    description: 'More powerful but slower' 
  },
  { 
    id: 'anthropic/claude-3.7-sonnet', 
    name: 'Claude 3.7 Sonnet', 
    description: 'Great but expensive' 
  },
  { 
    id: 'anthropic/claude-3.5-opus', 
    name: 'Claude 3 Opus', 
    description: 'Most capable Claude model' 
  },
];

interface ModelSelectorProps {
  onModelChange: (modelId: string) => void;
  selectedModel: string;
}

export function ModelSelector({ onModelChange, selectedModel }: ModelSelectorProps) {
  // Find the current model name
  const currentModel = MODEL_OPTIONS.find(model => model.id === selectedModel);

  return (
    <div className="w-full space-y-2">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-800 dark:text-gray-200">
        <Sparkles className="h-4 w-4 text-rose-200 dark:text-rose-200/80" />
        AI Model
      </label>
      <Select defaultValue={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-cream-100 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-rose-200 dark:focus:ring-rose-200/50 transition-colors">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-700 border-cream-100 dark:border-gray-600">
          {MODEL_OPTIONS.map((model) => (
            <SelectItem 
              key={model.id} 
              value={model.id}
              className="focus:bg-rose-100 dark:focus:bg-rose-200/20"
            >
              <div className="flex flex-col py-1">
                <span className="font-medium text-gray-900 dark:text-gray-100">{model.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {currentModel && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Currently using: <span className="text-rose-200 dark:text-rose-200/80 font-medium">{currentModel.name}</span>
        </p>
      )}
    </div>
  );
}

export { MODEL_OPTIONS }; 