import OpenAI from 'openai';

// This file is imported on the server side
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : process.env.VERCEL_URL || 'https://your-production-url.com',
    'X-Title': 'AI Chat Tool',
  },
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Default model to use if none is specified
const DEFAULT_MODEL = 'openai/gpt-3.5-turbo';

export async function generateChatResponse(messages: ChatMessage[], modelId?: string) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return {
        content: null,
        error: 'OpenRouter API key is not configured. Please add it to your .env.local file.',
      };
    }

    const model = modelId || DEFAULT_MODEL;
    
    console.log(`Sending request to OpenRouter with model: ${model} and messages:`, JSON.stringify(messages));
    
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });
    
    console.log('OpenRouter response:', JSON.stringify(response));
    
    if (!response.choices || !response.choices.length || !response.choices[0].message) {
      console.error('Invalid response from OpenRouter:', response);
      return {
        content: null,
        error: 'Received an invalid response from OpenRouter.',
      };
    }

    return {
      content: response.choices[0].message.content || '',
      error: null,
    };
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    return {
      content: null,
      error: 'Failed to generate response. Please try again.',
    };
  }
} 