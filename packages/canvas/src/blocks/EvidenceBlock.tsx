import React, { useState } from 'react';
import { Card, Badge, Button } from '@parabox/ui';
import { CanvasBlockProps, useCanvas } from '../CanvasContext';

export interface EvidenceBlockData {
  artifactType: 'json' | 'image' | 'diff' | 'raw';
  summary: string;
  content: string;
  downloadUrl?: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
}

export const EvidenceBlock: React.FC<CanvasBlockProps<EvidenceBlockData>> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const { deleteBlock } = useCanvas();
  const [activeView, setActiveView] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(block.data.content || '');
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
          <Badge variant="info">EVIDENCE ARTIFACT</Badge>
          <span className="font-semibold text-sm text-zinc-100 truncate">{block.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-zinc-950 p-0.5 border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveView('preview')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                activeView === 'preview'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveView('raw')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                activeView === 'raw'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Raw
            </button>
          </div>

          <Button size="xs" variant="outline" onClick={copyToClipboard}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>

          {block.data.downloadUrl && (
            <a
              href={block.data.downloadUrl}
              download="artifact.json"
              className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-colors border border-zinc-700/60 flex items-center gap-1"
            >
              ⬇ Download
            </a>
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

      <div className="mt-3 space-y-2">
        {block.data.summary && (
          <p className="text-xs text-zinc-400 font-medium">{block.data.summary}</p>
        )}

        {block.data.imageUrl ? (
          <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
            <img
              src={block.data.imageUrl}
              alt={block.title}
              className="w-full h-48 object-cover"
            />
          </div>
        ) : (
          <pre className="text-xs font-mono bg-zinc-950 text-emerald-400 p-3 rounded-lg border border-zinc-800/80 overflow-x-auto max-h-56 leading-relaxed">
            {block.data.content}
          </pre>
        )}
      </div>
    </Card>
  );
};
