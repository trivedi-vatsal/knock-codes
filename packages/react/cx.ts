/** Tiny local classname joiner — avoids a `clsx` dependency for copy-owned portability. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
