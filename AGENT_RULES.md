# Parabox AI Agent Rules & Primitives Guide 🤖📐

This document defines the strict architectural standards and patterns for AI assistants and developers creating frontend code within the Parabox monorepo.

---

## 1. Monorepo Principles & Package Boundaries

Always respect package boundaries:
1. **Never reinvent core UI**: Use `@parabox/ui` for layout, buttons, badges, feedback states, tabs, dialogs, and modal triggers.
2. **Block-based UI lives in `@parabox/canvas`**: If a component is editable, draggable, or part of a document canvas, implement it as a Canvas Block conforming to `BlockData` and `CanvasBlockProps`.
3. **Real-time telemetry uses `@parabox/realtime`**: Use `SSEClient`, `wsManager`, `VirtualLogStream`, or `useRealtimeInvalidate` for streaming data, SSE endpoints, and log terminals.
4. **Auth & Multitenancy in `@parabox/auth`**: Wrap sensitive UI or tenant actions with `<RequireEntitlement>` or `<RequireRole>`. Access tenant metadata via `useParaboxAuth` or `useCurrentTenant`.
5. **API Calls via `@parabox/api-client`**: Never use raw `fetch()` or `axios` directly in business components without going through `createApiClient()` or `apiClient`, which automatically inject workspace headers and intercept `402 Payment Required` errors.

---

## 2. Using `@parabox/ui`

### App Shell Structure
```tsx
import { AppShell } from '@parabox/ui';
import { WorkspaceSwitcher } from '@parabox/auth';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      appName="Parabox Studio"
      navItems={[
        { label: 'Overview', href: '/', icon: 'Home' },
        { label: 'Canvas', href: '/canvas', icon: 'SquareCode' },
        { label: 'Agent Streams', href: '/agents', icon: 'Terminal' },
        { label: 'Billing & Plans', href: '/billing', icon: 'CreditCard' },
      ]}
      workspaceSlot={<WorkspaceSwitcher />}
      userSlot={<UserMenuButton />}
    >
      {children}
    </AppShell>
  );
}
```

### Global Modal Bus
Trigger modals without prop drilling:
```tsx
import { modalBus } from '@parabox/ui';

// Open Upgrade Modal on feature limit
modalBus.emit('UPGRADE_REQUIRED', { feature: 'enterprise_canvas', requiredTier: 'Pro' });

// Open generic dialog
modalBus.emit('OPEN_MODAL', {
  id: 'confirm-delete',
  title: 'Delete Resource',
  content: <div>Are you sure?</div>,
});
```

### Feedback Primitives
- `<EmptyState title="..." description="..." actionLabel="..." onAction={...} />`
- `<ErrorBoundary fallback={...}>`
- `<Skeleton className="..." />`
- `<RunStatusChip status="running" | "completed" | "failed" | "queued" />`
- `<ConnectionStatus state="connected" | "connecting" | "disconnected" | "stale" />`

---

## 3. Canvas Block Architecture (`@parabox/canvas`)

Every canvas block must:
1. Accept `CanvasBlockProps<T>` where `T` is the typed payload.
2. Provide an edit mode and a read-only preview mode.
3. Emit mutations via `updateBlock(id, updatedPayload)`.
4. Include an execution or action handler if actionable.
5. Provide a registered type in `SlashMenu` for creation.

### Example Canvas Block Template
```tsx
import React from 'react';
import { Card, Badge, Button } from '@parabox/ui';
import { CanvasBlockProps, useCanvas } from '../CanvasContext';

export interface MetricBlockPayload {
  metricName: string;
  value: number | string;
  threshold?: number;
  status: 'optimal' | 'warning' | 'critical';
}

export const MetricBlock: React.FC<CanvasBlockProps<MetricBlockPayload>> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const { updateBlock, deleteBlock } = useCanvas();

  return (
    <Card className={`p-4 transition-all ${isSelected ? 'ring-2 ring-primary-500' : ''}`} onClick={onSelect}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">{block.data.metricName}</h4>
        <Badge variant={block.data.status === 'optimal' ? 'success' : 'warning'}>
          {block.data.status}
        </Badge>
      </div>
      <div className="text-2xl font-bold mt-2">{block.data.value}</div>
    </Card>
  );
};
```

---

## 4. Realtime Streaming & Log Terminal (`@parabox/realtime`)

### Virtual Log Stream
```tsx
import { VirtualLogStream } from '@parabox/realtime';

<VirtualLogStream
  logs={logs}
  maxLogs={5000}
  showSearch={true}
  autoScroll={true}
  height="450px"
/>
```

### Realtime Cache Invalidation with React Query
```tsx
import { useRealtimeInvalidate } from '@parabox/realtime';
import { useQueryClient } from '@tanstack/react-query';

export function useAgentRunsRealtime(agentId: string) {
  const queryClient = useQueryClient();
  useRealtimeInvalidate({
    channel: `agent:${agentId}`,
    events: ['run.created', 'run.updated', 'run.completed'],
    queryKeys: [['agent-runs', agentId], ['agent-detail', agentId]],
    queryClient,
  });
}
```

---

## 5. Auth, RBAC & Entitlements (`@parabox/auth`)

Protect UI features with declarative guards:
```tsx
import { RequireEntitlement, RequireRole } from '@parabox/auth';

// Guard feature by Stripe tier entitlement
<RequireEntitlement feature="custom_canvas_blocks" fallback={<UpgradeLockCard />}>
  <CustomBlockBuilder />
</RequireEntitlement>

// Guard administrative actions by role
<RequireRole role="admin" fallback={<p>Admin permissions required.</p>}>
  <DeleteWorkspaceButton />
</RequireRole>
```

---

## 6. TypeScript & Style Rules
- Always use TypeScript with strict mode enabled.
- Avoid `any`. Define clean interfaces for all component props, payloads, and API contracts.
- Use Tailwind CSS utility classes and the `cn(...)` utility helper.
- Maintain a cohesive dark/light mode palette with zinc/slate neutral tones and violet/indigo accents.
