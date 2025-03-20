'use client';

import { useState } from 'react';
import { BarChart } from 'lucide-react';
import { Button } from './ui/button';
import { MetricsModal } from './MetricsModal';

export function MetricsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 bottom-4 z-50 shadow-lg rounded-full size-12 p-0 bg-rose-500 text-white hover:bg-rose-600"
        aria-label="Open metrics panel"
      >
        <BarChart className="h-5 w-5" />
      </Button>

      <MetricsModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
} 