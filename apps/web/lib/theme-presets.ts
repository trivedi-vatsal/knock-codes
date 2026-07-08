/**
 * Theme Customizer data model — powers the "Access Theme Lab" drawer.
 *
 * Everything here is preview-scoped: `PreviewThemeProvider` (components/customizer)
 * turns a selection into `--ag-*` CSS custom properties on a wrapper around a
 * single demo, never on `document.documentElement`. The `packages/react`
 * components read those vars with a literal fallback (e.g.
 * `bg-[var(--ag-primary,#187c74)]`), so outside this site — with no
 * customizer, no vars defined — every block renders exactly the same
 * "Clearance" look shown here by default.
 */

export type ThemeMode = "local-hash" | "server-verify" | "demo-preview";
export type ThemePresetId = "clearance" | "vault" | "signal" | "paper-lock" | "night-ops";
export type BaseColorId = "teal" | "citron" | "amber" | "red" | "graphite" | "blue-gray";
export type SurfaceStyleId = "paper" | "console" | "glass-minimal" | "terminal" | "dashboard";
export type RadiusId = "sharp" | "default" | "soft";
export type FontId = "geist-sans" | "inter" | "mono-forward" | "system";
export type DensityId = "comfortable" | "compact";
export type PreviewStateId = "locked" | "invalid" | "submitting" | "unlocked" | "expiring";

export interface ThemeToneVars {
  bg: string;
  fg: string;
  card: string;
  border: string;
  primary: string;
  primaryFg: string;
  accent: string;
  accentFg: string;
}

export interface ThemePreset {
  id: ThemePresetId;
  label: string;
  tagline: string;
  description: string;
  light: ThemeToneVars;
  dark: ThemeToneVars;
  defaultBaseColor: BaseColorId;
  defaultSurfaceStyle: SurfaceStyleId;
  defaultRadius: RadiusId;
  defaultFont: FontId;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "clearance",
    label: "Clearance",
    tagline: "Warm paper, teal primary, citron signal",
    description: "The default checkpoint look — warm paper surfaces, oxidized-teal controls, electric-citron signal accents.",
    light: {
      bg: "#f7f3ea",
      fg: "#191a18",
      card: "#fbf8f1",
      border: "#d9d2c2",
      primary: "#187c74",
      primaryFg: "#f7f3ea",
      accent: "#d6f75a",
      accentFg: "#191a18",
    },
    dark: {
      bg: "#0e1311",
      fg: "#edeae0",
      card: "#171d1a",
      border: "#26302b",
      primary: "#4fd1c5",
      primaryFg: "#0e1311",
      accent: "#dfff67",
      accentFg: "#0e1311",
    },
    defaultBaseColor: "teal",
    defaultSurfaceStyle: "paper",
    defaultRadius: "default",
    defaultFont: "geist-sans",
  },
  {
    id: "vault",
    label: "Vault",
    tagline: "Dark graphite, muted green, amber warnings",
    description: "A deposit-box mood — graphite surfaces, muted sage-green controls, amber warning strips.",
    light: {
      bg: "#e9e6dc",
      fg: "#1c1f1e",
      card: "#f1efe6",
      border: "#c9c4b4",
      primary: "#4b6358",
      primaryFg: "#f1efe6",
      accent: "#ffb020",
      accentFg: "#1c1f1e",
    },
    dark: {
      bg: "#14161a",
      fg: "#e4e6e0",
      card: "#1c1f22",
      border: "#2c3033",
      primary: "#6b8f7e",
      primaryFg: "#0e1311",
      accent: "#ffb020",
      accentFg: "#14161a",
    },
    defaultBaseColor: "graphite",
    defaultSurfaceStyle: "console",
    defaultRadius: "sharp",
    defaultFont: "geist-sans",
  },
  {
    id: "signal",
    label: "Signal",
    tagline: "Clean white, black text, bright status colors",
    description: "Maximum legibility — plain white/black surfaces, letting status colors carry all the signal.",
    light: {
      bg: "#ffffff",
      fg: "#0a0a0a",
      card: "#ffffff",
      border: "#e2e2e2",
      primary: "#0f9d8f",
      primaryFg: "#ffffff",
      accent: "#c6ff3d",
      accentFg: "#0a0a0a",
    },
    dark: {
      bg: "#0a0a0a",
      fg: "#ffffff",
      card: "#141414",
      border: "#2a2a2a",
      primary: "#2dd4bf",
      primaryFg: "#0a0a0a",
      accent: "#d7ff5c",
      accentFg: "#0a0a0a",
    },
    defaultBaseColor: "blue-gray",
    defaultSurfaceStyle: "glass-minimal",
    defaultRadius: "soft",
    defaultFont: "inter",
  },
  {
    id: "paper-lock",
    label: "Paper Lock",
    tagline: "Editorial off-white, ink black, stamped badges",
    description: "A dossier/stamped-document feel — ink-black controls on cream paper, red stamp accents.",
    light: {
      bg: "#f4efe4",
      fg: "#17140f",
      card: "#faf6ec",
      border: "#ddd3bb",
      primary: "#22211b",
      primaryFg: "#f4efe4",
      accent: "#b3392e",
      accentFg: "#f4efe4",
    },
    dark: {
      bg: "#17140f",
      fg: "#ede6d4",
      card: "#201c15",
      border: "#3a3327",
      primary: "#ede6d4",
      primaryFg: "#17140f",
      accent: "#d9564a",
      accentFg: "#17140f",
    },
    defaultBaseColor: "red",
    defaultSurfaceStyle: "paper",
    defaultRadius: "sharp",
    defaultFont: "system",
  },
  {
    id: "night-ops",
    label: "Night Ops",
    tagline: "Near-black, teal glow, amber/red state indicators",
    description: "A dim console for low-light ops — near-black surfaces, a glowing teal primary, hot amber/red state lights.",
    light: {
      bg: "#101413",
      fg: "#e3ede9",
      card: "#171e1c",
      border: "#26302e",
      primary: "#35d6c4",
      primaryFg: "#0b0f0e",
      accent: "#ffb020",
      accentFg: "#0b0f0e",
    },
    dark: {
      bg: "#0a0d0c",
      fg: "#e3ede9",
      card: "#121614",
      border: "#20302c",
      primary: "#35d6c4",
      primaryFg: "#0a0d0c",
      accent: "#ffb020",
      accentFg: "#0a0d0c",
    },
    defaultBaseColor: "teal",
    defaultSurfaceStyle: "terminal",
    defaultRadius: "default",
    defaultFont: "mono-forward",
  },
];

