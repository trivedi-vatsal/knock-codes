// A registryDependencies entry that names another item in the *same*
// registry (e.g. "knock-codes-hook") resolves, via shadcn's CLI, against the
// default ui.shadcn.com registry rather than wherever the parent item was
// fetched from — so the bare name 404s for any consumer that isn't also
// using our namespaced registry. Rewriting same-registry deps to absolute
// URLs before build sidesteps that entirely: it works identically for
// direct-URL installs, the `@knock-codes/*` named registry, and any other
// consumption method, with no config required on the consumer's end.
//
// The root registry.json (used for the GitHub `owner/repo/item` shorthand)
// is left with bare names — that install path resolves cross-item deps
// differently and hasn't been shown to hit this failure mode.
export const PRODUCTION_REGISTRY_BASE_URL = "https://knock.codes";

// Operates on the raw source *text*, not a reparsed/reserialized object —
// `shadcn build`'s formatting (compact single-line file/dependency arrays)
// tracks the input file's own layout, so round-tripping through
// JSON.stringify would reformat every array onto multiple lines and defeat
// registry:check's byte-for-byte comparison. A narrow regex substitution
// keeps everything else in the file untouched.
export function resolveRegistryDependencies(sourceText, itemNames, baseUrl) {
  return sourceText.replace(/("registryDependencies":\s*\[)([^\]]*)(\])/g, (_match, prefix, list, suffix) => {
    const rewritten = list.replace(/"([^"]+)"/g, (token, name) =>
      itemNames.has(name) ? `"${baseUrl}/r/react/${name}.json"` : token
    );
    return `${prefix}${rewritten}${suffix}`;
  });
}
