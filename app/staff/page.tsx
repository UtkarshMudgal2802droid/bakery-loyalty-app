'use client';

import { useState } from 'react';

export default function StaffPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [stampData, setStampData] = useState<{ stamps: number; signature: string } | null>(null);
  const [error, setError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean, message: string } | null>(null);

  const handleAwardStamp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStampData(null);
    setVerifyResult(null);
    
    try {
      // In a real app we'd authenticate the staff member first. 
      // For demo purposes, we send the customer email to the backend.
      const res = await fetch('/api/mint-stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="min-h-screen flex flex-col items-center py-20 bg-zinc-950 font-sans p-6 text-zinc-300">
      <main className="flex flex-col w-full max-w-lg bg-zinc-900 border border-white/10 p-8 rounded-xl shadow-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
          Staff POS Portal
        </h1>
        <p className="text-sm text-zinc-400 mb-8">
          Award stamps to customers and cryptographically verify their balances without trusting the customer's phone screen.
        </p>

        <form onSubmit={handleAwardStamp} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Customer Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing Transaction...' : 'Award Stamp (On-Chain / Signed)'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-950/50 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {stampData && (
          <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
            <div className="flex flex-col items-center justify-center py-6 bg-zinc-950/50 rounded-xl border border-zinc-800">
              <p className="text-sm text-zinc-400 mb-2">Updated Customer Balance</p>
              <div className="text-4xl font-bold text-white mb-1">
                {stampData.stamps} <span className="text-xl text-zinc-500">/ 10</span>
              </div>
            </div>

            <div className="bg-black/50 p-4 rounded-lg border border-white/5 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Server Cryptographic Proof</p>
                <p className="text-xs font-mono break-all text-zinc-400">
                  {stampData.signature}
                </p>
              </div>
            </div>

            <button 
              onClick={handleVerify}
              disabled={verifyLoading}
              className="w-full rounded-lg bg-zinc-800 border border-white/10 px-4 py-3 font-medium text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {verifyLoading ? 'Verifying...' : 'Verify Cryptographic Signature'}
            </button>

            {verifyResult && (
              <div className={`p-4 rounded-lg border ${verifyResult.valid ? 'bg-green-950/30 border-green-500/30 text-green-400' : 'bg-red-950/30 border-red-500/30 text-red-400'}`}>
                <p className="text-sm font-medium mb-1">
                  {verifyResult.valid ? '✅ Signature Verified' : '❌ Verification Failed'}
                </p>
                <p className="text-xs opacity-80">{verifyResult.message}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