export const BASE_COLORS: Record<BaseColorId, { label: string; light: { primary: string; primaryFg: string }; dark: { primary: string; primaryFg: string } }> = {
  teal: { label: "Teal", light: { primary: "#187c74", primaryFg: "#f7f3ea" }, dark: { primary: "#4fd1c5", primaryFg: "#0e1311" } },
  citron: { label: "Citron", light: { primary: "#8ea62a", primaryFg: "#191a18" }, dark: { primary: "#dfff67", primaryFg: "#0e1311" } },
  amber: { label: "Amber", light: { primary: "#c97a10", primaryFg: "#191a18" }, dark: { primary: "#ffb020", primaryFg: "#0e1311" } },
  red: { label: "Red", light: { primary: "#b3392e", primaryFg: "#f7f3ea" }, dark: { primary: "#ff6169", primaryFg: "#0e1311" } },
  graphite: { label: "Graphite", light: { primary: "#3a3a36", primaryFg: "#f7f3ea" }, dark: { primary: "#c7c9c4", primaryFg: "#0e1311" } },
  "blue-gray": { label: "Blue-gray", light: { primary: "#3c5b66", primaryFg: "#f7f3ea" }, dark: { primary: "#8fb8c4", primaryFg: "#0e1311" } },
};

export const RADIUS_VALUES: Record<RadiusId, string> = {
  sharp: "0.125rem",
  default: "0.5rem",
  soft: "1rem",
};

export const FONT_STACKS: Record<FontId, string> = {
  "geist-sans": "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  inter: "Inter, ui-sans-serif, system-ui, sans-serif",
  "mono-forward": "var(--font-mono), ui-monospace, SFMono-Regular, monospace",
  system: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
};

export const THEME_MODE_LABELS: Record<ThemeMode, string> = {
  "local-hash": "Local Hash",
  "server-verify": "Server Verify",
  "demo-preview": "Demo Preview",
};

export const SURFACE_STYLE_LABELS: Record<SurfaceStyleId, string> = {
  paper: "Paper",
  console: "Console",
  "glass-minimal": "Glass Minimal",
  terminal: "Terminal",
  dashboard: "Dashboard",
};

export const DENSITY_LABELS: Record<DensityId, string> = {
  comfortable: "Comfortable",
  compact: "Compact",
};

export const PREVIEW_STATE_LABELS: Record<PreviewStateId, string> = {
  locked: "Locked",
  invalid: "Invalid code",
  submitting: "Submitting",
  unlocked: "Unlocked",
  expiring: "Expiring",
};

export interface ThemeLabSettings {
  mode: ThemeMode;
  preset: ThemePresetId;
  baseColor: BaseColorId;
  surfaceStyle: SurfaceStyleId;
  radius: RadiusId;
  font: FontId;
  density: DensityId;
  previewState: PreviewStateId;
}

export const DEFAULT_THEME_LAB_SETTINGS: ThemeLabSettings = {
  mode: "local-hash",
  preset: "clearance",
  baseColor: "teal",
  surfaceStyle: "paper",
  radius: "default",
  font: "geist-sans",
  density: "comfortable",
  previewState: "locked",
};

export function getThemePreset(id: ThemePresetId): ThemePreset {
  return THEME_PRESETS.find((preset) => preset.id === id) ?? THEME_PRESETS[0];
}

/** Resolves a settings object into the concrete `--ag-*` CSS custom properties `PreviewThemeProvider` applies. */
export function resolveThemeVars(settings: ThemeLabSettings): Record<string, string> {
  const preset = getThemePreset(settings.preset);
  const baseColor = BASE_COLORS[settings.baseColor];

  return {
    "--ag-radius": RADIUS_VALUES[settings.radius],
    "--ag-font": FONT_STACKS[settings.font],
    "--ag-card": preset.light.card,
    "--ag-card-dark": preset.dark.card,
    "--ag-border": preset.light.border,
    "--ag-border-dark": preset.dark.border,
    "--ag-primary": baseColor.light.primary,
    "--ag-primary-fg": baseColor.light.primaryFg,
    "--ag-primary-dark": baseColor.dark.primary,
    "--ag-primary-fg-dark": baseColor.dark.primaryFg,
    "--ag-accent": preset.light.accent,
    "--ag-accent-fg": preset.light.accentFg,
    "--ag-accent-dark": preset.dark.accent,
    "--ag-accent-fg-dark": preset.dark.accentFg,
    "--ag-canvas-bg": preset.light.bg,
    "--ag-canvas-bg-dark": preset.dark.bg,
    "--ag-canvas-fg": preset.light.fg,
    "--ag-canvas-fg-dark": preset.dark.fg,
  };
}
