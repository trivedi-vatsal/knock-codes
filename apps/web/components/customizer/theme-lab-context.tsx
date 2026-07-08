"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  DEFAULT_THEME_LAB_SETTINGS,
  getThemePreset,
  type ThemeLabSettings,
  type ThemePresetId,
} from "@/lib/theme-presets";

const STORAGE_KEY = "access-theme-lab:v1";

interface ThemeLabContextValue {
  settings: ThemeLabSettings;
  hydrated: boolean;
  update: <K extends keyof ThemeLabSettings>(key: K, value: ThemeLabSettings[K]) => void;
  /** Applies a preset and resets base color/surface/radius/font to that preset's defaults. */
  selectPreset: (id: ThemePresetId) => void;
  reset: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ThemeLabContext = createContext<ThemeLabContextValue | null>(null);

function readStoredSettings(): ThemeLabSettings {
  if (typeof window === "undefined") return DEFAULT_THEME_LAB_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THEME_LAB_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<ThemeLabSettings>;
    return { ...DEFAULT_THEME_LAB_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_THEME_LAB_SETTINGS;
  }
}

export function ThemeLabProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeLabSettings>(DEFAULT_THEME_LAB_SETTINGS);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Deferred to an effect, same reasoning as useKnockCodes's initial read:
  // never let server-rendered markup depend on localStorage.
  useEffect(() => {
    setSettings(readStoredSettings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  const update = <K extends keyof ThemeLabSettings>(key: K, value: ThemeLabSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const selectPreset = (id: ThemePresetId) => {
    const preset = getThemePreset(id);
    setSettings((current) => ({
      ...current,
      preset: id,
      baseColor: preset.defaultBaseColor,
      surfaceStyle: preset.defaultSurfaceStyle,
      radius: preset.defaultRadius,
      font: preset.defaultFont,
    }));
  };

  const reset = () => setSettings(DEFAULT_THEME_LAB_SETTINGS);

  return (
    <ThemeLabContext.Provider value={{ settings, hydrated, update, selectPreset, reset, open, setOpen }}>
      {children}
    </ThemeLabContext.Provider>
  );
}

export function useThemeLab(): ThemeLabContextValue {
  const ctx = useContext(ThemeLabContext);
  if (!ctx) throw new Error("useThemeLab must be used within a ThemeLabProvider");
  return ctx;
}
