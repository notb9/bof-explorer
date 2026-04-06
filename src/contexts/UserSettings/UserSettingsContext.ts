import { createContext } from "react";

export interface UserSettings {
  coffloaderPath: string;
  kitPaths: Record<string, string>;
  alwaysExpandUsage: boolean;
}

export interface UserSettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

export const UserSettingsContext = createContext<
  UserSettingsContextType | undefined
>(undefined);
