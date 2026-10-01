'use client';

import { useContext } from 'react';
import { ParaboxAuthContext, ParaboxAuthContextType, WorkspaceTenant } from './provider';

export function useParaboxAuth(): ParaboxAuthContextType {
  const context = useContext(ParaboxAuthContext);
  if (!context) {
    throw new Error('useParaboxAuth must be used within a ParaboxAuthProvider');
  }
  return context;
}

export function useCurrentTenant(): WorkspaceTenant | null {
  const { currentTenant } = useParaboxAuth();
  return currentTenant;
}

export function usePermissions() {
  const { hasEntitlement, hasRole, currentTenant } = useParaboxAuth();
  return {
    hasEntitlement,
    hasRole,
    isOwner: currentTenant?.role === 'owner',
    isAdmin: currentTenant?.role === 'admin' || currentTenant?.role === 'owner',
    plan: currentTenant?.plan || 'free',
  };
}
