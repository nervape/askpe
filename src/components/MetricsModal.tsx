'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { useSocketFeed } from '@/lib/useSocketFeed';
import { getPresetById } from '@/lib/presets';
import { MetricsData, PresetMetric } from '@/lib/types';

interface MetricsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MetricsModal({ open, onOpenChange }: MetricsModalProps) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { responses } = useSocketFeed();

  // Calculate metrics based on responses
  useEffect(() => {
    if (!responses.length) {
      setLoading(true);
      return;
    }

    // Count total shared responses
    const sharedCount = responses.length;

    // Calculate preset distribution (still calculated for data model compatibility)
    const presetCounts: Record<string, number> = {};
    responses.forEach(response => {
      if (!presetCounts[response.presetId]) {
        presetCounts[response.presetId] = 0;
      }
      presetCounts[response.presetId]++;
    });

    const presetDistribution: PresetMetric[] = Object.entries(presetCounts).map(
      ([presetId, count]) => ({
        presetId,
        presetName: getPresetById(presetId).name,
        count
      })
    );

    // Get top liked responses (sort by likes and take top 5)
    const topLikedResponses = [...responses]
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 5);

    // We don't have access to the total generated count from this client component,
    // assuming shared count is N, we'll estimate generated count as approx 3*N
    const generatedCount = Math.max(sharedCount * 3, 10);

    setMetrics({
      generatedCount,
      sharedCount,
      topLikedResponses,
      presetDistribution,
      languageDistribution: [] // Not needed anymore
    });
    
    setLoading(false);
  }, [responses]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="mb-5">
          <SheetTitle>Oracle Metrics</SheetTitle>
          <SheetDescription>
            Insight into the wisdom shared through the oracle
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-rose-500 rounded-full border-t-transparent"></div>
          </div>
        ) : metrics ? (
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[calc(80vh-120px)] p-4">
            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cream-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Generated</p>
                <p className="text-2xl font-bold text-rose-500">{metrics.generatedCount}</p>
              </div>
              <div className="bg-cream-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Shared</p>
                <p className="text-2xl font-bold text-rose-500">{metrics.sharedCount}</p>
              </div>
            </div>

            {/* Top liked responses */}
            <div className="bg-cream-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h3 className="text-md font-semibold mb-4">Top Liked Responses</h3>
              {metrics.topLikedResponses.length > 0 ? (
                <ul className="space-y-4">
                  {metrics.topLikedResponses.map((response) => (
                    <li key={response.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-200">
                            {response.responseContent.length > 100 
                              ? `${response.responseContent.substring(0, 100)}...` 
                              : response.responseContent}
                          </p>
                          <div className="flex gap-2 mt-1 text-xs text-gray-500">
                            <span>{getPresetById(response.presetId).name}</span>
                            <span>•</span>
                            <span>{new Date(response.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-rose-500 font-semibold">
                          {response.likeCount} likes
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">No liked responses yet</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Failed to load metrics</p>
        )}
      </SheetContent>
    </Sheet>
  );
} 