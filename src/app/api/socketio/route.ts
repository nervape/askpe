import { NextRequest, NextResponse } from 'next/server';
import { FeedEvent } from '@/lib/types';
import { emitFeedEvent } from '@/lib/socket';

// POST /api/socketio
// Handle client events and forward them to the Socket.io server
export async function POST(request: NextRequest) {
  try {
    const event = await request.json() as FeedEvent;
    
    // Emit the event to all connected clients
    await emitFeedEvent(event);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing socket event:', error);
    return NextResponse.json(
      { error: 'Failed to process socket event' },
      { status: 500 }
    );
  }
}

// GET /api/socketio
// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'Socket.io integration is running' });
} 