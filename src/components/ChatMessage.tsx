import { ChatMessage as ChatMessageType } from '@/lib/openrouter';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start gap-3 max-w-[80%]`}>
        {isUser ? (
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-500 shadow-md">
            <span className="text-white font-medium">U</span>
          </div>
        ) : (
          <div className="rounded-full flex items-center justify-center overflow-hidden  bg-gradient-to-br from-amber-400 to-orange-500 p-[2px] shadow-md">
            <div className="h-full w-full rounded-full  overflow-hidden bg-white flex items-center justify-center">
              <img 
                src="/ape.webp" 
                alt="Ape Assistant" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        )}
        
        <div className={`px-4 py-2 rounded-lg ${isUser ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
} 