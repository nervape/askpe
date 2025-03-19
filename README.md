# AI Chat Tool

A simple AI chat interface built with Next.js, TypeScript, and Radix UI, using OpenRouter as the LLM backend.

## Features

- Clean, modern UI with Tailwind CSS
- TypeScript for type safety
- OpenRouter API integration
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- An OpenRouter API key

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the project root and add your OpenRouter API key:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_API_URL=https://openrouter.ai/api/v1
```

### Running the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Enter your message in the text input at the bottom of the chat interface
2. Press "Send" or hit Enter to send your message
3. The AI will respond with a message in the chat

## Customization

### Changing the AI model

To use a different model from OpenRouter, edit the model name in `src/lib/openrouter.ts`:

```typescript
// Change this line
model: 'openai/gpt-3.5-turbo',
// To any model supported by OpenRouter
```

### Modifying the system prompt

To change the AI's behavior, edit the system message in `src/components/ChatContainer.tsx`:

```typescript
const [messages, setMessages] = useState<ChatMessageType[]>([
  {
    role: 'system',
    // Modify this content to change the AI's behavior
    content: 'You are a helpful assistant.'
  }
]);
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [OpenRouter Documentation](https://openrouter.ai/docs)
