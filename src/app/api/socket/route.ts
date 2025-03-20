import { NextRequest } from 'next/server';
import { Server } from 'socket.io';
import { prisma } from '@/lib/prisma';
import { FeedEvent, SharedResponseInput, LikeInput } from '@/lib/types';

// Socket.io server instance
let io: Server;

// Initialize the socket server on first request
function initSocketServer() {
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
}

// WebSocket API route handler
export async function GET(request: NextRequest) {
  // Initialize socket server on first request
  initSocketServer();
  
  // Return a 200 response to acknowledge the socket server is running
  return new Response('Socket.io server is running', { status: 200 });
}

// Helper function to emit feed events to all connected clients
export async function emitFeedEvent(event: FeedEvent) {
  if (!io) {
    initSocketServer();
  }
  
  io.emit('feed-event', event);
} 