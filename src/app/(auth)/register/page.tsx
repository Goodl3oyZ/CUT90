'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-[var(--bg-main)]">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-brass-400 text-obsidian-950 flex items-center justify-center mx-auto shadow-brass-glow">
            <Icon name="Flame" size={28} />
          </div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-[var(--text-primary)]">
            CUT 90 PLANNER
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            ลงทะเบียนเพื่อสร้างแผนผังโภชนาการ 90 วันของคุณ
          </p>
        </div>

        {/* Card Form */}
        <Card variant="default" padding="lg" className="space-y-4">
          <h2 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-wider text-center">
            ลงทะเบียนสมาชิกใหม่ (Create Account)
          </h2>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
              <Icon name="AlertCircle" size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Field
              label="ชื่อผู้ใช้ (Username)"
              icon="UserRound"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ความยาว 3-32 ตัวอักษร"
              minLength={3}
              maxLength={32}
              required
            />

            <div className="space-y-1.5 relative">
              <Field
                label="รหัสผ่าน (Password)"
                icon="KeyRound"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ความยาวอย่างน้อย 8 ตัวอักษร"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded"
                aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>

            <Field
              label="รหัสเชิญ (Invite Code)"
              icon="ShieldCheck"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="กรอกรหัสเชิญ (ถ้ากำหนด)"
              helperText="ถ้าผู้ดูแลระบบไม่ได้เปิดระบบปิด ไม่จำเป็นต้องกรอก"
            />

            <Button
              type="submit"
              isLoading={loading}
              variant="primary"
              size="md"
              fullWidth
              leftIcon={<Icon name="Check" size={16} />}
            >
              สมัครสมาชิก
            </Button>
          </form>

          <div className="text-center pt-2 text-xs text-[var(--text-secondary)]">
            มีบัญชีผู้ใช้แล้ว?{' '}
            <Link
              href="/login"
              className="text-brass-400 font-semibold hover:underline"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--text-muted)]">
          <Link href="/privacy" className="hover:underline flex items-center gap-1">
            <Icon name="ShieldCheck" size={13} />
            <span>นโยบายความเป็นส่วนตัว</span>
          </Link>
          <span>•</span>
          <Link href="/help" className="hover:underline flex items-center gap-1">
            <Icon name="CircleHelp" size={13} />
            <span>ศูนย์ช่วยเหลือ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
