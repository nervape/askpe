'use client';

import { useState, useEffect } from 'react';
import { ChatContainer } from '@/components/ChatContainer';
import { PromptEditor } from '@/components/PromptEditor';
import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { PRESETS, DEFAULT_PRESET_ID, getPresetById, Preset } from '@/lib/presets';

// Get default system prompt from the default preset
const DEFAULT_SYSTEM_PROMPT = getPresetById(DEFAULT_PRESET_ID).systemPrompt;

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [currentPreset, setCurrentPreset] = useState<Preset>(getPresetById(DEFAULT_PRESET_ID));
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePromptChange = (newPrompt: string) => {
    setSystemPrompt(newPrompt);
  };

  const handlePresetChange = (preset: Preset) => {
    setCurrentPreset(preset);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <main className="flex min-h-screen bg-cream-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <div 
        className={`h-screen bg-white dark:bg-gray-800 border-r border-cream-100 dark:border-gray-700 shadow-md transition-all duration-300 flex flex-col overflow-hidden ${
          showSidebar ? 'w-[320px]' : 'w-0'
        }`}
      >
        <div className="p-4 h-full pt-20">
          <PromptEditor 
            defaultPrompt={DEFAULT_SYSTEM_PROMPT}
            onPromptChange={handlePromptChange}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 p-4 md:p-8 relative">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute left-0 top-36 z-10 p-1.5 bg-rose-200 hover:bg-rose-100 text-gray-700 rounded-r-md shadow-md transition-colors"
          aria-label={showSidebar ? "Close sidebar" : "Open sidebar"}
        >
          {showSidebar ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Theme Toggle Button - Only render after mounting */}
        {mounted && (
          <Button
            onClick={toggleTheme}
            size="icon"
            variant="outline"
            className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md border-cream-100 dark:border-gray-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </Button>
        )}

        <div className="w-full h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mx-auto max-w-3xl border border-cream-100 dark:border-gray-700">
          <div className="bg-gradient-to-r from-rose-200 to-rose-100 text-gray-800 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 p-[2px] shadow-md">
              <div className="h-full w-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                <img 
                  src="/ape.webp" 
                  alt="Ape Oracle" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Ape {currentPreset.name}</h1>
              <p className="text-sm opacity-80">{currentPreset.description}</p>
            </div>
          </div>
          
          <div className="h-[calc(90vh-64px)]">
            <ChatContainer 
              initialSystemPrompt={systemPrompt} 
              onPresetChange={handlePresetChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
