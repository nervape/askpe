# Asking APE

A real-time AI chat interface with community features built with Next.js, TypeScript, and Shadcn UI, using a "Book of Answers" style interaction pattern.

## Features

- Clean, modern UI with Tailwind CSS and Shadcn UI components
- "Book of Answers" style oracle experience
- Real-time community feed with WebSocket integration
- Like and share functionality for oracle responses
- Metrics dashboard for tracking usage and popular content
- Multi-language support with automatic translation
- Preset system prompts for different oracle personalities
- SQLite database via Prisma for persistent storage
- TypeScript for type safety
- Responsive design with light/dark mode support

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the project root:

```
DATABASE_URL="file:./dev.db"
```

4. Initialize the database:

```bash
npx prisma migrate dev --name init
```

### Running the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Oracle Interaction

1. Click the "Consult the oracle" button to receive wisdom without typing a question
2. Think of your question while waiting for the oracle's response
3. Share interesting responses to the community feed

### Community Feed

1. View the feed of shared responses by clicking "Show Feed"
2. Like responses that resonate with you
3. See responses update in real-time as others share and like content

### Metrics Dashboard

1. Access the metrics dashboard by clicking the chart icon in the bottom-left corner
2. View statistics on total generated and shared responses
3. See the most popular (liked) responses

## Deployment

### Docker

A Docker Compose configuration is provided for easy deployment:

```bash
docker-compose up -d
```

This will start the Next.js application and set up the necessary database.

## Customization

### Adding New Presets

To add new oracle personalities, edit the presets in `src/lib/presets.ts`:

```typescript
export const PRESETS: Preset[] = [
  // Add your new preset here
  {
    id: 'your-preset-id',
    name: 'Your Preset Name',
    description: 'Description of this oracle style',
    systemPrompt: 'System prompt that controls the oracle behavior',
  }
];
```

### Adding New Languages

To add support for more languages, edit the languages in `src/lib/languages.ts`:

```typescript
export const LANGUAGES: Language[] = [
  // Add your new language here
  {
    id: 'language-code',
    name: 'Language Name',
    nativeName: 'Native Language Name',
  }
];
```

## Project Structure

- `/src/app`: Next.js App Router pages and API routes
- `/src/components`: React components including UI elements
- `/src/lib`: Utility functions, types, and configuration
- `/prisma`: Database schema and migrations

## Technical Details

### Real-time Updates

The application uses Socket.io for real-time communication, allowing users to see new responses and likes as they happen across all connected clients.

### Database Schema

The application uses Prisma with SQLite for data persistence. The main models include:

- `SharedResponse`: Stores shared oracle responses
- `Like`: Tracks likes on responses

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Socket.io Documentation](https://socket.io/docs/v4)
