import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, KeyRound, Loader2, AlertCircle } from 'lucide-react';
import AdminPanel from '../components/AdminPanel';

type AuthState = 'idle' | 'sending' | 'awaiting_code' | 'verifying' | 'authenticated';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'cesaresmero2@gmail.com';

function maskEmail(value: string) {
  if (!value) return '';
  const [local, domain] = value.split('@');
  if (!domain) return value;
  const maskedLocal = local.length <= 2 ? '*'.repeat(local.length) : `${local.slice(0, 2)}${'*'.repeat(Math.max(1, local.length - 2))}`;
  const [domainName, ...domainRest] = domain.split('.');
  const maskedDomain = domainRest.length > 0 ? `***.${domainRest.join('.')}` : `***`;
  return `${maskedLocal}@${maskedDomain}`;
}

export default function AdminPage() {
  const [authState, setAuthState] = useState<AuthState>('idle');
  const [email] = useState(ADMIN_EMAIL);
  const [code, setCode] = useState('');
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Persist token in sessionStorage so refreshes don't require re-login
  useEffect(() => {
    const stored = sessionStorage.getItem('etz_admin_token') || localStorage.getItem('etz_admin_token');
    if (stored) {
      sessionStorage.setItem('etz_admin_token', stored);
      localStorage.setItem('etz_admin_token', stored);
      setToken(stored);
      setAuthState('authenticated');
    }
  }, []);

  const parseJsonSafely = async (res: Response) => {
    const text = await res.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return { error: text }; 
    }
  };

  const handleRequestOtp = async () => {
    setError(null);
    setAuthState('sending');
    try {
      const res = await fetch('/api/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data?.error || 'Failed to send OTP.');
      if (data?.otpToken) {
        setOtpToken(String(data.otpToken));
      } else {
        setOtpToken(null);
      }
      setCode('');
      setAuthState('awaiting_code');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAuthState('idle');
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setAuthState('verifying');
    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, otpToken }),
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data?.error || 'Invalid code.');
      sessionStorage.setItem('etz_admin_token', data.token);
      localStorage.setItem('etz_admin_token', data.token);
      setToken(data.token);
      setAuthState('authenticated');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAuthState('awaiting_code');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('etz_admin_token');
    localStorage.removeItem('etz_admin_token');
    setToken(null);
    setAuthState('idle');
    setCode('');
    setOtpToken(null);
    setError(null);
  };

  if (authState === 'authenticated' && token) {
    return <AdminPanel token={token} onLogout={handleLogout} />;
  }

  const isLoading = authState === 'sending' || authState === 'verifying';

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1C1C1A] mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#1C1C1A]">Admin Access</h1>
          <p className="text-sm text-[#6B6B65] mt-1">ETZ A Shoppe · Owner Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E5E3DE] rounded-2xl p-6 shadow-sm space-y-5">

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1 — Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1C1C1A] tracking-wide uppercase">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B93]" />
              <div className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] flex items-center justify-between gap-2">
                <span className="truncate font-mono">{maskEmail(email)}</span>
                <span className="text-[11px] uppercase tracking-wide text-[#6B6B65]">Verified owner</span>
              </div>
            </div>
          </div>

          {/* Step 2 — OTP Code (shown after sending) */}
          <AnimatePresence>
            {authState === 'awaiting_code' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="text-xs font-semibold text-[#1C1C1A] tracking-wide uppercase">
                  6-Digit Code
                </label>
                <p className="text-xs text-[#6B6B65]">Check your inbox — the code expires in 10 minutes.</p>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B93]" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && code.length === 6 && handleVerifyOtp()}
                    autoFocus
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] placeholder-[#9B9B93] focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] tracking-[0.3em] font-mono transition-colors"
                    placeholder="000000"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Button */}
          {authState !== 'awaiting_code' ? (
            <button
              onClick={handleRequestOtp}
              disabled={!email || isLoading}
              className="w-full bg-[#1C1C1A] hover:bg-[#2D6A4F] text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              {authState === 'sending' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              ) : (
                'Send OTP Code'
              )}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleVerifyOtp}
                disabled={code.length !== 6 || isLoading}
                className="w-full bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                {authState === 'verifying' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                ) : (
                  'Verify & Login'
                )}
              </button>
              <button
                onClick={() => { setAuthState('idle'); setCode(''); setError(null); }}
                className="text-xs text-[#6B6B65] hover:text-[#1C1C1A] transition-colors cursor-pointer bg-transparent border-none"
              >
                ← Use a different email
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#9B9B93] mt-6">
          This page is only accessible via direct URL.
        </p>
      </motion.div>
    </div>
  );
}
