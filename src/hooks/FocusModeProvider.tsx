import { createContext, useState, useMemo, ReactNode } from "react";

export interface FocusModeContextValue {
  isFocusMode: boolean;
  setIsFocusMode: (isFocus: boolean) => void;
}

export const FocusModeContext = createContext<FocusModeContextValue | null>(null);

const FocusModeProvider = ({ children }: { children: ReactNode }) => {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const value = useMemo(
    () => ({
      isFocusMode,
      setIsFocusMode,
    }),
    [isFocusMode]
  );

  return (
    <FocusModeContext.Provider value={value}>
      {children}
    </FocusModeContext.Provider>
  );
};

export default FocusModeProvider;