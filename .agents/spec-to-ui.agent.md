# Spec-to-UI Agent Guide 🤖📑

This guide instructs AI agents on transforming backend OpenAPI specs, GraphQL schemas, or JSON contract specifications into responsive, enterprise-grade Next.js pages using `@parabox/*` primitives.

---

## Workflow Steps

### Step 1: Analyze the Specification
Extract:
- Entity Models & Field types (strings, numbers, timestamps, enums, nested relations).
- CRUD operations / Endpoints (GET list, GET by ID, POST create, PUT update, DELETE).
- Realtime / Telemetry events (SSE streams, WebSocket topics).
- Access control & Entitlement requirements.

### Step 2: Choose Component Architecture
1. **Layout**: Integrate within `AppShell` with breadcrumbs and title actions.
2. **Data Fetching**: Use `@parabox/api-client` with TanStack React Query.
3. **Realtime**: If the resource is long-running or streams logs, attach `useRealtimeInvalidate` or `SSEClient`.
4. **Form Controls**: Use `Input`, `Button`, `Dialog` from `@parabox/ui`.
5. **State Feedback**: Use `EmptyState`, `Skeleton`, `RunStatusChip`, and `ErrorBoundary`.

### Step 3: Template Generation
```tsx
'use client';

import React, { useState } from 'react';
import { Card, Button, Badge, EmptyState, Skeleton, RunStatusChip } from '@parabox/ui';
import { RequireEntitlement, RequireRole } from '@parabox/auth';
import { apiClient } from '@parabox/api-client';

export default function EntityManagementPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  if (loading) return <Skeleton className="h-64 w-full" />;

  if (items.length === 0) {
    return (
      <EmptyState
        title="No Resources Found"
        description="Get started by creating your first entity."
        actionLabel="Create Resource"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Entities</h1>
          <p className="text-sm text-zinc-400">Manage your deployed agentic workloads.</p>
        </div>
        <RequireRole role="admin">
          <Button variant="primary">New Entity</Button>
        </RequireRole>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-zinc-100">{item.name}</h3>
              <RunStatusChip status={item.status} />
            </div>
            <p className="text-xs text-zinc-400">{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
```
