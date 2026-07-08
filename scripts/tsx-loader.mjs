// Minimal load hook so `node --test` can execute .tsx source directly.
//
// Node's native TypeScript type-stripping (used unflagged by every .ts file
// in this repo) erases type annotations only; it cannot transform JSX,
// which is real syntax that needs codegen, not erasure. This hook
// intercepts .tsx specifiers only and
// transpiles them with the `typescript` package (already a devDependency for
// `tsc --noEmit`, not a new one); every other extension (.ts, .mts, ...)
// falls through to Node's existing native handling, unchanged.
import ts from "typescript";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export async function load(url, context, nextLoad) {
  if (!url.endsWith(".tsx")) return nextLoad(url, context);

  const source = await readFile(fileURLToPath(url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    fileName: fileURLToPath(url),
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: false,
    },
  });

  return { format: "module", source: outputText, shortCircuit: true };
}
