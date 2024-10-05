export interface CvResult {
  jobKeywords: string[];
  resumeKeywords: string[];
  relevanceScore: number;
  quantifiedScore: number;
  judgements: {
    requirement: string;
    isFit: boolean;
  }[];
  summary: string;
  improvement: string[];
}
