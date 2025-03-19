import { ChatContainer } from '@/components/ChatContainer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-3xl h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 p-[2px] shadow-md">
            <div className="h-full w-full rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img 
                src="/ape.webp" 
                alt="Ape Assistant" 
                className="w-[100%] h-[100%] object-contain" 
              />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold">Ape AI Chat</h1>
            <p className="text-sm opacity-80">Powered by OpenRouter</p>
          </div>
        </div>
        
        <div className="h-[calc(90vh-64px)]">
          <ChatContainer />
        </div>
      </div>
    </main>
  );
}
