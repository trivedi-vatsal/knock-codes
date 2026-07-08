"use client";

import { useState } from "react";
import { File, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeViewer } from "@/components/code-viewer";

export interface CodeBrowserFile {
  path: string;
  content: string;
  /** The block/template's own file(s) — pre-selected, sorts to the top of its folder. */
  primary?: boolean;
}

interface TreeNode {
  name: string;
  path: string;
  children: Map<string, TreeNode>;
  file?: CodeBrowserFile;
}

function buildTree(files: CodeBrowserFile[]): TreeNode {
  const root: TreeNode = { name: "", path: "", children: new Map() };
  for (const file of files) {
    const segments = file.path.split("/");
    let node = root;
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      if (!node.children.has(segment)) {
        node.children.set(segment, { name: segment, path: currentPath, children: new Map() });
      }
      node = node.children.get(segment) as TreeNode;
      if (index === segments.length - 1) node.file = file;
    });
  }
  return root;
}

function TreeView({
  node,
  selectedPath,
  onSelect,
  depth = 0,
}: {
  node: TreeNode;
  selectedPath: string;
  onSelect: (path: string) => void;
  depth?: number;
}) {
  const entries = Array.from(node.children.values()).sort((a, b) => {
    const aIsFolder = a.children.size > 0;
    const bIsFolder = b.children.size > 0;
    if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <ul className={depth > 0 ? "ml-3.5 border-l border-border pl-1.5" : ""}>
      {entries.map((entry) => {
        const isFolder = entry.children.size > 0;
        if (isFolder) {
          return (
            <li key={entry.path} className="mt-0.5 min-w-0">
              <div className="flex min-w-0 items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground" title={entry.name}>
                <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{entry.name}</span>
              </div>
              <TreeView node={entry} selectedPath={selectedPath} onSelect={onSelect} depth={depth + 1} />
            </li>
          );
        }
        return (
          <li key={entry.path} className="min-w-0">
            <button
              type="button"
              onClick={() => onSelect(entry.path)}
              title={entry.name}
              className={cn(
                "flex w-full min-w-0 items-center gap-1.5 rounded px-2 py-1 text-left text-xs",
                selectedPath === entry.path
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <File className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{entry.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Browse every file a block/template actually installs — not just its own, the full resolved dependency tree — with real content per file, not just a path list. */
export function CodeBrowser({ files }: { files: CodeBrowserFile[] }) {
  const initial = files.find((f) => f.primary) ?? files[0];
  const [selectedPath, setSelectedPath] = useState(initial?.path ?? "");
  const selectedFile = files.find((f) => f.path === selectedPath) ?? initial;

  if (files.length <= 1) {
    return selectedFile ? <CodeViewer code={selectedFile.content} filename={selectedFile.path} showCopy={false} /> : null;
  }

  const tree = buildTree(files);

  return (
    <div className="grid h-[32rem] grid-cols-[13rem_1fr] overflow-hidden rounded-lg border border-border">
      <div className="h-full overflow-x-hidden overflow-y-auto border-r border-border bg-muted/30 p-2">
        <TreeView node={tree} selectedPath={selectedPath} onSelect={setSelectedPath} />
      </div>
      <div className="flex h-full flex-col overflow-hidden">
        {selectedFile && (
          <>
            <div className="label-mono shrink-0 border-b border-border bg-muted/50 px-3 py-1.5 text-muted-foreground">
              {selectedFile.path}
            </div>
            <pre className="flex-1 overflow-auto bg-[#0b1220] p-4 text-xs leading-relaxed text-[#e5eaf3]">
              <code>{selectedFile.content}</code>
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
