import { create } from 'zustand';
import { SingleSurahResponse, Verse, Qari, QARIS } from '@/types/quran';
import { quranApi } from '@/services/quranApi';

interface AudioState {
  isPlaying: boolean;
  currentSurah: SingleSurahResponse | null;
  currentVerse: Verse | null;
  currentQari: Qari;
  isContinuousPlayEnabled: boolean;
  isShuffleEnabled: boolean;
  audioRef: HTMLAudioElement | null;
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
}

export const useAudioStore = create<AudioState & AudioActions>((set, get) => ({
  isPlaying: false,
  currentSurah: null,
  currentVerse: null,
  currentQari: QARIS[0],
  isContinuousPlayEnabled: true, // Default to true for better UX
  isShuffleEnabled: false,
  audioRef: null,

  setAudioRef: (ref) => {
    const { playNext } = get();
    if (ref) {
      ref.onended = playNext; // Attach the event listener here
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
    set({ currentSurah: null, currentVerse: null });
  },

  setVerse: (surah, verse, options = {}) => {
    const { audioRef, currentQari, playNext } = get();
    set({ currentSurah: surah, currentVerse: verse });

    if (audioRef) {
      audioRef.onended = playNext; // Ensure default handler is set

      const isNewSurah = options.isNewSurah || false;
      const isBasmalahRequired = isNewSurah && verse.number.inSurah === 1 && surah.number !== 1 && surah.number !== 9;

      if (isBasmalahRequired) {
        const basmalahUrl = surah.bismillah.audio[currentQari];
        audioRef.src = basmalahUrl;
        audioRef.play();
        set({ isPlaying: true });

        // When basmalah ends, play the actual verse
        audioRef.onended = () => {
          const { currentVerse: latestVerse, currentQari: latestQari } = get();
          if (latestVerse) {
            audioRef.src = latestVerse.audio[latestQari];
            audioRef.play();
            audioRef.onended = playNext; // Reset to default handler
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
    const { currentSurah, currentVerse, isContinuousPlayEnabled, isShuffleEnabled, setVerse } = get();
    if (!currentSurah || !currentVerse) return;

    const verses = currentSurah.ayahs || currentSurah.verses || [];
    const currentVerseIndex = verses.findIndex(v => v.number.inSurah === currentVerse.number.inSurah);

    if (currentVerseIndex < verses.length - 1) {
      // Play next verse in the same surah
      const nextVerse = verses[currentVerseIndex + 1];
      setVerse(currentSurah, nextVerse);
    } else {
      // It's the last verse
      if (!isContinuousPlayEnabled) {
        get().stop();
        return;
      }

      let nextSurahNumber;
      if (isShuffleEnabled) {
        nextSurahNumber = Math.floor(Math.random() * 114) + 1;
      } else {
        nextSurahNumber = currentSurah.number + 1;
      }

      if (nextSurahNumber > 114) {
        get().stop();
        return;
      }

      try {
        const nextSurahData = await quranApi.getSuratDetail(nextSurahNumber);
        const firstVerse = (nextSurahData.ayahs || nextSurahData.verses || [])[0];
        setVerse(nextSurahData, firstVerse, { isNewSurah: true });
      } catch (error) {
        console.error("Failed to load next surah:", error);
        get().stop();
      }
    }
  },

  playPrevious: async () => {
    const { currentSurah, currentVerse, setVerse } = get();
    if (!currentSurah || !currentVerse) return;

    const verses = currentSurah.ayahs || currentSurah.verses || [];
    const currentVerseIndex = verses.findIndex(v => v.number.inSurah === currentVerse.number.inSurah);

    if (currentVerseIndex > 0) {
      // Play previous verse in the same surah
      const prevVerse = verses[currentVerseIndex - 1];
      setVerse(currentSurah, prevVerse);
    } else {
      // It's the first verse, go to previous surah
      const prevSurahNumber = currentSurah.number - 1;
      if (prevSurahNumber < 1) return; // No previous surah

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

  toggleContinuousPlay: () => set((state) => ({ isContinuousPlayEnabled: !state.isContinuousPlayEnabled })),

  toggleShuffle: () => set((state) => ({ isShuffleEnabled: !state.isShuffleEnabled })),
  
  setQari: (qari) => {
    set({ currentQari: qari });
    // If a verse is playing, reload the audio with the new qari
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
