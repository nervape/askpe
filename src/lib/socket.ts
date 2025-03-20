import { Server } from 'socket.io';
import { FeedEvent } from '@/lib/types';
import { createServer } from 'http';

// Socket.io server instance
let io: Server;

// Initialize the socket server
export function initSocketServer() {
  if (!io) {
    // For Nginx integration, Socket.io should use the /socket.io path
    io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      path: "/socket.io/",
      transports: ['websocket', 'polling'],
    });

    // Handle connection event
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle feed event from client
      socket.on('feed-event', (event) => {
        console.log('Received client feed event:', event);
        // Re-broadcast to all clients
        io.emit('feed-event', event);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // Get port from environment variable or use default 3001
    const port = parseInt(process.env.SOCKET_PORT || '3001', 10);
    
    // Create HTTP server for Socket.io
    const httpServer = createServer();
    io.attach(httpServer);
    
    // Start listening on the configured port
    httpServer.listen(port, '0.0.0.0', () => {
      console.log(`Socket.io server started on 0.0.0.0:${port} with path /socket.io/`);
    });
  }
  
  return io;
}

// Helper function to emit feed events to all connected clients
export async function emitFeedEvent(event: FeedEvent) {
  if (!io) {
    io = initSocketServer();
  }
  
  console.log('Emitting feed event:', event.type);
  io.emit('feed-event', event);
} 