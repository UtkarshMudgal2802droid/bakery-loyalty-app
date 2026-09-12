'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { BentoCard } from '../../components/ui/BentoCard';
import { Typography } from '../../components/ui/Typography';
import { APP_CONFIG } from '../../config/app';

export default function StaffPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [stampData, setStampData] = useState<{ stamps: number; signature: string } | null>(null);
  const [error, setError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean, message: string } | null>(null);

  const { getAccessToken } = usePrivy();

  const handleAwardStamp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStampData(null);
    setVerifyResult(null);
    
    try {
      const authToken = await getAccessToken();
      
      const res = await fetch('/api/mint-stamp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to award stamp');
      
      setStampData({ stamps: data.stamps, signature: data.serverSignature });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!stampData?.signature) return;
    setVerifyLoading(true);
    
    try {
      const res = await fetch('/api/verify-stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, signature: stampData.signature, stamps: stampData.stamps })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      
      setVerifyResult({ valid: data.valid, message: data.message });
    } catch (err: any) {
      setVerifyResult({ valid: false, message: err.message });
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 p-6 md:p-12 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[30%] h-[30%] bg-[var(--color-copper)]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-[var(--color-emerald)]/10 blur-[100px] rounded-full pointer-events-none" />

      <main className="flex flex-col w-full max-w-xl z-10 relative">
        <BentoCard variant="panel">
          <div className="mb-8 border-b border-white/5 pb-4">
            <Typography variant="h2" className="!mb-1">Operator Console</Typography>
            <Typography variant="caption">
              Initiate and verify secure state transitions for loyalty protocols.
            </Typography>
          </div>

          <form onSubmit={handleAwardStamp} className="space-y-6">
            <div>
              <Typography variant="label">Target Identifier (Email)</Typography>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@domain.com"
                required
                className="w-full bg-[var(--color-liquid-ink)]/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[var(--color-copper)]/50 transition-colors shadow-inner"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--color-copper)] px-4 py-4 font-medium text-white hover:bg-[var(--color-copper)]/90 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-[var(--color-copper)]/20"
            >
              {loading ? 'Executing Protocol...' : 'Mint Cryptographic Attestation'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400/90 text-sm font-medium">
              Error: {error}
            </div>
          )}

          {stampData && (
            <div className="mt-10 pt-8 border-t border-white/5 space-y-6">
              <div className="flex flex-col items-center justify-center py-8 bg-[var(--color-liquid-ink)]/80 rounded-2xl border border-white/5 shadow-inner">
                <Typography variant="label" className="text-[var(--foreground)]">Synchronized Balance</Typography>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-light text-white tracking-tighter">
                    {stampData.stamps}
                  </span>
                  <span className="text-xl font-light text-white/30">/ {APP_CONFIG.ui.stampsRequired}</span>
                </div>
              </div>

              <BentoCard variant="card" className="!p-5 bg-black/30">
                <Typography variant="label">Generated Cryptographic Signature</Typography>
                <Typography variant="p" className="!mb-0 text-xs font-mono break-all opacity-60">
                  {stampData.signature}
                </Typography>
              </BentoCard>

              <button 
                onClick={handleVerify}
                disabled={verifyLoading}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
              >
                {verifyLoading ? 'Computing Verification...' : 'Verify Cryptographic Integrity'}
              </button>

              {verifyResult && (
                <div className={`p-5 rounded-xl border backdrop-blur-md ${verifyResult.valid ? 'bg-green-950/20 border-green-500/20' : 'bg-red-950/20 border-red-500/20'}`}>
                  <Typography variant="p" className={`!mb-1 font-medium ${verifyResult.valid ? 'text-green-400' : 'text-red-400'}`}>
                    {verifyResult.valid ? 'State Synchronized: Cryptography Validated' : 'State Mismatch: Integrity Compromised'}
                  </Typography>
                  <Typography variant="caption" className="!mb-0 opacity-80">
                    {verifyResult.message}
                  </Typography>
                </div>
              )}
            </div>
          )}
        </BentoCard>
      </main>
    </div>
  );
}
