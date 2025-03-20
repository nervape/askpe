import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SharedResponseInput, FeedEvent } from '@/lib/types';
import { emitFeedEvent } from '../../socket/route';

// POST /api/feed/share - Share a response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      responseContent,
      originalContent,
      presetId,
      languageId,
      userPrompt,
      userId,
    } = body as SharedResponseInput;

    // Check for required fields
    if (!responseContent || !presetId || !languageId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if a similar response already exists
    const existingResponse = await prisma.sharedResponse.findFirst({
      where: {
        responseContent,
        presetId,
        languageId,
      },
    });

    if (existingResponse) {
      // If exists, just return it
      const likeCount = await prisma.like.count({
        where: {
          responseId: existingResponse.id,
        },
      });

      return NextResponse.json({
        ...existingResponse,
        likeCount,
      });
    }

    // Create new shared response
    const response = await prisma.sharedResponse.create({
      data: {
        responseContent,
        originalContent,
        presetId,
        languageId,
        userPrompt,
        userId,
      },
    });

    // Create feed event
    const feedEvent: FeedEvent = {
      type: 'new-response',
      data: {
        ...response,
        likeCount: 0,
      },
      timestamp: Date.now(),
    };

    // Broadcast to all connected clients
    await emitFeedEvent(feedEvent);

    return NextResponse.json(feedEvent.data);
  } catch (error) {
    console.error('Error sharing response:', error);
    return NextResponse.json(
      { error: 'Failed to share response' },
      { status: 500 }
    );
  }
} 