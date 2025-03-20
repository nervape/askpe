import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LikeInput, FeedEvent } from '@/lib/types';
import { emitFeedEvent } from '@/lib/socket';

// POST /api/feed/like - Like/unlike a response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { responseId, userId } = body as LikeInput;

    // Check for required fields
    if (!responseId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the response exists
    const response = await prisma.sharedResponse.findUnique({
      where: {
        id: responseId,
      },
    });

    if (!response) {
      return NextResponse.json(
        { error: 'Response not found' },
        { status: 404 }
      );
    }

    // Check if the user already liked this response
    const existingLike = await prisma.like.findFirst({
      where: {
        responseId,
        userId,
      },
    });

    let eventType: 'like' | 'unlike' = 'like';
    let likeCount = 0;

    if (existingLike) {
      // User already liked, so unlike
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      eventType = 'unlike';
    } else {
      // User hasn't liked, so add like
      await prisma.like.create({
        data: {
          responseId,
          userId,
        },
      });
      eventType = 'like';
    }

    // Get updated like count
    likeCount = await prisma.like.count({
      where: {
        responseId,
      },
    });

    // Create feed event
    const feedEvent: FeedEvent = {
      type: eventType,
      data: {
        ...response,
        likeCount,
      },
      timestamp: Date.now(),
    };

    // Broadcast to all connected clients
    await emitFeedEvent(feedEvent);

    return NextResponse.json({
      responseId,
      likeCount,
      liked: eventType === 'like',
    });
  } catch (error) {
    console.error('Error updating like:', error);
    return NextResponse.json(
      { error: 'Failed to update like' },
      { status: 500 }
    );
  }
} 