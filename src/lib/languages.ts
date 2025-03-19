export interface Language {
  id: string;
  name: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'es', name: 'Spanish', nativeName: 'Español' },
  { id: 'fr', name: 'French', nativeName: 'Français' },
  { id: 'de', name: 'German', nativeName: 'Deutsch' },
  { id: 'it', name: 'Italian', nativeName: 'Italiano' },
  { id: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { id: 'ru', name: 'Russian', nativeName: 'Русский' },
  { id: 'zh-TW', name: 'Traditional Chinese', nativeName: '正體中文' },
  { id: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文' },
  { id: 'ja', name: 'Japanese', nativeName: '日本語' },
  { id: 'ko', name: 'Korean', nativeName: '한국어' },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

export const DEFAULT_LANGUAGE_ID = 'en';

export function getLanguageById(id: string): Language {
  return LANGUAGES.find(lang => lang.id === id) || LANGUAGES[0];
}

export function getTranslationPrompt(languageId: string): string {
  if (languageId === 'en') return '';
  
  const language = getLanguageById(languageId);
  
  return `
Regardless of the instructions above, you MUST format your responses as follows:

1. First, provide your answer in English, enclosed in markdown blockquote format (> Your English response here)
2. Then, provide the translated version in ${language.name} (${language.nativeName}) as regular text.

You MUST use this exact format for every response:

> [English original answer here]

[${language.name} translation here]

Do not include any additional explanations or notes about the translation process.
If you're unsure about any specialized terms, use the most appropriate translation for the context.
`;
} 