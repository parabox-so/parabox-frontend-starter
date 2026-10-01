import React from 'react';
import { Card, Badge, Button } from '@parabox/ui';
import { CanvasBlockProps, useCanvas } from '../CanvasContext';

export interface JourneyStep {
  id: string;
  title: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  duration?: string;
  notes?: string;
}

export interface JourneyBlockData {
  steps: JourneyStep[];
}

export const JourneyBlock: React.FC<CanvasBlockProps<JourneyBlockData>> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const { deleteBlock } = useCanvas();

  const getStepIndicator = (status: JourneyStep['status']) => {
    switch (status) {
      case 'completed':
        return <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">✓</div>;
      case 'running':
        return <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs animate-pulse">●</div>;
      case 'failed':
        return <div className="h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">✕</div>;
      default:
        return <div className="h-6 w-6 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center justify-center text-xs">○</div>;
    }
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
          <Badge variant="primary">JOURNEY TIMELINE</Badge>
          <span className="font-semibold text-sm text-zinc-100 truncate">{block.title}</span>
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

      <div className="mt-4 space-y-4">
        <div className="relative pl-3">
          {/* Vertical line connecting steps */}
          <div className="absolute top-3 bottom-3 left-6 w-0.5 bg-zinc-800 -translate-x-1/2" />

          <div className="space-y-4 relative">
            {block.data.steps?.map((step, idx) => (
              <div key={step.id || idx} className="flex items-start gap-4">
                <div className="relative z-10">{getStepIndicator(step.status)}</div>
                <div className="flex-1 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-xs text-zinc-200">{step.title}</h5>
                    {step.duration && (
                      <span className="text-[10px] font-mono text-zinc-500">{step.duration}</span>
                    )}
                  </div>
                  {step.notes && (
                    <p className="mt-1 text-[11px] text-zinc-400">{step.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
