import { StateCreator } from 'zustand';
import { quranApi } from '@/services/quranApi';

// Assuming a type for the surah list item from the old API
export interface SurahInfo {
  name: string;
  name_translations: {
    ar: string;
    en: string;
    id: string;
  };
  number_of_ayah: number;
  number_of_surah: number;
  place: string;
  type: string;
}

export interface SurahListSlice {
  surahList: SurahInfo[];
  isSurahListLoading: boolean;
  fetchSurahList: () => Promise<void>;
}

export const createSurahListSlice: StateCreator<SurahListSlice> = (set, get) => ({
  surahList: [],
  isSurahListLoading: false,
  fetchSurahList: async () => {
    if (get().surahList.length > 0 || get().isSurahListLoading) {
      return; // Don't fetch if already populated or loading
    }
    set({ isSurahListLoading: true });
    try {
      const list = await quranApi.getSuratListWithArabicNames();
      set({ surahList: list, isSurahListLoading: false });
    } catch (error) {
      console.error("Failed to fetch surah list with Arabic names:", error);
      set({ isSurahListLoading: false });
    }
  },
});
