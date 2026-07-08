import type { Metadata } from "next";
import { SectionHeader } from "@/components/section-header";
import { BlocksGallery } from "@/components/blocks-gallery";
import { getAllBlocks, getBlockCategories } from "@/lib/blocks";

export const metadata: Metadata = {
  title: "Blocks — Access Gate",
  description: "Copy-paste access-control components for React.",
};

export default function BlocksPage() {
  const blocks = getAllBlocks();
  const categories = getBlockCategories();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <SectionHeader
        label="Blocks"
        title="Access-control components, ready to copy"
        description="Every block is a real, independently usable React component backed by the same tested verification core. Preview it live, copy the source, or install it with the shadcn CLI."
        className="mb-8"
      />
      <BlocksGallery blocks={blocks} categories={categories} />
    </div>
  );
}
