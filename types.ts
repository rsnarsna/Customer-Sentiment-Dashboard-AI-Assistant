export type AIProvider = 'google' | 'openai' | 'mistral';

export interface SentimentPoint {
  reviewNumber: number;
  sentimentScore: number;
}

export interface WordCloudWord {
  text: string;
  value: number;
}

export interface AnalysisResult {
  sentimentTrend: SentimentPoint[];
  wordCloud: WordCloudWord[];
  summary: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}