import { LiveGate } from "@/components/live-gate";
import { HomeCtaButton } from "@/components/home-cta-button";

export default function Home() {
  return (
    <div>
      <header className="relative px-8 pt-[108px] pb-24 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-120px] left-1/2 h-[560px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.07)_0%,rgba(250,250,250,0.02)_40%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-[1120px]">
          <div className="mb-7">
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">
              // Copy-paste access screens for private previews
            </span>
          </div>
          <h1 className="text-[clamp(56px,9.5vw,132px)] font-medium leading-[0.98] tracking-[-0.035em]">
            Knock,
            <br />
            <span className="text-primary">knock.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-[480px] text-[17px] text-muted-foreground">
            A single-file &ldquo;enter a code to continue&rdquo; screen with verification built in. Copy it into
            your project, set one env var, ship.
          </p>

          <LiveGate />

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <HomeCtaButton href="#templates">Browse templates</HomeCtaButton>
            <HomeCtaButton href="/security" variant="ghost">
              Read the security model
            </HomeCtaButton>
          </div>
        </div>
      </header>
    </div>
  );
}
