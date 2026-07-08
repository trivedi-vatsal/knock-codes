import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://knock.codes"),
  title: "Knock Codes — Copy-paste access screens for private previews",
  description:
    "A single-file \"enter a code to continue\" screen with verification built in. Copy it into your project, set one env var, ship. No backend, no package, no lock-in.",
  openGraph: {
    title: "Knock Codes — Copy-paste access screens for private previews",
    description:
      "A single-file \"enter a code to continue\" screen with verification built in. Copy it into your project, set one env var, ship. No backend, no package, no lock-in.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Knock Codes — Copy-paste access screens for private previews",
    description:
      "A single-file \"enter a code to continue\" screen with verification built in. Copy it into your project, set one env var, ship. No backend, no package, no lock-in.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", geist.variable, geistMono.variable)}>
      <body>
        <ThemeProvider>
          <div className="flex min-h-svh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
