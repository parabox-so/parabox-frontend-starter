'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type BlockType = 'clause' | 'evidence' | 'diff' | 'finding' | 'gate' | 'journey' | string;

export interface CanvasBlock<T = any> {
  id: string;
  type: BlockType;
  title: string;
  data: T;
  createdAt: number;
  updatedAt: number;
  status?: 'idle' | 'running' | 'success' | 'failed';
}

export type DensityMode = 'compact' | 'normal' | 'spacious';

export interface CanvasBlockProps<T = any> {
  block: CanvasBlock<T>;
  isSelected?: boolean;
  onSelect?: () => void;
  density?: DensityMode;
}

export interface CanvasContextType {
  blocks: CanvasBlock[];
  selectedBlockId: string | null;
  density: DensityMode;
  setDensity: (mode: DensityMode) => void;
  selectBlock: (id: string | null) => void;
  addBlock: (type: BlockType, data?: any, title?: string) => string;
  insertBlockAt: (index: number, type: BlockType, data?: any, title?: string) => string;
  updateBlock: <T = any>(id: string, data: Partial<T> | T, title?: string) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
  executeBlock: (id: string) => Promise<void>;
  clearCanvas: () => void;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

export const defaultBlockDataFactory = (type: BlockType): { title: string; data: any } => {
  switch (type) {
    case 'clause':
      return {
        title: 'Contract Liability Clause',
        data: {
          clauseNumber: 'Sec 14.2',
          text: 'The provider warrants that all services rendered hereunder will conform to the highest industry specifications and comply with applicable privacy standards.',
          status: 'pass',
          severity: 'low',
        },
      };
    case 'evidence':
      return {
        title: 'Audit Trace & Telemetry Artifact',
        data: {
          artifactType: 'json',
          summary: 'Agent run execution log payload',
          content: JSON.stringify(
            {
              runId: 'run_889218',
              agent: 'SecurityPolicyAgent-v3',
              verifications: 14,
              passed: 14,
              timestamp: new Date().toISOString(),
            },
            null,
            2
          ),
          downloadUrl: '#',
        },
      };
    case 'diff':
      return {
        title: 'Configuration Diff',
        data: {
          filePath: 'config/policies/access-control.yaml',
          chunks: [
            { type: 'context', line: 'version: "2.1"' },
            { type: 'remove', line: '- role: guest_evaluator' },
            { type: 'remove', line: '  permissions: [read, execute]' },
            { type: 'add', line: '+ role: guest_evaluator' },
            { type: 'add', line: '+   permissions: [read]' },
            { type: 'context', line: 'default_timeout_sec: 30' },
          ],
        },
      };
    case 'finding':
      return {
        title: 'Unrestricted Public Ingress Finding',
        data: {
          severity: 'Critical',
          description: 'Security group permits unfiltered 0.0.0.0/0 traffic to internal database replica port 5432.',
          location: 'aws_security_group.db_replica',
          recommendation: 'Restrict ingress CIDR block to VPC subnet range.',
          fixActionLabel: 'Apply Automated Remediation',
        },
      };
    case 'gate':
      return {
        title: 'SOC2 & HIPAA Quality Gate',
        data: {
          gateName: 'Production Compliance Baseline',
          criteria: [
            { name: 'Zero critical CVEs in base container image', passed: true },
            { name: 'PII token masking enabled in telemetry', passed: true },
            { name: 'Automated policy diff sign-off', passed: false },
          ],
          status: 'pending',
        },
      };
    case 'journey':
      return {
        title: 'Agent Resolution Journey',
        data: {
          steps: [
            { id: '1', title: 'User Query Ingestion', status: 'completed', duration: '120ms' },
            { id: '2', title: 'Context Indexing & Retrieval', status: 'completed', duration: '340ms' },
            { id: '3', title: 'Multi-Agent Consensus Evaluation', status: 'running', duration: 'In Progress' },
            { id: '4', title: 'Execution Guard Verification', status: 'pending' },
          ],
        },
      };
    default:
      return {
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Block`,
        data: {},
      };
  }
};

export interface CanvasProviderProps {
  initialBlocks?: CanvasBlock[];
  children: ReactNode;
}

export const CanvasProvider: React.FC<CanvasProviderProps> = ({
  initialBlocks = [],
  children,
}) => {
  const [blocks, setBlocks] = useState<CanvasBlock[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [density, setDensity] = useState<DensityMode>('normal');

  const addBlock = useCallback((type: BlockType, data?: any, title?: string): string => {
    const id = `blk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const defaults = defaultBlockDataFactory(type);
    const newBlock: CanvasBlock = {
      id,
      type,
      title: title || defaults.title,
      data: data !== undefined ? data : defaults.data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'idle',
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(id);
    return id;
  }, []);

  const insertBlockAt = useCallback(
    (index: number, type: BlockType, data?: any, title?: string): string => {
      const id = `blk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const defaults = defaultBlockDataFactory(type);
      const newBlock: CanvasBlock = {
        id,
        type,
        title: title || defaults.title,
        data: data !== undefined ? data : defaults.data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'idle',
      };
      setBlocks((prev) => {
        const next = [...prev];
        next.splice(index, 0, newBlock);
        return next;
      });
      setSelectedBlockId(id);
      return id;
    },
    []
  );

  const updateBlock = useCallback(<T = any,>(id: string, data: Partial<T> | T, title?: string) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const updatedData = typeof data === 'object' && data !== null && !Array.isArray(data)
          ? { ...b.data, ...data }
          : data;
        return {
          ...b,
          data: updatedData,
          title: title !== undefined ? title : b.title,
          updatedAt: Date.now(),
        };
      })
    );
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setSelectedBlockId((prev) => (prev === id ? null : prev));
  }, []);

  const reorderBlocks = useCallback((startIndex: number, endIndex: number) => {
    setBlocks((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, item);
      return copy;
    });
  }, []);

  const executeBlock = useCallback(async (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'running' } : b))
    );
    // Simulate execution delay
    await new Promise((r) => setTimeout(r, 1200));
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: Math.random() > 0.1 ? 'success' : 'failed' } : b
      )
    );
  }, []);

  const clearCanvas = useCallback(() => {
    setBlocks([]);
    setSelectedBlockId(null);
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        blocks,
        selectedBlockId,
        density,
        setDensity,
        selectBlock: setSelectedBlockId,
        addBlock,
        insertBlockAt,
        updateBlock,
        deleteBlock,
        reorderBlocks,
        moveBlock,
        executeBlock,
        clearCanvas,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const ctx = useContext(CanvasContext);
  if (!ctx) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return ctx;
};
