"use client";

import { X, RotateCcw } from "lucide-react";
import { useThemeLab } from "./theme-lab-context";
import { SegmentedControl, SwatchRow, FieldLabel } from "./selectors";
import { CopyButton } from "@/components/copy-button";
import {
  BASE_COLORS,
  DENSITY_LABELS,
  PREVIEW_STATE_LABELS,
  SURFACE_STYLE_LABELS,
  THEME_MODE_LABELS,
  THEME_PRESETS,
  resolveThemeVars,
  type BaseColorId,
  type DensityId,
  type FontId,
  type PreviewStateId,
  type RadiusId,
  type SurfaceStyleId,
  type ThemeMode,
} from "@/lib/theme-presets";
import { cn } from "@/lib/utils";

const FONT_OPTIONS: { value: FontId; label: string }[] = [
  { value: "geist-sans", label: "Geist Sans" },
  { value: "inter", label: "Inter" },
  { value: "mono-forward", label: "Mono-forward" },
  { value: "system", label: "System" },
];

const RADIUS_OPTIONS: { value: RadiusId; label: string }[] = [
  { value: "sharp", label: "Sharp" },
  { value: "default", label: "Default" },
  { value: "soft", label: "Soft" },
];

const DENSITY_OPTIONS: { value: DensityId; label: string }[] = Object.entries(DENSITY_LABELS).map(([value, label]) => ({
  value: value as DensityId,
  label,
}));

const MODE_OPTIONS: { value: ThemeMode; label: string }[] = Object.entries(THEME_MODE_LABELS).map(([value, label]) => ({
  value: value as ThemeMode,
  label,
}));

const SURFACE_OPTIONS: { value: SurfaceStyleId; label: string }[] = Object.entries(SURFACE_STYLE_LABELS).map(([value, label]) => ({
  value: value as SurfaceStyleId,
  label,
}));

const PREVIEW_STATE_OPTIONS: { value: PreviewStateId; label: string }[] = Object.entries(PREVIEW_STATE_LABELS).map(([value, label]) => ({
  value: value as PreviewStateId,
  label,
}));

const BASE_COLOR_OPTIONS: { value: BaseColorId; label: string; swatch: string }[] = Object.entries(BASE_COLORS).map(
  ([value, def]) => ({ value: value as BaseColorId, label: def.label, swatch: def.light.primary })
);

function buildCssSnippet(settings: ReturnType<typeof useThemeLab>["settings"]): string {
  const vars = resolveThemeVars(settings);
  const lines = Object.entries(vars)
    .filter(([key]) => !key.includes("canvas"))
    .map(([key, value]) => `  ${key}: ${value};`);
  return `/* Access Theme Lab — ${settings.preset} preset */\n.your-gate-wrapper {\n${lines.join("\n")}\n}`;
}

export function ThemeCustomizer() {
  const themeLab = useThemeLab();
  const { settings, update, selectPreset, reset, open, setOpen } = themeLab;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        role="dialog"
        aria-label="Access Theme Lab"
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-background shadow-2xl transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <span aria-hidden="true" className="status-dot" data-tone="signal" />
              Access Theme Lab
            </p>
            <p className="text-xs text-muted-foreground">Live preview styling — not the site theme.</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close Access Theme Lab"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <SegmentedControl label="Mode" value={settings.mode} options={MODE_OPTIONS} onChange={(v) => update("mode", v)} />

          <div>
            <FieldLabel>Theme preset</FieldLabel>
            <div className="grid grid-cols-1 gap-2">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  role="radio"
                  aria-checked={settings.preset === preset.id}
                  onClick={() => selectPreset(preset.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-md border px-3 py-2 text-left transition-colors",
                    settings.preset === preset.id ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
                  )}
                >
                  <span className="mt-1 flex shrink-0 -space-x-1">
                    <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: preset.light.primary }} />
                    <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: preset.light.accent }} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{preset.label}</span>
                    <span className="block text-xs text-muted-foreground">{preset.tagline}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <SwatchRow label="Base color" value={settings.baseColor} options={BASE_COLOR_OPTIONS} onChange={(v) => update("baseColor", v)} />
          <SegmentedControl label="Surface style" value={settings.surfaceStyle} options={SURFACE_OPTIONS} onChange={(v) => update("surfaceStyle", v)} />
          <SegmentedControl label="Radius" value={settings.radius} options={RADIUS_OPTIONS} onChange={(v) => update("radius", v)} />
          <SegmentedControl label="Font" value={settings.font} options={FONT_OPTIONS} onChange={(v) => update("font", v)} />
          <SegmentedControl label="Density" value={settings.density} options={DENSITY_OPTIONS} onChange={(v) => update("density", v)} />
          <SegmentedControl label="Preview state" value={settings.previewState} options={PREVIEW_STATE_OPTIONS} onChange={(v) => update("previewState", v)} />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <FieldLabel>Generated CSS</FieldLabel>
              <CopyButton text={buildCssSnippet(settings)} />
            </div>
            <pre className="access-scanlines overflow-x-auto rounded-md bg-[#0e1311] p-3 text-[11px] leading-relaxed text-[#edeae0]">
              <code>{buildCssSnippet(settings)}</code>
            </pre>
          </div>

          <p className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
            This drawer only restyles the live demo on this page — it never touches the rest of the site. Copy the
            CSS above into your own project if you want a shipped block to keep this look; the block&rsquo;s markup
            and behavior stay exactly the same either way.
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <span className="label-mono text-muted-foreground">Saved locally</span>
        </div>
      </aside>
    </>
  );
}
