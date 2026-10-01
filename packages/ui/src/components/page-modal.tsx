'use client';

import React, { useEffect, useState } from 'react';
import {
  modalBus,
  UpgradeModalPayload,
  ConfirmModalPayload,
  CustomModalPayload,
} from './modal-bus';
import { Dialog } from './common/Dialog';
import { Button } from './common/Button';
import { Badge } from './common/Badge';
import { Input } from './common/Input';

export const PageModalHost: React.FC = () => {
  // Upgrade Modal State
  const [upgradeData, setUpgradeData] = useState<UpgradeModalPayload | null>(null);

  // Confirm Modal State
  const [confirmData, setConfirmData] = useState<ConfirmModalPayload | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Custom Modal State
  const [customData, setCustomData] = useState<CustomModalPayload | null>(null);

  // Create Workspace State
  const [showCreateWs, setShowCreateWs] = useState(false);
  const [wsName, setWsName] = useState('');

  useEffect(() => {
    const unsubUpgrade = modalBus.on('UPGRADE_REQUIRED', (payload) => {
      setUpgradeData(payload);
    });

    const unsubConfirm = modalBus.on('CONFIRM_ACTION', (payload) => {
      setConfirmData(payload);
    });

    const unsubCustom = modalBus.on('CUSTOM_MODAL', (payload) => {
      setCustomData(payload);
    });

    const unsubCreateWs = modalBus.on('CREATE_WORKSPACE', (payload) => {
      setWsName(payload?.defaultName || '');
      setShowCreateWs(true);
    });

    const unsubClose = modalBus.on('CLOSE_MODAL', () => {
      setUpgradeData(null);
      setConfirmData(null);
      setCustomData(null);
      setShowCreateWs(false);
    });

    return () => {
      unsubUpgrade();
      unsubConfirm();
      unsubCustom();
      unsubCreateWs();
      unsubClose();
    };
  }, []);

  return (
    <>
      {/* 1. Stripe Upgrade Required Modal */}
      <Dialog
        isOpen={Boolean(upgradeData)}
        onClose={() => setUpgradeData(null)}
        title={
          <div className="flex items-center gap-2">
            <span>Upgrade Required</span>
            <Badge variant="primary">{upgradeData?.requiredTier || 'Pro'}</Badge>
          </div>
        }
        description="Unlock advanced agent capabilities and enterprise workspaces."
        footer={
          <>
            <Button variant="ghost" onClick={() => setUpgradeData(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setUpgradeData(null);
                window.location.href = '/billing';
              }}
            >
              View Plans & Upgrade
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/30 p-4">
            <h4 className="text-sm font-semibold text-indigo-300">
              {upgradeData?.feature
                ? `Feature: ${upgradeData.feature.replace(/_/g, ' ')}`
                : 'Premium Tier Required'}
            </h4>
            <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
              {upgradeData?.message ||
                'This action or feature is not available on your current plan. Upgrade your workspace to continue without restrictions.'}
            </p>
          </div>
          <ul className="text-xs text-zinc-400 space-y-1.5 list-disc pl-4">
            <li>Unlimited AI agent streaming & virtual logs</li>
            <li>Custom block authoring & policy gates</li>
            <li>Multi-tenant team collaboration and RBAC</li>
          </ul>
        </div>
      </Dialog>

      {/* 2. Action Confirmation Modal */}
      <Dialog
        isOpen={Boolean(confirmData)}
        onClose={() => setConfirmData(null)}
        title={confirmData?.title || 'Confirm Action'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmData(null)}>
              {confirmData?.cancelLabel || 'Cancel'}
            </Button>
            <Button
              variant={confirmData?.destructive ? 'danger' : 'primary'}
              isLoading={confirmLoading}
              onClick={async () => {
                if (confirmData?.onConfirm) {
                  setConfirmLoading(true);
                  try {
                    await confirmData.onConfirm();
                  } finally {
                    setConfirmLoading(false);
                    setConfirmData(null);
                  }
                }
              }}
            >
              {confirmData?.confirmLabel || 'Confirm'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-zinc-300">{confirmData?.message}</p>
      </Dialog>

      {/* 3. Create Workspace Modal */}
      <Dialog
        isOpen={showCreateWs}
        onClose={() => setShowCreateWs(false)}
        title="Create New Workspace"
        description="Organize your agents, contracts, and canvas projects."
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCreateWs(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!wsName.trim()}
              onClick={() => {
                setShowCreateWs(false);
                alert(`Workspace "${wsName}" created successfully!`);
              }}
            >
              Create Workspace
            </Button>
          </>
        }
      >
        <div className="py-2 space-y-3">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Workspace Name
          </label>
          <Input
            placeholder="e.g. Acme Production"
            value={wsName}
            onChange={(e) => setWsName(e.target.value)}
            autoFocus
          />
        </div>
      </Dialog>

      {/* 4. Custom Dialog Modal */}
      <Dialog
        isOpen={Boolean(customData)}
        onClose={() => setCustomData(null)}
        title={customData?.title}
        footer={customData?.footer}
      >
        {customData?.content}
      </Dialog>
    </>
  );
};
