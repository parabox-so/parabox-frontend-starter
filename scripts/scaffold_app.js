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
      '@/*': ['./*']
    }
  },
  include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
  exclude: ['node_modules']
};
fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

// 3. components.json (Standard shadcn configuration)
const componentsJson = {
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
};
fs.writeFileSync(path.join(targetDir, 'components.json'), JSON.stringify(componentsJson, null, 2));

// 4. next.config.ts
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

// 5. tailwind.config.ts (Standard shadcn tailwind mapping)
const tailwindConfig = `import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};

export default config;
`;
fs.writeFileSync(path.join(targetDir, 'tailwind.config.ts'), tailwindConfig);

// 6. postcss.config.mjs
const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
fs.writeFileSync(path.join(targetDir, 'postcss.config.mjs'), postcssConfig);

// 7. app/globals.css (Standard shadcn CSS variables)
const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;
fs.writeFileSync(path.join(targetDir, 'app', 'globals.css'), globalsCss);

// 8. app/layout.tsx
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
      <body className="min-h-screen">
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

// 9. app/page.tsx
const pageTsx = `'use client';

import React from 'react';
import { Card, Button, Badge } from '@parabox/ui';

export default function AppHomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">${normalizedName}</h1>
          <p className="text-sm text-muted-foreground">Freshly scaffolded Parabox micro-frontend.</p>
        </div>
        <Button variant="primary">Launch Action</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground">STATUS</span>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="text-2xl font-bold">Online</div>
          <p className="text-xs text-muted-foreground">Connected to monorepo primitives & standard shadcn theme</p>
        </Card>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(targetDir, 'app', 'page.tsx'), pageTsx);

console.log(`✅ App successfully created at apps/${normalizedName}`);
console.log(`👉 Run 'pnpm install' and 'pnpm --filter @parabox/${normalizedName} dev' to start.`);
