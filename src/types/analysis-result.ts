import { Emotion } from "./emotion";

export interface AnalysisResult {
  id: string;
  question: string;
  answer: string;
  summary: string;
  totalVideoLength: number;
  improvement: string[];
  relevance: number;
  clarity: number;
  originality: number;
  engagement: number;
  emotion: Emotion;
  body: number[];
  voice: number[];
  createdAt?: string;
  updatedAt?: string;
}
