'use client';

import React, { useState } from 'react';
import { useCanvas, CanvasBlock } from './CanvasContext';
import { ClauseBlock } from './blocks/ClauseBlock';
import { EvidenceBlock } from './blocks/EvidenceBlock';
import { DiffBlock } from './blocks/DiffBlock';
import { FindingBlock } from './blocks/FindingBlock';
import { GateBlock } from './blocks/GateBlock';
import { JourneyBlock } from './blocks/JourneyBlock';
import { SlashMenu } from './SlashMenu';
import { Button, EmptyState } from '@parabox/ui';

export interface CanvasRendererProps {
  className?: string;
  readOnly?: boolean;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  className,
  readOnly = false,
}) => {
  const {
    blocks,
    selectedBlockId,
    selectBlock,
    addBlock,
    insertBlockAt,
    moveBlock,
    density,
  } = useCanvas();

  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [insertTargetIndex, setInsertTargetIndex] = useState<number | null>(null);

  const openSlashMenu = (index?: number) => {
    setInsertTargetIndex(index !== undefined ? index : null);
    setSlashMenuOpen(true);
  };

  const handleSelectBlockType = (type: string) => {
    if (insertTargetIndex !== null) {
      insertBlockAt(insertTargetIndex, type);
    } else {
      addBlock(type);
    }
    setInsertTargetIndex(null);
  };

  const renderBlockItem = (block: CanvasBlock) => {
    const isSelected = block.id === selectedBlockId;
    const props = {
      block,
      isSelected,
      onSelect: () => selectBlock(block.id),
      density,
    };

    switch (block.type) {
      case 'clause':
        return <ClauseBlock {...props} />;
      case 'evidence':
        return <EvidenceBlock {...props} />;
      case 'diff':
        return <DiffBlock {...props} />;
      case 'finding':
        return <FindingBlock {...props} />;
      case 'gate':
        return <GateBlock {...props} />;
      case 'journey':
        return <JourneyBlock {...props} />;
      default:
        return (
          <div
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 text-xs text-zinc-300"
            onClick={() => selectBlock(block.id)}
          >
            <div className="font-semibold text-zinc-100">{block.title}</div>
            <pre className="mt-2 text-[10px] text-zinc-500 overflow-x-auto">
              {JSON.stringify(block.data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  const densitySpacing = {
    compact: 'space-y-2',
    normal: 'space-y-4',
    spacious: 'space-y-6',
  };

  if (blocks.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          title="Empty Canvas"
          description="Start building your document or agent policy by adding interactive blocks."
          actionLabel="Add First Block"
          onAction={() => openSlashMenu()}
        />
        <SlashMenu
          isOpen={slashMenuOpen}
          onClose={() => setSlashMenuOpen(false)}
          onSelect={handleSelectBlockType}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`}>
      <div className={densitySpacing[density]}>
        {blocks.map((block, index) => (
          <div key={block.id} className="group relative">
            {/* Block Insert Divider between items */}
            {!readOnly && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-3 inset-x-0 flex items-center justify-center z-20">
                <button
                  onClick={() => openSlashMenu(index)}
                  className="h-5 px-2 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-semibold text-white rounded-full shadow flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                >
                  <span>+</span> Insert Block
                </button>
              </div>
            )}

            {/* Position Reordering Handles */}
            {!readOnly && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -left-7 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-10">
                <button
                  disabled={index === 0}
                  onClick={() => moveBlock(block.id, 'up')}
                  className="h-5 w-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-[10px]"
                  title="Move Up"
                >
                  ▲
                </button>
                <button
                  disabled={index === blocks.length - 1}
                  onClick={() => moveBlock(block.id, 'down')}
                  className="h-5 w-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-[10px]"
                  title="Move Down"
                >
                  ▼
                </button>
              </div>
            )}

            {renderBlockItem(block)}
          </div>
        ))}
      </div>

      {/* Bottom Append Bar */}
      {!readOnly && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openSlashMenu()}
            className="border-dashed border-zinc-700 hover:border-indigo-500 hover:text-indigo-400 gap-2"
          >
            <span>+</span> Add Block (/ for slash menu)
          </Button>
        </div>
      )}

      {/* Slash Command Palette */}
      <SlashMenu
        isOpen={slashMenuOpen}
        onClose={() => setSlashMenuOpen(false)}
        onSelect={handleSelectBlockType}
      />
    </div>
  );
};
