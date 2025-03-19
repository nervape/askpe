'use client';

import { useState } from 'react';
import * as Form from '@radix-ui/react-form';

interface ChatFormProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export function ChatForm({ onSubmit, isLoading }: ChatFormProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <Form.Root className="w-full" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <Form.Field className="flex-1" name="message">
          <Form.Control asChild>
            <input
              className="w-full bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            type="submit"
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </Form.Submit>
      </div>
    </Form.Root>
  );
} 