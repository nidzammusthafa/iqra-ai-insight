import { StateCreator } from 'zustand';

export interface UiSlice {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
}

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set) => ({
  isFocusMode: false,
  toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
});
