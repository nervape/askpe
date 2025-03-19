import { NextResponse } from 'next/server';
import { generateChatResponse, ChatMessage } from '@/lib/openrouter';

export async function POST(request: Request) {
  try {
    const { messages, model } = await request.json() as { 
      messages: ChatMessage[];
      model?: string;
    };
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or missing messages array' },
        { status: 400 }
      );
    }

    const response = await generateChatResponse(messages, model);
    
    if (response.error) {
      return NextResponse.json(
        { error: response.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ content: response.content });
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 