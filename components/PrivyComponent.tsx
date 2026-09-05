'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';

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
      <div className="flex items-center justify-center w-full h-[200px] border border-white/10 rounded-xl bg-zinc-900/50">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full border border-white/10 rounded-xl bg-zinc-900 p-6 text-zinc-300 shadow-2xl">
      <h2 className="text-xl font-medium text-white mb-6">Bakery Loyalty Card</h2>

      {authenticated ? (
        <div className="flex flex-col gap-6">
          
          {/* Identity & Wallet Info */}
          <div className="bg-black/50 p-4 rounded-lg border border-white/5 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">User DID</p>
              <p className="text-sm font-mono break-all text-white">{user?.id}</p>
            </div>
            
            {user?.wallet && (
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Embedded Wallet (Base Sepolia ready)</p>
                <p className="text-sm font-mono break-all text-zinc-300">{user.wallet.address}</p>
              </div>
            )}
          </div>

          {/* Loyalty Stamps Area */}
          <div className="flex flex-col items-center justify-center py-6 bg-zinc-950/50 rounded-xl border border-zinc-800">
            <p className="text-sm text-zinc-400 mb-2">Your Stamps</p>
            <div className="text-5xl font-bold text-white mb-1">
              {stamps !== null ? stamps : '-'} <span className="text-2xl text-zinc-500">/ 10</span>
            </div>
            {stamps !== null && stamps >= 10 && (
              <p className="text-green-400 text-sm font-medium mt-2">🎉 You earned a free cake!</p>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 text-center">
             <p className="text-sm text-zinc-400 mb-4">
               Show this page to the cashier to earn or redeem your stamps.
             </p>
            <button 
              onClick={logout}
              className="w-full mt-2 rounded-lg bg-zinc-800 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-zinc-400 text-center">
            Email login and stamp earning, no installs, no seeds.
          </p>
          
          <button 
            onClick={login}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-black hover:bg-zinc-200 transition-colors"
          >
            Get Started (Email & OTP)
          </button>
        </div>
      )}
    </div>
  );
}
