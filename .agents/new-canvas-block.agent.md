# New Canvas Block Agent Guide 🧩🎨

This guide instructs AI agents on authoring new canvas blocks in `@parabox/canvas`.

---

## Block Architecture Standards

Every canvas block in `@parabox/canvas` must follow these 5 core requirements:

1. **Payload Interface**: Define a strongly-typed data interface `YourBlockData`.
2. **Block Component**: Implement `React.FC<CanvasBlockProps<YourBlockData>>`.
3. **Editable Fields**: Provide live editing capabilities with debounce or onBlur commits to `updateBlock(block.id, ...)`.
4. **Visual Hierarchy**: Use `@parabox/ui` cards, badges, and icon buttons.
5. **Registration**: Register the block type in `packages/canvas/src/SlashMenu.tsx` and `packages/canvas/src/CanvasRenderer.tsx`.

---

## Step-by-Step Block Template

```tsx
import React, { useState } from 'react';
import { Card, Badge, Button, Input } from '@parabox/ui';
import { CanvasBlockProps, useCanvas } from '../CanvasContext';

export interface CustomMetricBlockData {
  title: string;
  metric: string;
  trend: 'up' | 'down' | 'neutral';
  notes: string;
}

export const CustomMetricBlock: React.FC<CanvasBlockProps<CustomMetricBlockData>> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const { updateBlock, deleteBlock } = useCanvas();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(block.data.title);

  const handleSave = () => {
    updateBlock(block.id, { ...block.data, title });
    setIsEditing(false);
  };

  return (
    <Card
      className={`p-4 transition-all duration-200 border ${
        isSelected ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/20' : 'border-zinc-800'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Badge variant="info">Custom Metric</Badge>
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              autoFocus
              className="h-7 text-xs"
            />
          ) : (
            <h4
              className="font-medium text-sm text-zinc-100 cursor-pointer hover:underline"
              onClick={() => setIsEditing(true)}
            >
              {block.data.title}
            </h4>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Button size="xs" variant="ghost" onClick={() => deleteBlock(block.id)}>
            ✕
          </Button>
        </div>
      </div>

      <div className="mt-2 text-2xl font-bold text-zinc-100">{block.data.metric}</div>
      {block.data.notes && (
        <p className="mt-1 text-xs text-zinc-400">{block.data.notes}</p>
      )}
    </Card>
  );
};
```
