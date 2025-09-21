import { createContext, useContext } from "react";

export interface FocusModeContextValue {
  isFocusMode: boolean;
  setIsFocusMode: (isFocus: boolean) => void;
}

export const FocusModeContext = createContext<FocusModeContextValue | null>(null);

export const useFocusMode = () => {
  const context = useContext(FocusModeContext);
  if (!context) {
    throw new Error("useFocusMode must be used within a FocusModeProvider");
  }
  return context;
};
