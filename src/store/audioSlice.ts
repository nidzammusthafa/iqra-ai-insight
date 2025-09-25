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
  currentPageQueueIndex: number;
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
  isPlaying: false,
  currentSurah: null,
  currentVerse: null,
  currentQari: QARIS[0],
  isContinuousPlayEnabled: true,
  isShuffleEnabled: false,
  audioRef: null,
  playbackMode: 'surah',
  pageVerseQueue: null,
  currentPageQueueIndex: -1,

  setAudioRef: (ref) => {
    const { playNext } = get();
    if (ref) {
      ref.onended = playNext;
    }
    set({ audioRef: ref });
  },

  play: () => {
    const { audioRef } = get();
    if (audioRef?.src) {
      audioRef.play();
      set({ isPlaying: true });
    }
  },

  pause: () => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.pause();
      set({ isPlaying: false });
    }
  },

  stop: () => {
    get().pause();
    set({ 
      currentSurah: null, 
      currentVerse: null, 
      playbackMode: 'surah', 
      pageVerseQueue: null, 
      currentPageQueueIndex: -1 
    });
  },

  setVerse: (surah, verse, options = {}) => {
    const { audioRef, currentQari, playNext } = get();
    set({ currentSurah: surah, currentVerse: verse });

    if (audioRef) {
      audioRef.onended = playNext;

      const isNewSurah = options.isNewSurah || false;
      const isBasmalahRequired = isNewSurah && verse.number.inSurah === 1 && surah.number !== 1 && surah.number !== 9;

      if (isBasmalahRequired && surah.bismillah) {
        const basmalahUrl = surah.bismillah.audio[currentQari];
        audioRef.src = basmalahUrl;
        audioRef.play();
        set({ isPlaying: true });

        audioRef.onended = () => {
          const { currentVerse: latestVerse, currentQari: latestQari } = get();
          if (latestVerse) {
            audioRef.src = latestVerse.audio[latestQari];
            audioRef.play();
            audioRef.onended = playNext;
          }
        };
      } else {
        const audioUrl = verse.audio[currentQari];
        if (audioRef.src !== audioUrl) {
          audioRef.src = audioUrl;
        }
        audioRef.play();
        set({ isPlaying: true });
      }
    }
  },

  playNext: async () => {
    const { playbackMode, playNextInPageQueue, currentSurah, currentVerse, isContinuousPlayEnabled, isShuffleEnabled, setVerse, stop } = get();
    
    if (playbackMode === 'page') {
      await playNextInPageQueue();
      return;
    }

    if (!currentSurah || !currentVerse) return;

    const verses = currentSurah.ayahs || currentSurah.verses || [];
    const currentVerseIndex = verses.findIndex(v => v.number.inSurah === currentVerse.number.inSurah);

    if (currentVerseIndex < verses.length - 1) {
      const nextVerse = verses[currentVerseIndex + 1];
      setVerse(currentSurah, nextVerse);
    } else {
      if (!isContinuousPlayEnabled) {
        stop();
        return;
      }

      let nextSurahNumber = isShuffleEnabled ? Math.floor(Math.random() * 114) + 1 : currentSurah.number + 1;
      if (nextSurahNumber > 114) {
        stop();
        return;
      }

      try {
        const nextSurahData = await quranApi.getSuratDetail(nextSurahNumber);
        const firstVerse = (nextSurahData.ayahs || nextSurahData.verses || [])[0];
        setVerse(nextSurahData, firstVerse, { isNewSurah: true });
      } catch (error) {
        console.error("Failed to load next surah:", error);
        stop();
      }
    }
  },

  playPrevious: async () => {
    const { currentSurah, currentVerse, setVerse } = get();
    if (!currentSurah || !currentVerse) return;

    const verses = currentSurah.ayahs || currentSurah.verses || [];
    const currentVerseIndex = verses.findIndex(v => v.number.inSurah === currentVerse.number.inSurah);

    if (currentVerseIndex > 0) {
      const prevVerse = verses[currentVerseIndex - 1];
      setVerse(currentSurah, prevVerse);
    } else {
      const prevSurahNumber = currentSurah.number - 1;
      if (prevSurahNumber < 1) return;

      try {
        const prevSurahData = await quranApi.getSuratDetail(prevSurahNumber);
        const prevVerses = prevSurahData.ayahs || prevSurahData.verses || [];
        const lastVerse = prevVerses[prevVerses.length - 1];
        setVerse(prevSurahData, lastVerse, { isNewSurah: true });
      } catch (error) {
        console.error("Failed to load previous surah:", error);
        get().stop();
      }
    }
  },

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
