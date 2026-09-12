'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { BentoCard } from './ui/BentoCard';
import { Typography } from './ui/Typography';
import { APP_CONFIG } from '../config/app';

export default function PrivyComponent() {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
  const [mounted, setMounted] = useState(false);
  
  const [stamps, setStamps] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch the user's balance automatically when authenticated
  useEffect(() => {
    async function fetchBalance() {
      if (authenticated && ready) {
        try {
          const token = await getAccessToken();
          const res = await fetch('/api/balance', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setStamps(data.stamps);
          }
        } catch (err) {
          console.error("Failed to fetch balance", err);
        }
      }
    }
    fetchBalance();
  }, [authenticated, ready, getAccessToken]);

  if (!mounted || !ready) {
    return (
      <BentoCard variant="panel" className="flex items-center justify-center w-full min-h-[250px]">
        <div className="w-8 h-8 border-2 border-[var(--color-copper)]/30 border-t-[var(--color-copper)] rounded-full animate-spin" />
      </BentoCard>
    );
  }

  return (
    <BentoCard variant="panel" className="w-full">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <Typography variant="h2" className="!mb-0">Cryptographic Identity</Typography>
        {authenticated && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-400">Authenticated</span>
          </div>
        )}
      </div>

      {authenticated ? (
        <div className="flex flex-col gap-8">
          
          {/* Identity & Wallet Info */}
          <div className="grid grid-cols-1 gap-4">
            <BentoCard variant="card" className="!p-5">
              <Typography variant="label">Immutable Identifier (DID)</Typography>
              <Typography variant="p" className="!mb-0 font-mono text-sm break-all">{user?.id}</Typography>
            </BentoCard>
            
            {user?.wallet && (
              <BentoCard variant="card" className="!p-5">
                <Typography variant="label">Embedded Web3 Vault</Typography>
                <Typography variant="p" className="!mb-0 font-mono text-sm break-all opacity-70">{user.wallet.address}</Typography>
              </BentoCard>
            )}
          </div>

          {/* Loyalty Stamps Area */}
          <div className="flex flex-col items-center justify-center py-10 bg-[var(--color-liquid-ink)]/80 rounded-2xl border border-white/5 shadow-inner">
            <Typography variant="label" className="text-[var(--foreground)]">Current Balance</Typography>
            <div className="flex items-baseline gap-2 mt-2 mb-3">
              <span className="text-6xl font-light text-white tracking-tighter">
                {stamps !== null ? stamps : '-'}
              </span>
              <span className="text-2xl font-light text-white/30">/ {APP_CONFIG.ui.stampsRequired}</span>
            </div>
            {stamps !== null && stamps >= APP_CONFIG.ui.stampsRequired && (
              <div className="mt-4 px-4 py-2 bg-[var(--color-copper)]/10 border border-[var(--color-copper)]/20 rounded-lg">
                <Typography variant="p" className="!mb-0 text-[var(--color-copper)] text-sm font-medium">
                  Threshold Reached. Reward Available.
                </Typography>
              </div>
            )}
          </div>

          <div className="pt-6 mt-2 text-center">
            <Typography variant="caption" className="mb-6 max-w-sm mx-auto">
              Present this interface to a verified operator to initiate a secure cryptographic state update.
            </Typography>
            <button 
              onClick={logout}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              Terminate Session
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 py-4">
          <Typography variant="p" className="text-center max-w-sm mx-auto">
            Secure, passwordless authentication utilizing zero-knowledge proofs and embedded provisioning. No extensions required.
          </Typography>
          
          <button 
            onClick={login}
            className="w-full rounded-xl bg-[var(--color-copper)] px-4 py-4 text-sm font-medium text-white hover:bg-[var(--color-copper)]/90 transition-all duration-300 shadow-lg shadow-[var(--color-copper)]/20"
          >
            Authenticate via Secure OTP
          </button>
        </div>
      )}
    </BentoCard>
  );
}
