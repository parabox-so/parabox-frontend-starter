# Parabox Frontend Starter Monorepo 📦✨

Modern, modular frontend architecture for building agentic enterprise interfaces, block-based canvases, real-time telemetry, and multi-tenant applications.

---

## 🏗 Monorepo Architecture

```text
parabox-frontend-starter/
├── apps/
│   └── web/                   # Next.js 15 App Router reference implementation
├── packages/
│   ├── ui/                    # @parabox/ui - Design system, AppShell, ModalBus & primitives
│   ├── canvas/                # @parabox/canvas - Block-based collaborative canvas system
│   ├── realtime/              # @parabox/realtime - Resilient SSE, WS manager & VirtualLogStream
│   ├── auth/                  # @parabox/auth - Clerk/Mock auth, workspace switcher & RBAC guards
│   └── api-client/            # @parabox/api-client - Unified API client with automatic token injection
├── .agents/                   # Agent guides for automated UI & block generation
├── scripts/                   # CLI scaffolding utilities (new-app, new-block)
├── AGENT_RULES.md             # AI coding instructions & architectural guidelines
└── .cursorrules               # Cursor rules for zero-shot assistant accuracy
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the reference studio application.

---

## 🛠 Available Scripts

- `pnpm dev`: Start all apps and packages in development mode with hot reload.
- `pnpm build`: Build all packages and applications for production.
- `pnpm lint`: Run linting checks across the entire monorepo.
- `pnpm typecheck`: Typecheck all TypeScript codebases.
- `pnpm new-app NAME=<app_name>`: Scaffold a new Next.js application wired into monorepo packages.
- `pnpm new-block NAME=<block_name>`: Scaffold a new interactive canvas block in `@parabox/canvas`.

---

## 📦 Packages Overview

### `@parabox/ui`
- **AppShell**: Responsive sidebar, breadcrumbs, workspace context, and user menu.
- **ModalBus & PageModal**: Global decoupled modal triggers (`UPGRADE_REQUIRED`, `CREATE_WORKSPACE`, etc.).
- **Common Primitives**: `Button`, `Card`, `Badge`, `Input`, `Dialog`, `SegmentedTabs`, `UnderlineTabs`.
- **Feedback Components**: `EmptyState`, `ErrorBoundary`, `Skeleton`, `RunStatusChip`, `ConnectionStatus`.

### `@parabox/canvas`
- **CanvasContext**: Block state, active selection, density mode (`compact` | `normal` | `spacious`), and block CRUD.
- **CanvasRenderer**: High-performance drag-ready block list with execution controls.
- **SlashMenu**: Interactive `/` command palette with keyboard navigation.
- **Prebuilt Blocks**:
  - `ClauseBlock`: Editable contract & compliance clauses with live validation badges.
  - `EvidenceBlock`: Artifact inspector (JSON viewer, image preview, download links).
  - `DiffBlock`: Unified visual diff viewer with line add/remove indicators.
  - `FindingBlock`: Diagnostic finding reporting with severity badges and action triggers.
  - `GateBlock`: Pass/Fail quality gate execution checkpoints.
  - `JourneyBlock`: Step-by-step user journey and workflow visualizer.

### `@parabox/realtime`
- **SSEClient**: EventSource wrapper with exponential backoff and jittered reconnects.
- **WebSocketManager**: Multi-channel pub/sub with automatic heartbeat keep-alive.
- **VirtualLogStream**: High-throughput terminal log viewer with auto-scroll and ANSI color parsing.
- **useRealtimeInvalidate**: Bridge real-time events to TanStack React Query cache invalidations.
- **StaleDataDetector**: Liveness tracker warning users when data feeds go silent.

### `@parabox/auth`
- **ParaboxAuthProvider**: Seamless Clerk auth with built-in zero-config Mock fallback.
- **WorkspaceSwitcher**: Tenant switcher with active tenant indication.
- **RBAC & Billing Guards**: `<RequireEntitlement feature="...">` and `<RequireRole role="...">`.

### `@parabox/api-client`
- **ParaboxApiClient**: Unified client injecting `Bearer <token>` and `x-workspace-id` headers.
- **Interceptors**: Automatically traps HTTP `402 Payment Required` to trigger modal upgrades via `ModalBus`.

---

## 🤖 Agentic Coding with AI Assistants

This repository is optimized for autonomous AI coding agents:
- See `AGENT_RULES.md` for architectural rules and code generation standards.
- See `.agents/spec-to-ui.agent.md` for generating UI views directly from backend specs.
- See `.agents/new-canvas-block.agent.md` for crafting custom canvas blocks.
- `.cursorrules` provides immediate zero-shot instructions to Cursor/Copilot.

---

## 📄 License
MIT © Parabox.
