import { StateCreator } from 'zustand';

export interface AudioSlice {
  currentSurahNumber: number | null;
  currentVerseNumber: number | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  seekTo: number | null; // Used to trigger a seek side-effect

  playVerse: (surahNumber: number, verseNumber: number) => void;
  togglePlayPause: () => void;
  stop: () => void;
  nextVerse: () => void;
  prevVerse: () => void;
  seek: (time: number) => void;
  onSeekComplete: () => void; // To reset seekTo after effect is done
  setPlayingStatus: (playing: boolean) => void;
  setAudioProgress: (progress: { duration: number; currentTime: number }) => void;
}

export const createAudioSlice: StateCreator<
  AudioSlice,
  [],
  [],
  AudioSlice
> = (set, get) => ({
  currentSurahNumber: null,
  currentVerseNumber: null,
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  seekTo: null,

  playVerse: (surahNumber, verseNumber) =>
    set({
      currentSurahNumber: surahNumber,
      currentVerseNumber: verseNumber,
      isPlaying: true,
    }),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  stop: () =>
    set({
      currentSurahNumber: null,
      currentVerseNumber: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    }),
  nextVerse: () => {
    const { currentVerseNumber } = get();
    if (currentVerseNumber) {
      set({ currentVerseNumber: currentVerseNumber + 1 });
    }
  },
  prevVerse: () => {
    const { currentVerseNumber } = get();
    if (currentVerseNumber && currentVerseNumber > 1) {
      set({ currentVerseNumber: currentVerseNumber - 1 });
    }
  },
  seek: (time) => set({ seekTo: time }),
  onSeekComplete: () => set({ seekTo: null }),
  setPlayingStatus: (playing) => set({ isPlaying: playing }),
  setAudioProgress: (progress) => set(progress),
});