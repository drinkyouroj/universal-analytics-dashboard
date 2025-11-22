export interface AnalysisResult {
  sentiment: {
    score: number;
    comparative: number;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
  };
  keywords: { word: string; score: number }[];
  readability: {
    wordCount: number;
    sentenceCount: number;
    syllableCount: number;
    fleschKincaid: number;
  };
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    neutral: number;
  };
}

