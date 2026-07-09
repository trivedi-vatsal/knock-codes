"use client";

import { BlueprintFrame } from "@/components/blueprint-frame";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HashGenerator } from "@/components/hash-generator";
import { CodeBrowser } from "@/components/code-browser";
import { THREAT_MODEL_COPY } from "@/lib/copy";

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
        <Tabs defaultValue="hash">
          <TabsList className="mb-6">
            <TabsTrigger value="hash">Hash Generator</TabsTrigger>
            <TabsTrigger value="server">Server Mode</TabsTrigger>
            <TabsTrigger value="threat">Threat Model</TabsTrigger>
          </TabsList>

          <TabsContent value="hash" className="space-y-4">
            <HashGenerator frameless />
          </TabsContent>

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
              Each template rate-limits attempts and returns a short-lived signed token on success.
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
