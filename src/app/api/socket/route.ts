import { initSocketServer } from '@/lib/socket';

// WebSocket API route handler
export async function GET() {
  // Initialize socket server on first request
  initSocketServer();
  
  // Return a 200 response to acknowledge the socket server is running
  return new Response('Socket.io server is running', { status: 200 });
}