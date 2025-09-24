import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PreferencesSlice, createPreferencesSlice } from './preferencesSlice';
import { AudioSlice, createAudioSlice } from './audioSlice';
import { BookmarkSlice, createBookmarkSlice } from './bookmarkSlice';

type AppState = PreferencesSlice & AudioSlice & BookmarkSlice;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createPreferencesSlice(...a),
      ...createAudioSlice(...a),
      ...createBookmarkSlice(...a),
    }),
    {
      name: 'quran-app-store', // A single key for the persisted state
      storage: createJSONStorage(() => localStorage),
      // Persist preferences and bookmarks, but not audio state
      partialize: (state) => ({
        preferences: state.preferences,
        bookmarks: state.bookmarks,
        folders: state.folders,
      }),
      // Custom merge function to handle nested preferences and also new fields in the root
      merge: (persistedState, currentState) => {
        const merged = { ...currentState, ...(persistedState as object) };
        if ((persistedState as PreferencesSlice)?.preferences) {
          merged.preferences = {
            ...currentState.preferences,
            ...(persistedState as PreferencesSlice).preferences,
          };
        }
        return merged;
      },
    }
  )
);
