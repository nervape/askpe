import { LANGUAGES, Language } from '@/lib/languages';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check, Languages } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguageId: string;
  onLanguageChange: (languageId: string) => void;
}

export function LanguageSelector({ selectedLanguageId, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
        <Languages className="h-3.5 w-3.5" />
        Response Language
      </label>
      <Select.Root value={selectedLanguageId} onValueChange={onLanguageChange}>
        <Select.Trigger
          className="inline-flex items-center justify-between rounded px-4 py-2 text-sm gap-1 bg-white dark:bg-gray-700 border border-cream-100 dark:border-gray-600 hover:bg-cream-50 hover:dark:bg-gray-600 transition-colors"
          aria-label="Select language"
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
              {LANGUAGES.map((language) => (
                <Select.Item
                  key={language.id}
                  value={language.id}
                  className="text-sm rounded flex items-center h-8 pr-9 pl-6 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-rose-100 dark:data-[highlighted]:bg-rose-200/20 data-[state=checked]:font-medium text-gray-700 dark:text-gray-200"
                >
                  <Select.ItemText>{language.name} ({language.nativeName})</Select.ItemText>
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
      {selectedLanguageId !== 'en' && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
          <span className="bg-rose-100 dark:bg-rose-200/20 text-rose-500 dark:text-rose-300 px-1 py-0.5 rounded text-[10px] font-medium">AUTO</span>
          Responses will be translated to {LANGUAGES.find(l => l.id === selectedLanguageId)?.name}
        </p>
      )}
    </div>
  );
} 