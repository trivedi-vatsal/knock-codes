"use client";

import { BlockPreview } from "@/components/block-preview";

const NATURAL_WIDTH = 640;
const NATURAL_HEIGHT = 420;
const PREVIEW_HEIGHT = 240;
const SCALE = PREVIEW_HEIGHT / NATURAL_HEIGHT;

export function BlockCardPreview({ slug }: { slug: string }) {
  return (
    <div
      aria-hidden="true"
      inert
      className="pointer-events-none relative w-full select-none overflow-hidden"
      style={{ height: PREVIEW_HEIGHT }}
    >
      <div
        className="absolute top-0 left-1/2"
        style={{
          width: NATURAL_WIDTH,
          height: NATURAL_HEIGHT,
          transform: `translateX(-50%) scale(${SCALE})`,
          transformOrigin: "top center",
        }}
      >
        <BlockPreview slug={slug} />
      </div>
    </div>
  );
}
