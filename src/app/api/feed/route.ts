import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SharedResponse } from '@/lib/types';

// Define a PrismaSharedResponse type without importing from @prisma/client
type PrismaSharedResponse = {
  id: string;
  responseContent: string;
  originalContent: string | null;
  presetId: string;
  languageId: string;
  userPrompt: string;
  userId: string;
  timestamp: Date;
};

// GET /api/feed - Get all shared responses
export async function GET(request: NextRequest) {
  try {
    // Get all shared responses
    const responses = await prisma.sharedResponse.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Get like counts for each response
    const likeCounts = await Promise.all(
      responses.map(async (response: PrismaSharedResponse) => {
        const count = await prisma.like.count({
          where: {
            responseId: response.id,
          },
        });
        return { id: response.id, count };
      })
    );

    // Map like counts to responses
    const responsesWithLikeCounts: SharedResponse[] = responses.map((response: PrismaSharedResponse) => {
      const likeCount = likeCounts.find((lc) => lc.id === response.id)?.count || 0;
      return {
        ...response,
        likeCount,
        // Ensure Date objects are properly serialized
        timestamp: response.timestamp,
      };
    });

    return NextResponse.json(responsesWithLikeCounts);
  } catch (error) {
    console.error('Error fetching shared responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shared responses' },
      { status: 500 }
    );
  }
} 