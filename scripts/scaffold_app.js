#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Extract app name from args e.g. NAME=my-app or node scaffold_app.js my-app
let appName = null;
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('NAME=')) {
    appName = arg.split('=')[1];
  } else if (arg.startsWith('--name=')) {
    appName = arg.split('=')[1];
  } else if (!arg.startsWith('-')) {
    appName = arg;
  }
}

if (!appName) {
  console.error('❌ Error: Please provide an app name. Example: pnpm new-app NAME=analytics');
  process.exit(1);
}

// Normalize name (kebab-case)
const normalizedName = appName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
const targetDir = path.resolve(__dirname, '..', 'apps', normalizedName);

if (fs.existsSync(targetDir)) {
  console.error(`❌ Error: App directory apps/${normalizedName} already exists.`);
  process.exit(1);
}

console.log(`🚀 Scaffolding new Parabox Next.js app: @parabox/${normalizedName} in apps/${normalizedName}...`);

fs.mkdirSync(path.join(targetDir, 'app'), { recursive: true });

// 1. package.json
const packageJson = {
  name: `@parabox/${normalizedName}`,
  version: '0.1.0',
  private: true,
  scripts: {
    dev: 'next dev --port 3001',
    build: 'next build',
    start: 'next start',
    lint: 'next lint',
    typecheck: 'tsc --noEmit'
  },
  dependencies: {
    '@parabox/api-client': 'workspace:*',
    '@parabox/auth': 'workspace:*',
    '@parabox/canvas': 'workspace:*',
    '@parabox/realtime': 'workspace:*',
    '@parabox/ui': 'workspace:*',
    'clsx': '^2.1.1',
    'lucide-react': '^1.16.0',
    'next': '15.2.4',
    'react': '^19.0.0',
    'react-dom': '^19.0.0',
    'tailwind-merge': '^3.0.2'
  },
  devDependencies: {
    '@types/node': '^22.13.9',
    '@types/react': '^19.0.10',
    '@types/react-dom': '^19.0.4',
    'autoprefixer': '^10.4.20',
    'postcss': '^8.5.3',
    'tailwindcss': '^3.4.17',
    'typescript': '^5.7.3'
  }
};
fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2));

// 2. tsconfig.json
const tsconfig = {
  compilerOptions: {
    target: 'ES2022',
    lib: ['dom', 'dom.iterable', 'esnext'],
    allowJs: true,
    skipLibCheck: true,
    strict: true,
    noEmit: true,
    esModuleInterop: true,
    module: 'esnext',
    moduleResolution: 'bundler',
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: 'preserve',
    incremental: true,
    plugins: [{ name: 'next' }],
    paths: {
      '@/*': ['./app/*']
    }
  },
  include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
  exclude: ['node_modules']
};
fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

// 3. next.config.ts
const nextConfig = `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@parabox/ui',
    '@parabox/canvas',
    '@parabox/realtime',
    '@parabox/auth',
    '@parabox/api-client',
  ],
};

export default nextConfig;
`;
fs.writeFileSync(path.join(targetDir, 'next.config.ts'), nextConfig);

// 4. tailwind.config.ts
const tailwindConfig = `import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/canvas/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/realtime/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/auth/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
};

export default config;
`;
fs.writeFileSync(path.join(targetDir, 'tailwind.config.ts'), tailwindConfig);

// 5. postcss.config.mjs
const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
fs.writeFileSync(path.join(targetDir, 'postcss.config.mjs'), postcssConfig);

// 6. app/globals.css
const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #09090b;
  --foreground: #f4f4f5;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
`;
fs.writeFileSync(path.join(targetDir, 'app', 'globals.css'), globalsCss);

// 7. app/layout.tsx
const layoutTsx = `import type { Metadata } from 'next';
import './globals.css';
import { ParaboxAuthProvider } from '@parabox/auth';
import { AppShell, PageModalHost } from '@parabox/ui';
import { WorkspaceSwitcher } from '@parabox/auth';

export const metadata: Metadata = {
  title: '${normalizedName} | Parabox',
  description: 'Scaffolded Parabox Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <ParaboxAuthProvider>
          <AppShell
            appName="${normalizedName.toUpperCase()}"
            workspaceSlot={<WorkspaceSwitcher />}
            navItems={[
              { label: 'Overview', href: '/', icon: 'Home' },
            ]}
          >
            {children}
          </AppShell>
          <PageModalHost />
        </ParaboxAuthProvider>
      </body>
    </html>
  );
}
`;
fs.writeFileSync(path.join(targetDir, 'app', 'layout.tsx'), layoutTsx);

// 8. app/page.tsx
const pageTsx = `'use client';

import React from 'react';
import { Card, Button, Badge } from '@parabox/ui';
import { RequireEntitlement } from '@parabox/auth';

export default function AppHomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">${normalizedName}</h1>
          <p className="text-sm text-zinc-400">Freshly scaffolded Parabox micro-frontend.</p>
        </div>
        <Button variant="primary">Launch Action</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-zinc-400">STATUS</span>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="text-2xl font-bold">Online</div>
          <p className="text-xs text-zinc-500">Connected to monorepo primitives</p>
        </Card>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(targetDir, 'app', 'page.tsx'), pageTsx);

console.log(`✅ App successfully created at apps/${normalizedName}`);
console.log(`👉 Run 'pnpm install' and 'pnpm --filter @parabox/${normalizedName} dev' to start.`);
