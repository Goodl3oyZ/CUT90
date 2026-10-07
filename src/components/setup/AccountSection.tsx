'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Trash2, AlertTriangle, Check } from 'lucide-react';
import clsx from 'clsx';

export function AccountSection() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setPassMsg('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setPassMsg(data.error?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      }
    } catch {
      setPassMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch('/api/account', { method: 'DELETE' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#15202b] rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Change Password */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-cobalt-500" />
          <span>เปลี่ยนรหัสผ่าน</span>
        </h3>

        {passMsg && (
          <div
            className={clsx(
              'p-3 rounded-xl text-xs font-medium flex items-center gap-2',
              passMsg.includes('เรียบร้อย')
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
            )}
          >
            {passMsg.includes('เรียบร้อย') ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{passMsg}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              รหัสผ่านปัจจุบัน
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="h-10 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white font-medium text-xs transition-all"
          >
            อัปเดตรหัสผ่าน
          </button>
        </form>
      </div>

      {/* Delete Account */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <h3 className="font-semibold text-sm text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          <span>ลบบัญชีผู้ใช้</span>
        </h3>
        <p className="text-xs text-slate-500">
          การลบบัญชีจะลบข้อมูลประวัติ ประวัติการบันทึก และการตั้งค่าทั้งหมดของคุณถาวร ไม่สามารถกู้คืนได้
        </p>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="h-10 px-4 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-medium text-xs transition-all"
          >
            ลบบัญชีถาวร...
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-3">
            <div className="text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้?</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="h-9 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-all"
              >
                {deleting ? 'กำลังลบ...' : 'ยืนยันลบบัญชี'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="h-9 px-4 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
