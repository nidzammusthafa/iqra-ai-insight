import { StateCreator } from 'zustand';
import { ReadingPreferences, TranslationId } from '@/types/quran';

const DEFAULT_PREFERENCES: ReadingPreferences = {
  arabicFontFamily: 'Amiri',
  arabicFontSize: 24,
  translationFontSize: 'medium',
  showTranslation: true,
  showVerseActionButtons: true,
  defaultTranslation: TranslationId.ID,
  lineSpacing: 'normal',
  theme: 'auto',
  selectedQari: 'alafasy',
  isAutoplayEnabled: false,
  autoplayDelay: 2,
  playbackSpeed: 1,
  prayerNotifications: {
    isEnabled: false,
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
    disableDhuhrOnFridays: true,
    fajrAdhan: 'madinah',
  },
};

export interface PreferencesSlice {
  preferences: ReadingPreferences;
  updatePreferences: (updates: Partial<ReadingPreferences>) => void;
  resetPreferences: () => void;
}

export const createPreferencesSlice: StateCreator<PreferencesSlice> = (set) => ({
  preferences: DEFAULT_PREFERENCES,
  updatePreferences: (updates) =>
    set((state) => ({
      preferences: { ...state.preferences, ...updates },
    })),
  resetPreferences: () => set({ preferences: DEFAULT_PREFERENCES }),
});
