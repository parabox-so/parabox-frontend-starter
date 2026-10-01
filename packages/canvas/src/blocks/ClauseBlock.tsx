import React, { useState } from 'react';
import { Card, Badge, Button, Input } from '@parabox/ui';
import { CanvasBlockProps, useCanvas } from '../CanvasContext';

export interface ClauseBlockData {
  clauseNumber: string;
  text: string;
  status: 'pass' | 'warning' | 'fail';
  severity?: 'low' | 'medium' | 'high';
  notes?: string;
}

export const ClauseBlock: React.FC<CanvasBlockProps<ClauseBlockData>> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const { updateBlock, deleteBlock } = useCanvas();
  const [isEditing, setIsEditing] = useState(false);
  const [clauseNumber, setClauseNumber] = useState(block.data.clauseNumber || 'Sec 1.0');
  const [text, setText] = useState(block.data.text || '');
  const [status, setStatus] = useState<ClauseBlockData['status']>(block.data.status || 'pass');

  const handleSave = () => {
    updateBlock(block.id, {
      ...block.data,
      clauseNumber,
      text,
      status,
    });
    setIsEditing(false);
  };

  const getStatusBadge = (s: ClauseBlockData['status']) => {
    switch (s) {
      case 'pass':
        return <Badge variant="success" dot>COMPLIANT</Badge>;
      case 'warning':
        return <Badge variant="warning" dot>REVIEW NEEDED</Badge>;
      case 'fail':
        return <Badge variant="danger" dot>VIOLATION</Badge>;
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
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5 flex-1">
          <div className="h-6 px-2 rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 font-mono text-xs flex items-center">
            {isEditing ? (
              <Input
                value={clauseNumber}
                onChange={(e) => setClauseNumber(e.target.value)}
                className="h-5 w-24 text-xs font-mono p-1 bg-zinc-900"
              />
            ) : (
              clauseNumber
            )}
          </div>
          <span className="font-semibold text-sm text-zinc-100 truncate">{block.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-700 rounded-md text-xs text-zinc-200 px-2 py-1 focus:outline-none"
            >
              <option value="pass">Pass</option>
              <option value="warning">Warning</option>
              <option value="fail">Fail</option>
            </select>
          ) : (
            getStatusBadge(block.data.status)
          )}

          {isEditing ? (
            <Button size="xs" variant="primary" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button size="xs" variant="ghost" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}

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

      <div className="mt-3">
        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 font-serif leading-relaxed focus:outline-none focus:border-indigo-500 resize-y min-h-[70px]"
            placeholder="Enter clause text..."
          />
        ) : (
          <p className="text-xs text-zinc-300 font-serif leading-relaxed italic bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/60">
            "{block.data.text || 'No clause content provided.'}"
          </p>
        )}
      </div>
    </Card>
  );
};
