import axios from 'axios';

import words from "../data/words-1000.json";

export const getWordScore = (word: string): number => {
  // This will be upgraded to take in consideration punctuation and capitalization
  return word.length;
};

export const getRandomWord = (): string => {
  const word = words[Math.floor(Math.random() * words.length)];
  if (typeof word !== "string") {
    throw new Error("Random word is not a string (this should never happen so if you're seeing this, I'm incredibly bad at programming)");
  }
  return word;
};

export const getRandomWords = (count: number): string[] => {
  return Array(count).fill(null).map(() => getRandomWord());
};

interface TTypingTestOptions {
  topic?: string;
  tokens?: number;
}
export const getTypingTest = async ({ topic = '', tokens = 100 }:TTypingTestOptions = {}):Promise<string> => {
  tokens = Math.max(1, Math.min(200, tokens));
  const result = await axios.get<{ prompt: string }>('/api/gpt/generate', { params: { topic, tokens } });
  return Promise.resolve(result.data?.prompt);
};
