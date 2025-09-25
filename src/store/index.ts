import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PreferencesSlice, createPreferencesSlice } from './preferencesSlice';
import { BookmarkSlice, createBookmarkSlice } from './bookmarkSlice';
import { SurahListSlice, createSurahListSlice } from './surahListSlice';

// The main app state now includes the new surah list slice.
type AppState = PreferencesSlice & BookmarkSlice & SurahListSlice;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createPreferencesSlice(...a),
      ...createBookmarkSlice(...a),
      ...createSurahListSlice(...a),
    }),
    {
      name: 'quran-app-store', // A single key for the persisted state
      storage: createJSONStorage(() => localStorage),
      // Persist only preferences and bookmarks.
      partialize: (state) => ({
        preferences: state.preferences,
        bookmarks: state.bookmarks,
        folders: state.folders,
      }),
      // Custom merge function to handle nested preferences.
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
