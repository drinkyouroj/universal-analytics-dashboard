import Sentiment from 'sentiment';
import natural from 'natural';

const sentiment = new Sentiment();
const tokenizer = new natural.WordTokenizer();

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
    syllableCount: number; // Placeholder
    fleschKincaid: number; // Placeholder
  };
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    neutral: number;
  };
}

export const analyzeContent = (text: string): AnalysisResult => {
  // 1. Sentiment Analysis
  const sentimentResult = sentiment.analyze(text);
  
  // 2. Keyword Extraction (TF-IDF)
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(text);
  
  const keywords: { word: string; score: number }[] = [];
  tfidf.listTerms(0 /* document index */).forEach(item => {
    if (item.term.length > 3) { // Filter short words
      keywords.push({ word: item.term, score: item.tfidf });
    }
  });
  // Sort by score and take top 20
  const topKeywords = keywords.sort((a, b) => b.score - a.score).slice(0, 20);

  // 3. Basic Readability Metrics
  const words = tokenizer.tokenize(text) || [];
  const wordCount = words.length;
  const sentenceCount = text.split(/[.!?]+/).length - 1 || 1;
  
  // Simple Flesch-Kincaid approximation (needs syllable count, simplifying here)
  // 206.835 - 1.015(total words/total sentences) - 84.6(total syllables/total words)
  // We'll use a rough estimate of syllables per word based on length
  const estimatedSyllables = words.reduce((acc, word) => acc + Math.max(1, word.length / 3), 0);
  const fleschKincaid = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (estimatedSyllables / wordCount);

  // 4. Emotion Detection (Heuristic/Rule-based for now as 'natural' classifiers need training data)
  // In a real app, we'd use a pre-trained model or API.
  // We will map sentiment words to basic emotions based on a small dictionary or just use sentiment score to bias it.
  // This is a PLACEHOLDER implementation for emotions.
  
  const emotions = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    neutral: 0
  };

  // Naive mapping from positive/negative words to emotions
  sentimentResult.positive.forEach(() => emotions.joy += 1);
  sentimentResult.negative.forEach(() => emotions.sadness += 0.5); // Split neg between sadness/anger/fear
  sentimentResult.negative.forEach(() => emotions.anger += 0.3);
  sentimentResult.negative.forEach(() => emotions.fear += 0.2);
  
  const totalEmotionScore = emotions.joy + emotions.sadness + emotions.anger + emotions.fear + 0.1; // avoid div 0
  
  // Normalize to percentages
  const normalizedEmotions = {
    joy: Math.round((emotions.joy / totalEmotionScore) * 100),
    sadness: Math.round((emotions.sadness / totalEmotionScore) * 100),
    anger: Math.round((emotions.anger / totalEmotionScore) * 100),
    fear: Math.round((emotions.fear / totalEmotionScore) * 100),
    neutral: Math.max(0, 100 - (Math.round((emotions.joy / totalEmotionScore) * 100) * 2)) // Simplified neutral
  };
  
  if (sentimentResult.score === 0) {
      normalizedEmotions.neutral = 100;
      normalizedEmotions.joy = 0;
      normalizedEmotions.sadness = 0;
      normalizedEmotions.anger = 0;
      normalizedEmotions.fear = 0;
  }

  return {
    sentiment: {
      score: sentimentResult.score,
      comparative: sentimentResult.comparative,
      tokens: sentimentResult.tokens,
      words: sentimentResult.words,
      positive: sentimentResult.positive,
      negative: sentimentResult.negative,
    },
    keywords: topKeywords,
    readability: {
      wordCount,
      sentenceCount,
      syllableCount: Math.round(estimatedSyllables),
      fleschKincaid: Math.round(fleschKincaid * 10) / 10,
    },
    emotions: normalizedEmotions,
  };
};

