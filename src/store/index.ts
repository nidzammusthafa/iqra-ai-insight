import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PreferencesSlice, createPreferencesSlice } from './preferencesSlice';
import { BookmarkSlice, createBookmarkSlice } from './bookmarkSlice';

// The main app state now only includes persisted slices.
// Audio state is managed in its own separate store (useAudioStore).
type AppState = PreferencesSlice & BookmarkSlice;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createPreferencesSlice(...a),
      ...createBookmarkSlice(...a),
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
