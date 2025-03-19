import { PRESETS, Preset } from '@/lib/presets';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

interface PresetSelectorProps {
  selectedPresetId: string;
  onPresetChange: (presetId: string) => void;
}

export function PresetSelector({ selectedPresetId, onPresetChange }: PresetSelectorProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Experience Mode
      </label>
      <Select.Root value={selectedPresetId} onValueChange={onPresetChange}>
        <Select.Trigger
          className="inline-flex items-center justify-between rounded px-4 py-2 text-sm gap-1 bg-white dark:bg-gray-700 border border-cream-100 dark:border-gray-600 hover:bg-cream-50 hover:dark:bg-gray-600 transition-colors"
          aria-label="Select preset"
        >
          <Select.Value />
          <Select.Icon>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="overflow-hidden bg-white dark:bg-gray-700 rounded-md shadow-md border border-cream-100 dark:border-gray-600 z-50"
            position="popper"
            sideOffset={5}
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-default">
              ▲
            </Select.ScrollUpButton>
            <Select.Viewport className="p-1">
              {PRESETS.map((preset) => (
                <Select.Item
                  key={preset.id}
                  value={preset.id}
                  className="text-sm rounded flex items-center h-8 pr-9 pl-6 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-rose-100 dark:data-[highlighted]:bg-rose-200/20 data-[state=checked]:font-medium text-gray-700 dark:text-gray-200"
                >
                  <Select.ItemText>{preset.name}</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
                    <Check className="h-4 w-4 text-rose-200 dark:text-rose-200/80" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-default">
              ▼
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {PRESETS.find(p => p.id === selectedPresetId)?.description || ''}
      </p>
    </div>
  );
} 