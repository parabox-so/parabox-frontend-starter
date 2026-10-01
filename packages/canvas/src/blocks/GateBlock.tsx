import React, { useState } from 'react';
import { Card, Badge, Button } from '@parabox/ui';
import { CanvasBlockProps, useCanvas } from '../CanvasContext';

export interface GateCriterion {
  name: string;
  passed: boolean;
}

export interface GateBlockData {
  gateName: string;
  criteria: GateCriterion[];
  status: 'passed' | 'failed' | 'pending';
}

export const GateBlock: React.FC<CanvasBlockProps<GateBlockData>> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const { updateBlock, deleteBlock } = useCanvas();
  const [evaluating, setEvaluating] = useState(false);

  const allPassed = block.data.criteria?.every((c) => c.passed);

  const toggleCriterion = (index: number) => {
    const nextCriteria = [...block.data.criteria];
    nextCriteria[index].passed = !nextCriteria[index].passed;
    const nowAllPassed = nextCriteria.every((c) => c.passed);
    updateBlock(block.id, {
      ...block.data,
      criteria: nextCriteria,
      status: nowAllPassed ? 'passed' : 'failed',
    });
  };

  const handleEvaluate = async () => {
    setEvaluating(true);
    await new Promise((r) => setTimeout(r, 1200));
    const nextCriteria = block.data.criteria.map((c) => ({
      ...c,
      passed: true,
    }));
    updateBlock(block.id, {
      ...block.data,
      criteria: nextCriteria,
      status: 'passed',
    });
    setEvaluating(false);
  };

  return (
    <Card
      className={`p-4 transition-all duration-200 border rounded-xl ${
        block.data.status === 'passed'
          ? 'border-emerald-800/60 bg-emerald-950/10'
          : isSelected
          ? 'border-indigo-500/80 ring-2 ring-indigo-500/20 bg-zinc-900 shadow-lg'
          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          {block.data.status === 'passed' ? (
            <Badge variant="success" dot>GATE PASSED</Badge>
          ) : block.data.status === 'failed' ? (
            <Badge variant="danger" dot>GATE BLOCKED</Badge>
          ) : (
            <Badge variant="warning" dot>GATE PENDING</Badge>
          )}
          <span className="font-semibold text-sm text-zinc-100 truncate">
            {block.data.gateName || block.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="primary"
            isLoading={evaluating}
            onClick={handleEvaluate}
          >
            Re-evaluate Gate
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

      <div className="mt-3 space-y-2">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
          Quality Criteria Checkpoints
        </div>

        <div className="space-y-1.5">
          {block.data.criteria?.map((item, idx) => (
            <div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                toggleCriterion(idx);
              }}
              className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                item.passed
                  ? 'border-emerald-900/40 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/30'
                  : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:bg-zinc-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-sm border text-[10px] ${
                    item.passed
                      ? 'border-emerald-500 bg-emerald-600 text-white'
                      : 'border-zinc-700 bg-zinc-900'
                  }`}
                >
                  {item.passed ? '✓' : ''}
                </span>
                {item.name}
              </span>
              <span className="text-[10px] uppercase font-mono">
                {item.passed ? 'Satisfied' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
