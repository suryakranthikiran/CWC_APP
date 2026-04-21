import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

import { themes, type AppTheme, type ThemeMode } from "./colors";

type ThemePreference = ThemeMode | "system";

type ThemeContextValue = {
  theme: AppTheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
  toggleTheme: () => Promise<void>;
  isReady: boolean;
};

const STORAGE_KEY = "app-theme-preference";
let hasWarnedAboutStorage = false;

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isStorageUnavailable(error: unknown) {
  return error instanceof Error && /native module is null|cannot access legacy storage/i.test(error.message);
}

function warnStorageFallback(error: unknown) {
  if (!hasWarnedAboutStorage && isStorageUnavailable(error)) {
    hasWarnedAboutStorage = true;
    console.warn("AsyncStorage is unavailable; theme preference will not persist until the native module is installed.");
  }
}

async function readStoredPreference() {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch (error) {
    warnStorageFallback(error);
    return null;
  }
}

async function persistPreference(preference: ThemePreference) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, preference);
  } catch (error) {
    warnStorageFallback(error);
  }
}

function getTheme(preference: ThemePreference, systemScheme: ReturnType<typeof useColorScheme>): AppTheme {
  if (preference === "system") {
    return themes[systemScheme === "dark" ? "dark" : "light"];
  }

  return themes[preference];
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPreference() {
      try {
        const storedPreference = await readStoredPreference();

        if (
          isMounted &&
          (storedPreference === "light" || storedPreference === "dark" || storedPreference === "system")
        ) {
          setPreferenceState(storedPreference);
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    loadPreference();

    return () => {
      isMounted = false;
    };
  }, []);

  const setPreference = useCallback(async (nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference);
    await persistPreference(nextPreference);
  }, []);

  const toggleTheme = useCallback(async () => {
    const activeTheme = getTheme(preference, systemScheme);
    await setPreference(activeTheme.isDark ? "light" : "dark");
  }, [preference, setPreference, systemScheme]);

  const value = useMemo(
    () => ({
      theme: getTheme(preference, systemScheme),
      preference,
      setPreference,
      toggleTheme,
      isReady,
    }),
    [isReady, preference, systemScheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }

  return context;
}