'use client';

import React, { useState } from 'react';
import { Card, Button, Badge } from '@parabox/ui';
import { useParaboxAuth, RequireRole } from '@parabox/auth';

export default function BillingPlansPage() {
  const { currentTenant, switchWorkspace } = useParaboxAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const tiers = [
    {
      id: 'free',
      name: 'Free Community',
      price: '$0',
      description: 'Essential block editing for solo researchers and developers.',
      features: [
        'Single workspace',
        'Basic Canvas blocks (Clause, Diff)',
        '10 agent evaluations / day',
        'Community support',
      ],
      current: currentTenant?.plan === 'free',
    },
    {
      id: 'starter',
      name: 'Team Starter',
      price: billingCycle === 'monthly' ? '$49' : '$39',
      period: '/ month',
      description: 'Real-time telemetry and streaming for growing AI engineering teams.',
      features: [
        'Up to 5 team members',
        'All standard canvas blocks',
        'Real-time SSE & terminal streaming',
        '5,000 monthly agent evaluations',
        'Standard email support',
      ],
      current: currentTenant?.plan === 'starter',
    },
    {
      id: 'pro',
      name: 'Production Pro',
      price: billingCycle === 'monthly' ? '$199' : '$159',
      period: '/ month',
      description: 'Full governance, custom block authoring, and quality policy gates.',
      popular: true,
      features: [
        'Unlimited workspace members',
        'Custom canvas block authoring',
        'Automated CI/CD quality gates',
        'High-throughput WebSocket & SSE streams',
        'Role-Based Access Control (RBAC)',
        'Priority 24/7 SLA support',
      ],
      current: currentTenant?.plan === 'pro',
    },
    {
      id: 'enterprise',
      name: 'Enterprise Dedicated',
      price: 'Custom',
      description: 'Dedicated hardware enclaves, custom guardrails, and VPC deployment.',
      features: [
        'Everything in Pro',
        'Custom SSO & SAML with Okta/Azure',
        'Tamper-evident audit trail exports',
        'Dedicated VPC & on-prem deployment',
        'Custom SLA & dedicated solution architect',
      ],
      current: currentTenant?.plan === 'enterprise',
    },
  ];

  const handleCheckout = async (tierId: string) => {
    setLoadingTier(tierId);
    // Simulate Stripe checkout redirection
    await new Promise((r) => setTimeout(r, 1000));
    alert(`Redirecting to Stripe Checkout for plan: ${tierId.toUpperCase()}...`);
    setLoadingTier(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Simple, Transparent Pricing for AI Workloads
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Scale your AI agent governance from prototype to enterprise compliance without friction.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="inline-flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-1 mt-4">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annually')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              billingCycle === 'annually'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`p-6 flex flex-col justify-between relative transition-all duration-200 ${
              tier.popular
                ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-zinc-900 shadow-xl'
                : 'border-zinc-800 bg-zinc-900/60'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="primary" size="sm">
                  MOST POPULAR
                </Badge>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-base text-zinc-100">{tier.name}</h3>
                {tier.current && <Badge variant="success">CURRENT</Badge>}
              </div>

              <p className="text-xs text-zinc-400 min-h-[36px]">{tier.description}</p>

              <div className="my-6">
                <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                {tier.period && <span className="text-xs text-zinc-400 ml-1">{tier.period}</span>}
              </div>

              <div className="space-y-2.5 pt-4 border-t border-zinc-800">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Included Features
                </div>
                <ul className="space-y-2 text-xs text-zinc-300">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 text-sm leading-none shrink-0">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              {tier.current ? (
                <Button variant="outline" className="w-full" disabled>
                  Current Active Plan
                </Button>
              ) : (
                <RequireRole
                  role="admin"
                  fallback={
                    <Button variant="ghost" className="w-full" disabled>
                      Admin Required to Upgrade
                    </Button>
                  }
                >
                  <Button
                    variant={tier.popular ? 'primary' : 'secondary'}
                    className="w-full"
                    isLoading={loadingTier === tier.id}
                    onClick={() => handleCheckout(tier.id)}
                  >
                    {tier.price === 'Custom' ? 'Contact Sales' : `Upgrade to ${tier.name}`}
                  </Button>
                </RequireRole>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
