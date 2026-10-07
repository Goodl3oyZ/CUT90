'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flame, Lock, User, Key, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          inviteCode: inviteCode || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/onboarding');
        router.refresh();
      } else {
        setErrorMsg(data.error?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    } catch {
      setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-8 bg-slate-50 dark:bg-[#0b1319]">
      <div className="max-w-sm mx-auto w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cobalt-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-cobalt-500/20">
            <Flame className="w-8 h-8 fill-current text-amber-300" />
          </div>
          <h1 className="font-brand font-bold text-3xl uppercase tracking-wide text-slate-900 dark:text-white">
            CUT 90 PLANNER
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            สมัครสมาชิกเพื่อเริ่มแผน 90 วันของคุณ
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#15202b] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-center">
            ลงทะเบียนใหม่
          </h2>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                ชื่อผู้ใช้ (a-z, 0-9, _)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  minLength={3}
                  maxLength={32}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={8}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                รหัสเชิญ (Invite Code) [ถ้ามี]
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="รหัสเชิญ (ถ้ากำหนด)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center"
            >
              {loading ? 'กำลังลงทะเบียน...' : 'สมัครสมาชิก'}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            มีบัญชีอยู่แล้ว?{' '}
            <Link
              href="/login"
              className="text-cobalt-600 dark:text-cobalt-400 font-semibold hover:underline"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
