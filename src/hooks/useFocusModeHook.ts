import { useContext } from "react";
import { FocusModeContextValue, FocusModeContext } from "./FocusModeProvider";

export const useFocusMode = () => {
  const context = useContext(FocusModeContext);
  if (!context) {
    throw new Error("useFocusMode must be used within a FocusModeProvider");
  }
  return context;
};
