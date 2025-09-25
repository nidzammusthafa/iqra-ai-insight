import { create } from 'zustand';
import { SingleSurahResponse, Verse, Qari, QARIS, PageVerse } from '@/types/quran';
import { quranApi } from '@/services/quranApi';

interface AudioState {
  isPlaying: boolean;
  currentSurah: SingleSurahResponse | null;
  currentVerse: Verse | null;
  currentQari: Qari;
  isContinuousPlayEnabled: boolean;
  isShuffleEnabled: boolean;
  audioRef: HTMLAudioElement | null;
  playbackMode: 'surah' | 'page';
  pageVerseQueue: { verse: PageVerse, surahNumber: number }[] | null;
} 

interface AudioActions {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setAudioRef: (ref: HTMLAudioElement) => void;
  setVerse: (surah: SingleSurahResponse, verse: Verse, options?: { isNewSurah?: boolean }) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  toggleContinuousPlay: () => void;
  toggleShuffle: () => void;
  setQari: (qari: Qari) => void;
  seek: (time: number) => void;
  playPage: (items: { verse: PageVerse, surahNumber: number }[]) => Promise<void>;
  playNextInPageQueue: () => Promise<void>;
}

export const useAudioStore = create<AudioState & AudioActions>((set, get) => ({
  // ... (existing state)
  playbackMode: 'surah',
  pageVerseQueue: null,
  currentPageQueueIndex: -1,

  // ... (existing actions)

  playPage: async (items) => {
    if (items.length === 0) return;
    set({ 
      playbackMode: 'page', 
      pageVerseQueue: items, 
      currentPageQueueIndex: 0 
    });

    const { setVerse, stop } = get();
    const firstItem = items[0];
    
    try {
      const surahData = await quranApi.getSuratDetail(firstItem.surahNumber);
      const fullVerseData = surahData.ayahs.find(v => v.number.inQuran === firstItem.verse.number.inQuran);

      if (fullVerseData) {
        setVerse(surahData, fullVerseData, { isNewSurah: true });
      } else {
        stop();
      }
    } catch (error) {
      console.error("Failed to start page playback:", error);
      stop();
    }
  },

  playNextInPageQueue: async () => {
    const { pageVerseQueue, currentPageQueueIndex, stop, setVerse } = get();
    if (!pageVerseQueue) {
      stop();
      return;
    }

    const nextIndex = currentPageQueueIndex + 1;
    if (nextIndex >= pageVerseQueue.length) {
      stop();
      return;
    }

    set({ currentPageQueueIndex: nextIndex });
    const nextItem = pageVerseQueue[nextIndex];

    try {
      const currentSurah = get().currentSurah;
      
      if (currentSurah?.number !== nextItem.surahNumber) {
        const surahData = await quranApi.getSuratDetail(nextItem.surahNumber);
        const fullVerseData = surahData.ayahs.find(v => v.number.inQuran === nextItem.verse.number.inQuran);
        if (fullVerseData) {
          setVerse(surahData, fullVerseData, { isNewSurah: true });
        } else { stop(); }
      } else {
        const fullVerseData = currentSurah.ayahs.find(v => v.number.inQuran === nextItem.verse.number.inQuran);
        if (fullVerseData) {
          setVerse(currentSurah, fullVerseData);
        } else { stop(); }
      }
    } catch (error) {
      console.error("Failed to play next in page queue:", error);
      stop();
    }
  },

  toggleContinuousPlay: () => set((state) => ({ isContinuousPlayEnabled: !state.isContinuousPlayEnabled })),

  toggleShuffle: () => set((state) => ({ isShuffleEnabled: !state.isShuffleEnabled })),
  
  setQari: (qari) => {
    set({ currentQari: qari });
    const { currentSurah, currentVerse, setVerse } = get();
    if (currentSurah && currentVerse) {
      setVerse(currentSurah, currentVerse);
    }
  },

  seek: (time) => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.currentTime = time;
    }
  },
}));
