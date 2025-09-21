import { useState, useEffect } from 'react';
import { ReadingPreferences, TranslationId } from '@/types/quran';

const DEFAULT_PREFERENCES: ReadingPreferences = {
  arabicFontSize: 'medium',
  translationFontSize: 'medium',
  showTranslation: true,
  defaultTranslation: TranslationId.ID,
  lineSpacing: 'normal',
  theme: 'auto'
};

export const useReadingPreferences = () => {
  const [preferences, setPreferences] = useState<ReadingPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const saved = localStorage.getItem('reading_preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      } catch (error) {
        console.error('Failed to parse reading preferences:', error);
      }
    }
  }, []);

  const updatePreferences = (updates: Partial<ReadingPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    localStorage.setItem('reading_preferences', JSON.stringify(newPreferences));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.removeItem('reading_preferences');
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences
  };
};