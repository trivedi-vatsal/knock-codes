"use client";

import { BlueprintFrame } from "@/components/blueprint-frame";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeBrowser } from "@/components/code-browser";
import { THREAT_MODEL_COPY } from "@/lib/copy";
import Link from "next/link";

interface ServerTemplateFile {
  filename: string;
  code: string;
}

interface TemplateSecuritySectionProps {
  isHtml?: boolean;
  serverTemplates?: ServerTemplateFile[];
}

export function TemplateSecuritySection({ isHtml = false, serverTemplates = [] }: TemplateSecuritySectionProps = {}) {
  return (
    <section className="mb-10">
      <BlueprintFrame label="Security & Verification">
        <p className="mb-6 text-sm text-muted-foreground">
          Need a hash? Use the{" "}
          <Link href="/getting-started#generator" className="font-medium text-primary hover:underline">
            hash generator
          </Link>{" "}
          on Getting Started — computed locally, never sent anywhere.
        </p>
        <Tabs defaultValue="threat">
          <TabsList className="mb-6">
            <TabsTrigger value="threat">Threat Model</TabsTrigger>
            <TabsTrigger value="server">Server Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="server" className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Need real protection?</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {isHtml ? (
                <>
                  Local mode is deterrence — the hash lives right in the script tag. Point the form&apos;s fetch call
                  at one of these endpoints instead of comparing hashes in the browser, and the code is checked
                  server-side — same markup, no local hash to read.
                </>
              ) : (
                <>
                  Local mode is deterrence — the hash ships in your client bundle by design. Swap the{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">expectedHash</code> prop for a{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">verify</code> function pointing at one of
                  these, and the code is checked server-side instead — same markup, same component, one prop
                  different.
                </>
              )}{" "}
              Each template rate-limits attempts and returns a short-lived signed token on success. Server mode hides
              the hash, not children you already bundled — wire{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">validateSession</code> if a forged session would
              matter.
            </p>
            <CodeBrowser files={serverTemplates.map((t) => ({ path: t.filename, content: t.code }))} />
          </TabsContent>

          <TabsContent value="threat" className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">The honest version</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{THREAT_MODEL_COPY}</p>
          </TabsContent>
        </Tabs>
      </BlueprintFrame>
    </section>
  );
}
