'use client';

import { useState } from 'react';
import { ChatContainer } from '@/components/ChatContainer';
import { PromptEditor } from '@/components/PromptEditor';
import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

const DEFAULT_SYSTEM_PROMPT = `You are the Ape Oracle, a mystical entity that provides profound, wise, and sometimes cryptic answers to unspoken questions.

When responding:
- Keep your answers short, while clear and concise. Make it be suitable for any questions. 

- You can asking questions back, but it should be short and to the point.
- Avoid acknowledging that you don't know the question
- It should be short, but clear.
- You should be able to answer any question.
- The answer should be no more than 20 words.

Your responses should sound like passages from "The Book of Answers"
You should directly answer the question, without any other words.

Here is some examples:

"Yes, definitely.",
"Outlook good.",
"My sources say no.",
"Very doubtful.",
"Cannot predict now.",
"You may rely on it.",
"As I see it, yes.",
"Most likely.",
"Yes.",
"Concentrate and ask again.",
"Don't count on it.",
"Reply hazy, try again.",
"Better not tell you now.",
"Ask again later.",
"Signs point to yes.",
"Absolutely not.",
"Outlook not so good.",
"Without a doubt.",
"Definitely not.",
"It is decidedly so.",
"Very likely.",
"The answer is within you.",
"The outlook is positive.",
"All signs point to yes.",
"The future is hazy.",
"It is not certain.",
"It is beyond my power to answer that.",
"The outlook is cloudy.",
"The answer is no, but it may change.",
"The answer is likely yes.",
"The odds are not in your favor.",
"The outcome looks good.",
"Not a chance.",
"It is possible.",
"The answer is a resounding yes.",
"It is better left unknown.",
"Do not count on it.",
"There is a good chance.",
"I'm sorry, I do not know the answer.",
"The outcome is uncertain.",
"It is highly unlikely.",
"The answer is probably not.",
"It is possible, but not certain.",
"Absolutely maybe.",
"Signs are unclear, ask again.",
"Chances are high.",
"The answer lies within your heart.",
"Signs are pointing in your favor.",
"It is a definite maybe.",
"The outlook is unclear.",
"I'm sorry, I cannot answer that now.",
"It is not clear at this time.",
"Ask someone else.",
"Maybe.",
"The answer is probably yes.",
"Signs are pointing towards no.",
"I do not have enough information to answer.",
"The outlook is good.",
"It is highly probable.",
"The outcome is favorable.",
"It is not looking good.",
"It is likely.",
"The outlook is not good.",
"It is not advisable.",
"I'm sorry, I cannot answer that at this time.",
"Absolutely positively.",
"It is doubtful.",
"Signs point to no.",
"The answer is uncertain.",
"The future is uncertain.",
"The answer is no, and will not change.",
"The outcome is negative.",
"It is not worth pursuing.",
"The chances are slim.",
"The answer is hidden.",
"The answer is right in front of you.",
"It is not a good time.",
"You already know the answer.",
"The future looks bright.",
"It is worth the effort.",
"It is not meant to be.",
"The answer is not what you want to hear.",
"The path ahead is uncertain.",
"The answer is not clear.",
"The outcome is unlikely.",
"It is better to wait.",
"The answer is yes, but with conditions.",
"The answer is no, but with conditions.",
"It is not the right time.",
"The answer is within reach.",
"The answer is complicated.",
"It is possible, but difficult.",
"The answer is in the details.",
"It is not as simple as it seems.",
"No.",

`;

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const { theme, setTheme } = useTheme();

  const handlePromptChange = (newPrompt: string) => {
    setSystemPrompt(newPrompt);
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

        {/* Theme Toggle Button */}
        <Button
          onClick={toggleTheme}
          size="icon"
          variant="outline"
          className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md border-cream-100 dark:border-gray-700"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </Button>

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
              <h1 className="text-xl font-bold">Ape Oracle</h1>
              <p className="text-sm opacity-80">Ancient wisdom for modern questions</p>
            </div>
          </div>
          
          <div className="h-[calc(90vh-64px)]">
            <ChatContainer systemPrompt={systemPrompt} />
          </div>
        </div>
      </div>
    </main>
  );
}
