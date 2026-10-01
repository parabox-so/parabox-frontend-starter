'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, ConnectionStatus } from '@parabox/ui';
import { VirtualLogStream, useStaleDataDetector } from '@parabox/realtime';

const SAMPLE_LOG_FEED = [
  '\u001b[36m[AGENT_INIT]\u001b[0m Starting SentinelSecurityAgent-v3 on node cluster-us-east-1a...',
  '\u001b[34m[AUTH_CHECK]\u001b[0m Tenant credentials verified: org_parabox_prod (Plan: Enterprise)',
  '\u001b[32m[INGESTION]\u001b[0m Ingesting cloud formation policy template (size: 42.8 KB)',
  '\u001b[35m[LLM_STREAM]\u001b[0m Initializing reasoning pipeline with temperature=0.2, top_p=0.95',
  '\u001b[32m[PARSER]\u001b[0m Successfully extracted 32 security group rules and 14 IAM policies',
  '\u001b[33m[WARN]\u001b[0m Deprecated CIDR syntax detected in rule sg-0891823: use explicit mask notation',
  '\u001b[35m[LLM_STREAM]\u001b[0m Analyzing egress egress_rule_3: destination 0.0.0.0/0 on port 22 (SSH)',
  '\u001b[31m[CRITICAL_FINDING]\u001b[0m Public SSH egress detected on sensitive database subnet!',
  '\u001b[36m[REMEDIATION]\u001b[0m Generating automated pull request patch with strict VPN restrictors...',
  '\u001b[32m[VERIFIED]\u001b[0m Quality gate: Security Baseline v2.4 passed with 1 non-blocking warning',
  '\u001b[34m[TELEMETRY]\u001b[0m Emitting run audit attestation proof to cryptographic ledger...',
  '\u001b[32m[COMPLETED]\u001b[0m Agent run completed in 1.48s with 0 fatal errors.',
];

export default function AgentStreamingPage() {
  const [logs, setLogs] = useState<string[]>(SAMPLE_LOG_FEED);
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(1200);
  const [streamedTokens, setStreamedTokens] = useState<string>('');
  const streamTimerRef = useRef<any>(null);

  const { isStale, markActivity, secondsSinceLastActivity } = useStaleDataDetector({
    staleThresholdMs: 10000,
  });

  // Simulated live event feed generator
  useEffect(() => {
    if (!isStreaming) {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      return;
    }

    streamTimerRef.current = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * SAMPLE_LOG_FEED.length);
      const timestamp = new Date().toISOString().slice(11, 19);
      const prefix = `\u001b[90m${timestamp}\u001b[0m `;
      const newLog = prefix + SAMPLE_LOG_FEED[randomIdx];

      setLogs((prev) => [...prev, newLog]);
      markActivity();

      // Simulate token stream
      const sampleTokens = [' analyzing', ' security', ' policy', ' AST', ' nodes...', ' verified', ' OK\n'];
      const randomToken = sampleTokens[Math.floor(Math.random() * sampleTokens.length)];
      setStreamedTokens((prev) => (prev.length > 800 ? randomToken : prev + randomToken));
    }, streamSpeed);

    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [isStreaming, streamSpeed, markActivity]);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Live Agent Telemetry</h1>
            <Badge variant="primary">SSE Stream</Badge>
          </div>
          <p className="text-sm text-zinc-400">
            Real-time terminal log viewer and LLM token stream monitoring with backoff & reconnection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ConnectionStatus
            state={!isStreaming ? 'disconnected' : isStale ? 'stale' : 'connected'}
          />
          <Button
            size="sm"
            variant={isStreaming ? 'outline' : 'primary'}
            onClick={() => setIsStreaming(!isStreaming)}
          >
            {isStreaming ? 'Pause Feed' : 'Resume Feed'}
          </Button>
        </div>
      </div>

      {/* Stream Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <span className="text-xs text-zinc-400">Stream Status</span>
          <div className="text-xl font-bold text-white mt-1">
            {isStreaming ? 'Connected (120 FPS)' : 'Paused'}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Last event received: {secondsSinceLastActivity}s ago
          </p>
        </Card>

        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <span className="text-xs text-zinc-400">Total Ingested Events</span>
          <div className="text-xl font-bold text-indigo-400 mt-1">{logs.length}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Virtual buffer limit: 2,000</p>
        </Card>

        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <span className="text-xs text-zinc-400">Stream Interval</span>
          <div className="flex items-center gap-2 mt-2">
            {[500, 1200, 2500].map((speed) => (
              <button
                key={speed}
                onClick={() => setStreamSpeed(speed)}
                className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
                  streamSpeed === speed
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {speed}ms
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* LLM Token Stream Preview */}
      <Card className="p-4 bg-zinc-950 border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-800/80">
          <div className="flex items-center gap-2 font-mono text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
            <span>LLM Response Streamer (chunk-by-chunk)</span>
          </div>
          <Button size="xs" variant="ghost" onClick={() => setStreamedTokens('')}>
            Clear Output
          </Button>
        </div>
        <div className="font-mono text-xs text-indigo-300 whitespace-pre-wrap min-h-[50px] bg-zinc-900/40 p-3 rounded-lg border border-zinc-850">
          {streamedTokens || 'Waiting for next agent token chunk...'}
        </div>
      </Card>

      {/* High-Performance Virtual Log Terminal */}
      <VirtualLogStream
        logs={logs}
        maxLogs={2000}
        height="480px"
        title="Agent Execution Logs"
        onClear={() => setLogs([])}
      />
    </div>
  );
}
