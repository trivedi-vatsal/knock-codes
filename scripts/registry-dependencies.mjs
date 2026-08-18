// A registryDependencies entry that names another item in the *same*
// registry (e.g. "knock-codes-hook") resolves, via shadcn's CLI, against the
// default ui.shadcn.com registry rather than wherever the parent item was
// fetched from — so the bare name 404s. Rewriting same-registry deps to
// fully-qualified addresses sidesteps that:
//
//   * the served registry (apps/web/public/r/react) uses absolute
//     https://knock.codes/r/react/<name>.json URLs — works for direct-URL
//     installs and the @knock-codes namespaced registry, no consumer config
//   * the root registry.json (GitHub owner/repo/item shorthand) uses
//     trivedi-vatsal/knock-codes/<name> addresses so the whole chain stays
//     on GitHub and doesn't need knock.codes to be reachable
export const PRODUCTION_REGISTRY_BASE_URL = "https://knock.codes";
export const GITHUB_REGISTRY_SOURCE = "trivedi-vatsal/knock-codes";

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

// Root registry.json is JSON.stringified with indent 2 anyway (unlike the
// served registry, whose layout has to survive `shadcn build` round-trip),
// so rewrite deps on the parsed object. Bare names become GitHub
// owner/repo/item addresses; `name` is overridden to match the GitHub repo.
export function buildRootRegistry(sourceRegistry, itemNames) {
  return {
    ...sourceRegistry,
    name: "knock-codes",
    items: sourceRegistry.items.map((item) => {
      if (!item.registryDependencies) return item;
      return {
        ...item,
        registryDependencies: item.registryDependencies.map((dep) =>
          itemNames.has(dep) ? `${GITHUB_REGISTRY_SOURCE}/${dep}` : dep
        ),
      };
    }),
  };
}
