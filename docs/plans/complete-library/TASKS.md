# Complete library — Tasks
- [x] Source-driven generation pipeline and static docs.
- [x] Flagship gate composition checkpoint.
- [x] All remaining blocks and live workbench demos.
- [x] Consistent theming and React 18/19 checks.
- [x] Registry installation and generated example validation.
- [x] CI and model-backed installation eval runner.
- [x] Browser verification and final checks.

## External execution
- [ ] Run the live model-backed eval against all 17 items — blocked on OPENAI_API_KEY and OPENAI_MODEL configuration. The runner, CI job and offline protocol test are implemented; no model performance result is claimed.

## Close-out
Production build, strict TypeScript, 34 generated examples, 11 test groups, formatting, generated-output verification, 88 static HTTP resources, all 17 real shadcn installs, and the offline eval-runner protocol test pass. React 18.3.1 compatibility and hydration pass in isolation; React 19 passes in the main workspace. Browser audit completed 170 cases with zero reported violations. Final mobile dark-mode Preview chrome and Teaser gate paste/reveal/focus were checked in the browser. No Playwright, public deployment, auth logic or runtime dependency beyond React/Tailwind was introduced.
