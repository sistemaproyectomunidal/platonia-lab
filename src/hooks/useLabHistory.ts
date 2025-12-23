/**
 * useLabHistory - Lab Analysis History Hook
 * Manages the history of socratic analysis sessions in the laboratory
 */

import { useState, useCallback, useEffect } from 'react';
import type { AnalysisResponse } from '@/types';

interface LabHistoryEntry {
  id: string;
  timestamp: Date;
  userInput: string;
  analysis: AnalysisResponse;
}

interface UseLabHistoryReturn {
  history: LabHistoryEntry[];
  addAnalysis: (userInput: string, analysis: AnalysisResponse) => void;
  clearHistory: () => void;
  removeEntry: (id: string) => void;
  getLatest: () => LabHistoryEntry | null;
  exportHistory: () => string;
  importHistory: (json: string) => boolean;
}

const STORAGE_KEY = 'lagrange_lab_history';
const MAX_HISTORY = 50;

export function useLabHistory(): UseLabHistoryReturn {
  const [history, setHistory] = useState<LabHistoryEntry[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(
          parsed.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          }))
        );
      }
    } catch (e) {
      console.warn('Failed to load lab history:', e);
    }
  }, []);

  // Save to localStorage when history changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save lab history:', e);
    }
  }, [history]);

  const addAnalysis = useCallback((userInput: string, analysis: AnalysisResponse) => {
    const entry: LabHistoryEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      userInput,
      analysis,
    };

    setHistory((prev) => {
      const updated = [entry, ...prev];
      // Keep only the most recent entries
      return updated.slice(0, MAX_HISTORY);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const getLatest = useCallback((): LabHistoryEntry | null => {
    return history[0] || null;
  }, [history]);

  const exportHistory = useCallback((): string => {
    return JSON.stringify(history, null, 2);
  }, [history]);

  const importHistory = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        setHistory(
          parsed.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          }))
        );
        return true;
      }
    } catch (e) {
      console.warn('Failed to import lab history:', e);
    }
    return false;
  }, []);

  return {
    history,
    addAnalysis,
    clearHistory,
    removeEntry,
    getLatest,
    exportHistory,
    importHistory,
  };
}

export default useLabHistory;
