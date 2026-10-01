import React, { useState } from 'react';
import { Card, Badge, Button } from '@parabox/ui';
import { CanvasBlockProps, useCanvas } from '../CanvasContext';

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  line: string;
  lineNumberOld?: number;
  lineNumberNew?: number;
}

export interface DiffBlockData {
  filePath: string;
  chunks: DiffLine[];
}

export const DiffBlock: React.FC<CanvasBlockProps<DiffBlockData>> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const { deleteBlock } = useCanvas();
  const [copied, setCopied] = useState(false);

  const additions = block.data.chunks?.filter((c) => c.type === 'add').length || 0;
  const deletions = block.data.chunks?.filter((c) => c.type === 'remove').length || 0;

  const copyDiff = () => {
    const raw = block.data.chunks?.map((c) => c.line).join('\n') || '';
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card
      className={`p-4 transition-all duration-200 border rounded-xl ${
        isSelected
          ? 'border-indigo-500/80 ring-2 ring-indigo-500/20 bg-zinc-900 shadow-lg'
          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Badge variant="neutral">DIFF</Badge>
          <span className="font-mono text-xs text-zinc-300 font-semibold truncate">
            {block.data.filePath || 'unified.patch'}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono ml-2">
            <span className="text-emerald-400 font-bold">+{additions}</span>
            <span className="text-red-400 font-bold">-{deletions}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="xs" variant="outline" onClick={copyDiff}>
            {copied ? 'Copied' : 'Copy Diff'}
          </Button>

          <Button
            size="xs"
            variant="ghost"
            className="text-zinc-500 hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              deleteBlock(block.id);
            }}
          >
            ✕
          </Button>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-zinc-800/90 bg-zinc-950 font-mono text-xs">
        <div className="divide-y divide-zinc-900">
          {block.data.chunks?.map((chunk, idx) => {
            const isAdd = chunk.type === 'add';
            const isRemove = chunk.type === 'remove';

            return (
              <div
                key={idx}
                className={`flex items-stretch px-3 py-1 text-xs select-text ${
                  isAdd
                    ? 'bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500'
                    : isRemove
                    ? 'bg-red-950/30 text-red-300 border-l-2 border-red-500 line-through opacity-80'
                    : 'text-zinc-400 hover:bg-zinc-900/40'
                }`}
              >
                <span className="w-6 text-zinc-600 select-none text-[11px] font-mono">
                  {isAdd ? '+' : isRemove ? '-' : ' '}
                </span>
                <span className="flex-1 font-mono break-all">{chunk.line}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
