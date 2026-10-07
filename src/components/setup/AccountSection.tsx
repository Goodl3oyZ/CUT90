'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Sheet } from '@/components/ui/Sheet';
import clsx from 'clsx';

export function AccountSection() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState<string | null>(null);

  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
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
    <Card variant="default" padding="md" className="space-y-6">
      {/* Change Password */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
          <Icon name="KeyRound" size={18} className="text-brass-400" />
          <span>เปลี่ยนรหัสผ่าน (Change Password)</span>
        </h2>

        {passMsg && (
          <div
            className={clsx(
              'p-3.5 rounded-xl text-xs font-medium flex items-center gap-2',
              passMsg.includes('เรียบร้อย')
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
            )}
          >
            <Icon name={passMsg.includes('เรียบร้อย') ? 'Check' : 'AlertCircle'} size={16} />
            <span>{passMsg}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3">
          <Field
            label="รหัสผ่านปัจจุบัน"
            icon="KeyRound"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <Field
            label="รหัสผ่านใหม่"
            icon="Lock"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            helperText="ความยาวอย่างน้อย 8 ตัวอักษร"
          />

          <Button
            type="submit"
            variant="secondary"
            size="sm"
            leftIcon={<Icon name="Check" size={14} />}
          >
            อัปเดตรหัสผ่าน
          </Button>
        </form>
      </div>

      {/* Delete Account */}
      <div className="pt-6 border-t border-[var(--border-color)] space-y-3">
        <h3 className="font-display font-bold text-base text-rose-500 flex items-center gap-2">
          <Icon name="Trash2" size={18} />
          <span>จัดการบัญชีและข้อมูล</span>
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          การลบบัญชีผู้ใช้จะลบประวัติการบันทึก น้ำหนัก แผนผัง และการตั้งค่าทั้งหมดอย่างถาวร
        </p>

        <Button
          type="button"
          onClick={() => setShowDeleteSheet(true)}
          variant="danger"
          size="sm"
          leftIcon={<Icon name="Trash2" size={14} />}
        >
          ลบบัญชีผู้ใช้ถาวร...
        </Button>
      </div>

      <Sheet
        isOpen={showDeleteSheet}
        onClose={() => setShowDeleteSheet(false)}
        title="ยืนยันการลบบัญชีถาวร"
        subtitle="การกระทำนี้ไม่สามารถย้อนคืนได้ ข้อมูลทั้งหมดจะถูกลบทันที"
      >
        <div className="space-y-4">
          <p className="text-xs text-rose-400 font-medium">
            โปรดตรวจสอบให้แน่ใจว่าคุณได้สำรองข้อมูล (Export JSON) เรียบร้อยแล้วหากต้องการเก็บประวัติ
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => setShowDeleteSheet(false)}
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              variant="danger"
              size="md"
              fullWidth
              isLoading={deleting}
              onClick={handleDeleteAccount}
              leftIcon={<Icon name="Trash2" size={16} />}
            >
              ยืนยันลบบัญชี
            </Button>
          </div>
        </div>
      </Sheet>
    </Card>
  );
}
