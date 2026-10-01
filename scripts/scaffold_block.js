#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

let blockName = null;
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('NAME=')) {
    blockName = arg.split('=')[1];
  } else if (arg.startsWith('--name=')) {
    blockName = arg.split('=')[1];
  } else if (!arg.startsWith('-')) {
    blockName = arg;
  }
}

if (!blockName) {
  console.error('❌ Error: Please provide a block name. Example: pnpm new-block NAME=PolicyReview');
  process.exit(1);
}

// Convert to PascalCase and clean up
const cleanName = blockName.replace(/[^a-zA-Z0-9]/g, '');
const pascalName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).replace(/Block$/, '');
const fileName = `${pascalName}Block.tsx`;
const targetFile = path.resolve(__dirname, '..', 'packages', 'canvas', 'src', 'blocks', fileName);

if (fs.existsSync(targetFile)) {
  console.error(`❌ Error: Block ${fileName} already exists at ${targetFile}`);
  process.exit(1);
}

const blockCode = `import React, { useState } from 'react';
import { Card, Badge, Button, Input } from '@parabox/ui';
import { CanvasBlockProps, useCanvas } from '../CanvasContext';

export interface ${pascalName}BlockData {
  title: string;
  description: string;
  status: 'draft' | 'pending' | 'verified' | 'failed';
  metadata?: Record<string, any>;
}

export const ${pascalName}Block: React.FC<CanvasBlockProps<${pascalName}BlockData>> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const { updateBlock, deleteBlock } = useCanvas();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(block.data.title || '${pascalName} Item');
  const [description, setDescription] = useState(block.data.description || '');

  const handleSave = () => {
    updateBlock(block.id, {
      ...block.data,
      title,
      description,
    });
    setIsEditing(false);
  };

  const getBadgeVariant = (status: ${pascalName}BlockData['status']) => {
    switch (status) {
      case 'verified': return 'success';
      case 'failed': return 'danger';
      case 'pending': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <Card
      className={\`p-4 transition-all duration-200 border rounded-xl shadow-sm \${
        isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-zinc-900/90' : 'border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700'
      }\`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-2 flex-1">
          <Badge variant={getBadgeVariant(block.data.status)}>
            {block.data.status.toUpperCase()}
          </Badge>
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-7 text-xs font-semibold"
              placeholder="Block Title"
              autoFocus
            />
          ) : (
            <h4
              className="font-semibold text-sm text-zinc-100 cursor-pointer hover:text-indigo-300 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {title}
            </h4>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <Button size="xs" variant="primary" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button size="xs" variant="ghost" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
          <Button size="xs" variant="ghost" className="text-zinc-500 hover:text-red-400" onClick={() => deleteBlock(block.id)}>
            ✕
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
            rows={2}
            placeholder="Add details..."
          />
        ) : (
          <p className="text-xs text-zinc-300 leading-relaxed">
            {description || 'Click edit to add content to this block.'}
          </p>
        )}
      </div>
    </Card>
  );
};
`;

fs.writeFileSync(targetFile, blockCode);
console.log(`✅ Canvas block created at: packages/canvas/src/blocks/${fileName}`);
console.log(`👉 Don't forget to export it in packages/canvas/src/index.ts and register it in SlashMenu.tsx / CanvasRenderer.tsx if desired.`);
