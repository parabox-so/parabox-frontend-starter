'use client';

import React, { ReactNode } from 'react';
import { useParaboxAuth } from './hooks';
import { UserRole } from './provider';
import { Button, Card, modalBus } from '@parabox/ui';

export interface RequireEntitlementProps {
  feature: string;
  fallback?: ReactNode;
  children: ReactNode;
  showUpgradeTrigger?: boolean;
}

export const RequireEntitlement: React.FC<RequireEntitlementProps> = ({
  feature,
  fallback,
  children,
  showUpgradeTrigger = true,
}) => {
  const { hasEntitlement, currentTenant } = useParaboxAuth();
  const entitled = hasEntitlement(feature);

  if (entitled) {
    return <>{children}</>;
  }

  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  if (!showUpgradeTrigger) {
    return null;
  }

  return (
    <Card className="p-6 text-center border-dashed border-zinc-800 bg-zinc-950/40 rounded-2xl">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 mb-3">
        🔒
      </div>
      <h3 className="text-sm font-semibold text-zinc-100">Premium Feature Locked</h3>
      <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
        Feature <code className="text-indigo-300 font-mono">{feature}</code> is not included in the{' '}
        <span className="capitalize font-semibold text-zinc-200">{currentTenant?.plan || 'Free'}</span> plan.
      </p>
      <div className="mt-4 flex justify-center">
        <Button
          size="sm"
          variant="primary"
          onClick={() =>
            modalBus.emit('UPGRADE_REQUIRED', {
              feature,
              requiredTier: 'Pro',
              message: `Unlock ${feature.replace(/_/g, ' ')} and team collaboration features.`,
            })
          }
        >
          Upgrade Plan
        </Button>
      </div>
    </Card>
  );
};

export interface RequireRoleProps {
  role: UserRole;
  fallback?: ReactNode;
  children: ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({
  role,
  fallback = null,
  children,
}) => {
  const { hasRole } = useParaboxAuth();
  const authorized = hasRole(role);

  if (authorized) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
