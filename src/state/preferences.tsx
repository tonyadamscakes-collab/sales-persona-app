import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isDifficulty, type Difficulty, type ThemeMode } from "@/src/domain";
import { darkPalette, lightPalette, type Palette } from "@/src/theme/tokens";

const KEYS = {
  name: "spt-name",
  difficulty: "spt-difficulty",
  mode: "spt-mode",
} as const;

type Preferences = {
  ready: boolean;
  name: string;
  difficulty: Difficulty;
  mode: ThemeMode;
  colors: Palette;
  setName: (name: string) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setMode: (mode: ThemeMode) => void;
};

const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [name, setNameState] = useState("");
  const [difficulty, setDifficultyState] = useState<Difficulty>("medium");
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      AsyncStorage.getItem(KEYS.name),
      AsyncStorage.getItem(KEYS.difficulty),
      AsyncStorage.getItem(KEYS.mode),
    ])
      .then(([storedName, storedDifficulty, storedMode]) => {
        if (cancelled) return;
        if (storedName) setNameState(storedName);
        if (storedDifficulty && isDifficulty(storedDifficulty)) setDifficultyState(storedDifficulty);
        if (storedMode === "dark" || storedMode === "light") setModeState(storedMode);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setName = useCallback((value: string) => {
    setNameState(value);
    void AsyncStorage.setItem(KEYS.name, value);
  }, []);

  const setDifficulty = useCallback((value: Difficulty) => {
    setDifficultyState(value);
    void AsyncStorage.setItem(KEYS.difficulty, value);
  }, []);

  const setMode = useCallback((value: ThemeMode) => {
    setModeState(value);
    void AsyncStorage.setItem(KEYS.mode, value);
  }, []);

  const colors = mode === "dark" ? darkPalette : lightPalette;
  const value = useMemo(
    () => ({ ready, name, difficulty, mode, colors, setName, setDifficulty, setMode }),
    [ready, name, difficulty, mode, colors, setName, setDifficulty, setMode],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): Preferences {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error("usePreferences must be used within PreferencesProvider");
  return value;
}
