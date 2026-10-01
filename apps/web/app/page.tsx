'use client';

import React from 'react';
import { Card, Button, Badge, RunStatusChip, ConnectionStatus } from '@parabox/ui';
import { useParaboxAuth, RequireEntitlement } from '@parabox/auth';

export default function DashboardOverviewPage() {
  const { currentTenant } = useParaboxAuth();

  const metrics = [
    { title: 'Active Agent Workflows', value: '28', change: '+14%', status: 'optimal' },
    { title: 'Verified Policy Clauses', value: '142', change: '+8%', status: 'optimal' },
    { title: 'Telemetry Events / Min', value: '4.8k', change: '+32%', status: 'optimal' },
    { title: 'Quality Gates Passed', value: '99.4%', change: '0.2%', status: 'optimal' },
  ];

  const recentRuns = [
    { id: 'run-9120', agent: 'SOC2-Compliance-Audit', status: 'running' as const, time: '2 mins ago', duration: '45s' },
    { id: 'run-9119', agent: 'AWS-IAM-Policy-Synthesizer', status: 'completed' as const, time: '12 mins ago', duration: '1m 20s' },
    { id: 'run-9118', agent: 'HIPAA-Evidence-Validator', status: 'completed' as const, time: '1 hour ago', duration: '2m 04s' },
    { id: 'run-9117', agent: 'Kubernetes-Ingress-Linter', status: 'failed' as const, time: '3 hours ago', duration: '14s' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-zinc-900 to-zinc-900 border border-indigo-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome back to {currentTenant?.name || 'Parabox'}
            </h1>
            <Badge variant="primary">{currentTenant?.plan.toUpperCase()}</Badge>
          </div>
          <p className="text-sm text-zinc-400">
            Build, audit, and stream high-assurance AI agents and contract policies in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus state="connected" />
          <a href="/canvas">
            <Button variant="primary">Launch Canvas Studio</Button>
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <Card key={idx} className="p-4 space-y-2 border-zinc-800/80 bg-zinc-900/60">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-medium">{m.title}</span>
              <span className="text-emerald-400 font-semibold">{m.change}</span>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">{m.value}</div>
            <p className="text-[11px] text-zinc-500">Updated in real-time</p>
          </Card>
        ))}
      </div>

      {/* Main Grid: Recent Runs & Quick Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Runs Table */}
        <Card className="lg:col-span-2 p-5 border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Live Agent Execution Telemetry</h3>
              <p className="text-xs text-zinc-400">Recent policy evaluations across active clusters.</p>
            </div>
            <a href="/agents">
              <Button size="xs" variant="outline">
                View Terminal Stream
              </Button>
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="pb-2">Run ID</th>
                  <th className="pb-2">Agent Target</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Triggered</th>
                  <th className="pb-2 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {recentRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 font-mono text-indigo-400">{run.id}</td>
                    <td className="py-3 font-medium text-zinc-100">{run.agent}</td>
                    <td className="py-3">
                      <RunStatusChip status={run.status} size="sm" />
                    </td>
                    <td className="py-3 text-zinc-500">{run.time}</td>
                    <td className="py-3 text-right font-mono text-zinc-400">{run.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Launch & Monorepo Modules */}
        <div className="space-y-4">
          <Card className="p-5 border-zinc-800 space-y-4">
            <h3 className="text-base font-semibold text-zinc-100">Starter Modules</h3>
            <div className="space-y-2.5">
              <a
                href="/canvas"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/70 border border-zinc-800 transition-colors group"
              >
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-indigo-400">
                    Block Canvas Editor
                  </h4>
                  <p className="text-[11px] text-zinc-500">Clauses, diffs, findings & gates</p>
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-300">→</span>
              </a>

              <a
                href="/agents"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/70 border border-zinc-800 transition-colors group"
              >
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-indigo-400">
                    Virtual Log Streaming
                  </h4>
                  <p className="text-[11px] text-zinc-500">SSE telemetry & ANSI terminal</p>
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-300">→</span>
              </a>

              <a
                href="/billing"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/70 border border-zinc-800 transition-colors group"
              >
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-indigo-400">
                    Entitlements & RBAC
                  </h4>
                  <p className="text-[11px] text-zinc-500">Stripe tiers, plans & permissions</p>
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-300">→</span>
              </a>
            </div>
          </Card>

          <RequireEntitlement feature="audit_export">
            <Card className="p-4 border-indigo-900/30 bg-indigo-950/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-300">Enterprise Audit Log</span>
                <Badge variant="primary" size="sm">Active</Badge>
              </div>
              <p className="text-[11px] text-zinc-400">
                Tamper-evident audit trail exporting is active for this workspace.
              </p>
            </Card>
          </RequireEntitlement>
        </div>
      </div>
    </div>
  );
}
