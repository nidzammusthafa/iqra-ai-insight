import { useState, useMemo, ReactNode } from "react";
import { FocusModeContext, FocusModeContextValue } from "./useFocusMode";

const FocusModeProvider = ({ children }: { children: ReactNode }) => {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const value: FocusModeContextValue = useMemo(
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
