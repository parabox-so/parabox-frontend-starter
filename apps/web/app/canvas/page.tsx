'use client';

import React, { useState } from 'react';
import { CanvasProvider, CanvasRenderer, useCanvas, DensityMode } from '@parabox/canvas';
import { Card, Button, Badge, SegmentedTabs } from '@parabox/ui';

const SAMPLE_INITIAL_BLOCKS = [
  {
    id: 'blk-clause-1',
    type: 'clause',
    title: 'Data Sovereignty & Encryption Clause',
    data: {
      clauseNumber: 'Sec 8.1',
      text: 'All customer data at rest shall be encrypted using AES-256-GCM. All inter-service gRPC communication must utilize mutual TLS 1.3 with cryptographic tenant isolation.',
      status: 'pass' as const,
      severity: 'low' as const,
    },
    createdAt: Date.now() - 60000,
    updatedAt: Date.now() - 60000,
  },
  {
    id: 'blk-diff-1',
    type: 'diff',
    title: 'Terraform Ingress Rule Patch',
    data: {
      filePath: 'infra/security_groups.tf',
      chunks: [
        { type: 'context' as const, line: 'resource "aws_security_group_rule" "allow_https" {' },
        { type: 'remove' as const, line: '-   cidr_blocks = ["0.0.0.0/0"]' },
        { type: 'remove' as const, line: '-   from_port   = 80' },
        { type: 'add' as const, line: '+   cidr_blocks = [var.corp_vpn_cidr]' },
        { type: 'add' as const, line: '+   from_port   = 443' },
        { type: 'context' as const, line: '    protocol    = "tcp"' },
        { type: 'context' as const, line: '}' },
      ],
    },
    createdAt: Date.now() - 50000,
    updatedAt: Date.now() - 50000,
  },
  {
    id: 'blk-finding-1',
    type: 'finding',
    title: 'Exposed Debug Port Detected',
    data: {
      severity: 'High' as const,
      description: 'Agent telemetry probe discovered open JTAG debug port on internal edge router cluster node.',
      location: 'k8s://cluster-west-2/node-prod-04',
      recommendation: 'Close open port 9091 and re-deploy hardened kernel profile.',
      fixActionLabel: 'Patch Security Profile',
      fixed: false,
    },
    createdAt: Date.now() - 40000,
    updatedAt: Date.now() - 40000,
  },
  {
    id: 'blk-gate-1',
    type: 'gate',
    title: 'Deployment Approval Quality Gate',
    data: {
      gateName: 'Release Gate: v3.2.0',
      status: 'pending' as const,
      criteria: [
        { name: '100% Policy Diff Lint Passed', passed: true },
        { name: 'Zero Critical Vulnerability Findings', passed: false },
        { name: 'Multi-Region SLA Verification', passed: true },
      ],
    },
    createdAt: Date.now() - 30000,
    updatedAt: Date.now() - 30000,
  },
  {
    id: 'blk-evidence-1',
    type: 'evidence',
    title: 'Cryptographic Audit Proof',
    data: {
      artifactType: 'json' as const,
      summary: 'Deterministic SHA-256 Merkle proof of policy compliance.',
      content: JSON.stringify(
        {
          contractId: 'parabox_contract_9841',
          merkleRoot: '0x8f2d659a8c7b3e1049ff8274a129031cba48271a5c6d7e8f90123456789abcde',
          signatures: ['0x39a1b...', '0x99f8c...'],
          verifiedAt: '2026-10-01T08:30:00Z',
          authority: 'Parabox Hardware Enclave',
        },
        null,
        2
      ),
      downloadUrl: '#',
    },
    createdAt: Date.now() - 20000,
    updatedAt: Date.now() - 20000,
  },
  {
    id: 'blk-journey-1',
    type: 'journey',
    title: 'AI Verification Execution Flow',
    data: {
      steps: [
        { id: '1', title: 'Parse Document AST & Semantic Graph', status: 'completed' as const, duration: '48ms' },
        { id: '2', title: 'Evaluate Deterministic Guardrails', status: 'completed' as const, duration: '135ms' },
        { id: '3', title: 'Enforce Cross-Tenant Isolation Policies', status: 'running' as const, duration: 'Live' },
        { id: '4', title: 'Issue Signed Attestation Certificate', status: 'pending' as const },
      ],
    },
    createdAt: Date.now() - 10000,
    updatedAt: Date.now() - 10000,
  },
];

function CanvasToolbar() {
  const { blocks, density, setDensity, clearCanvas, addBlock } = useCanvas();
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Block Canvas Studio</h1>
            <Badge variant="primary">{blocks.length} Blocks</Badge>
          </div>
          <p className="text-sm text-zinc-400">
            Author and chain interactive governance blocks. Press <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 font-mono text-xs">/</kbd> anywhere to insert blocks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SegmentedTabs
            size="sm"
            tabs={[
              { id: 'compact', label: 'Compact' },
              { id: 'normal', label: 'Normal' },
              { id: 'spacious', label: 'Spacious' },
            ]}
            activeTab={density}
            onChange={(d) => setDensity(d as DensityMode)}
          />

          <Button size="sm" variant="outline" onClick={() => setShowJson(!showJson)}>
            {showJson ? 'Hide JSON' : 'Export JSON'}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="text-zinc-400 hover:text-red-400"
            onClick={clearCanvas}
          >
            Clear
          </Button>
        </div>
      </div>

      {showJson && (
        <Card className="p-4 bg-zinc-950 border-zinc-800 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-850 text-xs">
            <span className="font-mono text-zinc-400 font-semibold">Canvas Document State (JSON)</span>
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(blocks, null, 2));
                alert('Copied canvas state to clipboard!');
              }}
            >
              Copy JSON
            </Button>
          </div>
          <pre className="text-[11px] font-mono text-indigo-300 overflow-x-auto max-h-60 leading-relaxed">
            {JSON.stringify(blocks, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}

export default function CanvasPage() {
  return (
    <CanvasProvider initialBlocks={SAMPLE_INITIAL_BLOCKS}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <CanvasToolbar />
        <CanvasRenderer />
      </div>
    </CanvasProvider>
  );
}
