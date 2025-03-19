import { ChatMessage as ChatMessageType } from '@/lib/openrouter';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // For the Book of Answers, we're only showing assistant messages
  if (isUser) return null;

  return (
    <div className="mb-8 flex flex-col items-center justify-center">
      <div className="relative max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md border border-cream-100 dark:border-gray-600 text-center relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 p-[2px] shadow-md">
            <div className="h-full w-full rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img 
                src="/ape.webp" 
                alt="Ape Oracle" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          
          <p className="text-xl font-serif italic text-gray-800 dark:text-gray-200 mt-5 leading-relaxed">
            {message.content}
          </p>
          
          <div className="mt-6 flex justify-center">
            <div className="h-0.5 w-16 bg-rose-200 dark:bg-rose-200/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 