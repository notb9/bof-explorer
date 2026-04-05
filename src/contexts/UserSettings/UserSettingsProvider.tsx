import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { UserSettingsContext, type UserSettings } from "./UserSettingsContext";

const STORAGE_KEY = "user-settings";
const DEFAULT_SETTINGS = {
  coffloaderPath: ".\\CoffLoader64.exe",
  kitPaths: {
    "TrustedSec - Situational Awareness": ".",
    "REDMED-X - Operators Kit": ".",
  },
  alwaysExpandUsage: false,
};

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { ...DEFAULT_SETTINGS };
  });

  // Keep function reference consistent with useCallback
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      // Merge kitPaths specifiek als deze in newSettings zit
      kitPaths: newSettings.kitPaths
        ? { ...prev.kitPaths, ...newSettings.kitPaths }
        : prev.kitPaths,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  // Store settings in localstorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Memoize the value to avoid rerenders when contents did not change.
  const value = useMemo(
    () => ({ settings, updateSettings, resetSettings }),
    [settings, updateSettings, resetSettings],
  );

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
}
