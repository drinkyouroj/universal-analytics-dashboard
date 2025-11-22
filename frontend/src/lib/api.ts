import axios from 'axios';
import type { AnalysisResult } from '../types';

const API_URL = '/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const analyzeContent = async (text: string): Promise<AnalysisResult> => {
  const response = await api.post<AnalysisResult>('/analyze', { text });
  return response.data;
};
