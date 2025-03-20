import { NextRequest, NextResponse } from 'next/server';
import { FeedEvent } from '@/lib/types';
import { PrismaClient } from '@prisma/client';
import { emitFeedEvent } from '@/lib/socket';

// Initialize Prisma client
const prisma = new PrismaClient();

// POST /api/feed/event - Broadcast a feed event to all connected clients
export async function POST(request: NextRequest) {
  try {
    const event = await request.json() as FeedEvent;
    
    // Process the event as needed (store in DB, etc.)
    if (event.type === 'new-response' && event.data) {
      // For new responses, we don't need to do anything as they're stored
      // when created in the share route
    } else if (event.type === 'like' || event.type === 'unlike') {
      // For likes/unlikes, the like count is already updated in the like route
    }
    
    // Emit the event to all connected clients
    await emitFeedEvent(event);
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing feed event:', error);
    return NextResponse.json(
      { error: 'Failed to process feed event' },
      { status: 500 }
    );
  }
} 