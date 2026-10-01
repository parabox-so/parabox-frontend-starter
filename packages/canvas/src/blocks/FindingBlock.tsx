import React, { useState } from 'react';
import { Card, Badge, Button } from '@parabox/ui';
import { CanvasBlockProps, useCanvas } from '../CanvasContext';

export type FindingSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface FindingBlockData {
  severity: FindingSeverity;
  description: string;
  location?: string;
  recommendation?: string;
  fixActionLabel?: string;
  fixed?: boolean;
}

export const FindingBlock: React.FC<CanvasBlockProps<FindingBlockData>> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const { updateBlock, deleteBlock } = useCanvas();
  const [applyingFix, setApplyingFix] = useState(false);

  const getSeverityBadge = (sev: FindingSeverity) => {
    switch (sev) {
      case 'Critical':
        return <Badge variant="danger" dot>CRITICAL</Badge>;
      case 'High':
        return <Badge variant="warning" dot>HIGH</Badge>;
      case 'Medium':
        return <Badge variant="warning">MEDIUM</Badge>;
      case 'Low':
        return <Badge variant="info">LOW</Badge>;
      default:
        return <Badge variant="neutral">INFO</Badge>;
    }
  };

  const handleApplyFix = async () => {
    setApplyingFix(true);
    await new Promise((r) => setTimeout(r, 1000));
    updateBlock(block.id, {
      ...block.data,
      fixed: true,
    });
    setApplyingFix(false);
  };

  return (
    <Card
      className={`p-4 transition-all duration-200 border rounded-xl ${
        block.data.fixed
          ? 'border-emerald-900/40 bg-emerald-950/10'
          : isSelected
          ? 'border-indigo-500/80 ring-2 ring-indigo-500/20 bg-zinc-900 shadow-lg'
          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          {getSeverityBadge(block.data.severity)}
          <span className="font-semibold text-sm text-zinc-100 truncate">{block.title}</span>
          {block.data.fixed && (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
              RESOLVED
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
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

      <div className="mt-3 space-y-3">
        <p className="text-xs text-zinc-300 leading-relaxed">{block.data.description}</p>

        {block.data.location && (
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-950/60 px-2.5 py-1.5 rounded-md border border-zinc-800">
            <span className="text-zinc-500">Resource:</span>
            <span className="text-indigo-400 font-semibold">{block.data.location}</span>
          </div>
        )}

        {block.data.recommendation && (
          <div className="text-xs text-zinc-400 bg-zinc-950/40 p-2.5 rounded-md border border-zinc-850">
            <span className="font-semibold text-zinc-300 block mb-1">Recommendation:</span>
            {block.data.recommendation}
          </div>
        )}

        {!block.data.fixed && block.data.fixActionLabel && (
          <div className="pt-2 flex justify-end">
            <Button
              size="xs"
              variant="primary"
              isLoading={applyingFix}
              onClick={handleApplyFix}
            >
              {block.data.fixActionLabel}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
