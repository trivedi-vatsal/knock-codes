import type { Metadata } from "next";
import { SectionHeader } from "@/components/section-header";
import { BlocksGallery } from "@/components/blocks-gallery";
import { getAllBlocks, getBlockCategories } from "@/lib/blocks";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Blocks — Knock Codes",
  "Composable access-control primitives for React, for building something custom."
);

export default function BlocksPage() {
  const blocks = getAllBlocks();
  const categories = getBlockCategories();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <SectionHeader
        label="Blocks"
        title="Building something custom?"
        description="A Template gets you shipped in one file. If you'd rather assemble your own layout, these are the same tested primitives the templates are built from — preview one live, copy the source, or install it with the shadcn CLI."
        className="mb-8"
      />
      <BlocksGallery blocks={blocks} categories={categories} />
    </div>
  );
}
