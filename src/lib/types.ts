import { Preset } from './presets';
import { Language } from './languages';

// Extended SharedResponse with like count
export interface SharedResponse {
  id: string;
  responseContent: string;
  originalContent?: string | null;
  presetId: string;
  languageId: string;
  userPrompt: string;
  userId: string;
  timestamp: Date;
  likeCount: number;
}

export interface FeedEvent {
  type: 'new-response' | 'like' | 'unlike';
  data: SharedResponse;
  timestamp: number;
}

export interface SharedResponseInput {
  responseContent: string;
  originalContent?: string;
  presetId: string;
  languageId: string;
  userPrompt: string;
  userId: string;
}

export interface LikeInput {
  responseId: string;
  userId: string;
}

// Metrics types
export interface MetricsData {
  generatedCount: number;
  sharedCount: number;
  topLikedResponses: SharedResponse[];
  presetDistribution: PresetMetric[];
  languageDistribution: LanguageMetric[];
}

export interface PresetMetric {
  presetId: string;
  presetName: string;
  count: number;
}

export interface LanguageMetric {
  languageId: string;
  languageName: string;
  count: number;
}

export interface TopLikedResponse {
  response: SharedResponse;
  preset: Preset;
  language: Language;
  likeCount: number;
} 