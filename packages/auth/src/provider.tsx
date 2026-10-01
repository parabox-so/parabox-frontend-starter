'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';
export type PlanTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface WorkspaceTenant {
  id: string;
  name: string;
  slug: string;
  plan: PlanTier;
  role: UserRole;
  entitlements: string[];
}

export interface ParaboxUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface ParaboxAuthContextType {
  user: ParaboxUser | null;
  currentTenant: WorkspaceTenant | null;
  workspaces: WorkspaceTenant[];
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string) => void;
  getToken: () => Promise<string>;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasEntitlement: (feature: string) => boolean;
  hasRole: (requiredRole: UserRole) => boolean;
}

const DEFAULT_WORKSPACES: WorkspaceTenant[] = [
  {
    id: 'ws_prod_default',
    name: 'Production Engineering',
    slug: 'prod-eng',
    plan: 'pro',
    role: 'owner',
    entitlements: [
      'canvas_editor',
      'realtime_agent_streaming',
      'custom_canvas_blocks',
      'policy_gates',
      'unlimited_runs',
      'audit_export',
    ],
  },
  {
    id: 'ws_staging_dev',
    name: 'Staging & Sandbox',
    slug: 'staging-sandbox',
    plan: 'starter',
    role: 'admin',
    entitlements: ['canvas_editor', 'realtime_agent_streaming'],
  },
  {
    id: 'ws_community_free',
    name: 'Personal Space',
    slug: 'personal-free',
    plan: 'free',
    role: 'member',
    entitlements: ['canvas_editor'],
  },
];

const DEFAULT_USER: ParaboxUser = {
  id: 'usr_admin_001',
  email: 'admin@parabox.so',
  fullName: 'Parabox Lead',
  avatarUrl: '',
};

export const ParaboxAuthContext = createContext<ParaboxAuthContextType | null>(null);

export interface ParaboxAuthProviderProps {
  children: ReactNode;
  initialWorkspaceId?: string;
  mockMode?: boolean;
}

export const ParaboxAuthProvider: React.FC<ParaboxAuthProviderProps> = ({
  children,
  initialWorkspaceId,
  mockMode = true,
}) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceTenant[]>(DEFAULT_WORKSPACES);
  const [currentTenantId, setCurrentTenantId] = useState<string>(
    initialWorkspaceId || DEFAULT_WORKSPACES[0].id
  );
  const [user, setUser] = useState<ParaboxUser | null>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState(false);

  const currentTenant = workspaces.find((w) => w.id === currentTenantId) || workspaces[0];

  const switchWorkspace = (workspaceId: string) => {
    const target = workspaces.find((w) => w.id === workspaceId);
    if (target) {
      setCurrentTenantId(target.id);
    }
  };

  const createWorkspace = (name: string) => {
    const newWs: WorkspaceTenant = {
      id: `ws_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      plan: 'free',
      role: 'owner',
      entitlements: ['canvas_editor'],
    };
    setWorkspaces((prev) => [...prev, newWs]);
    setCurrentTenantId(newWs.id);
  };

  const getToken = async (): Promise<string> => {
    // In real Clerk setup, calls `clerk.session.getToken()`
    return `pb_jwt_${user?.id || 'anonymous'}_${currentTenant?.id}`;
  };

  const hasEntitlement = (feature: string): boolean => {
    if (!currentTenant) return false;
    // Enterprise has all entitlements
    if (currentTenant.plan === 'enterprise') return true;
    return currentTenant.entitlements.includes(feature);
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!currentTenant) return false;
    const hierarchy: Record<UserRole, number> = {
      owner: 4,
      admin: 3,
      member: 2,
      viewer: 1,
    };
    return (hierarchy[currentTenant.role] || 0) >= (hierarchy[requiredRole] || 0);
  };

  return (
    <ParaboxAuthContext.Provider
      value={{
        user,
        currentTenant,
        workspaces,
        switchWorkspace,
        createWorkspace,
        getToken,
        isAuthenticated: Boolean(user),
        isLoading,
        hasEntitlement,
        hasRole,
      }}
    >
      {children}
    </ParaboxAuthContext.Provider>
  );
};
