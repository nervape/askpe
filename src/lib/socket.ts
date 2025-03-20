import { Server } from 'socket.io';
import { FeedEvent } from '@/lib/types';

// Socket.io server instance
let io: Server;

// Initialize the socket server
export function initSocketServer() {
  if (!io) {
    // Create a new socket.io server
    io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Handle connection event
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // Start listening on a different port than the Next.js app
    io.listen(3001);
    console.log('Socket.io server started on port 3001');
  }
  
  return io;
}

// Helper function to emit feed events to all connected clients
export async function emitFeedEvent(event: FeedEvent) {
  if (!io) {
    io = initSocketServer();
  }
  
  io.emit('feed-event', event);
} 