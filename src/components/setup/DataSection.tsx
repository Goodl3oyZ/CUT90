'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export function DataSection() {
  const [status, setStatus] = useState<string | null>(null);

  const handleExport = async () => {
    setStatus('กำลังส่งออกข้อมูล...');
    try {
      const res = await fetch('/api/export');
      if (!res.ok) throw new Error('Export failed');
      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cut90_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus('ส่งออกข้อมูลเรียบร้อยแล้ว');
    } catch {
      setStatus('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('กำลังนำเข้าข้อมูล...');
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });

      if (res.ok) {
        setStatus('นำเข้าข้อมูลสำเร็จ! กำลังโหลดหน้าใหม่...');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const err = await res.json();
        setStatus(err.error?.message || 'ไฟล์นำเข้าไม่ถูกต้อง');
      }
    } catch {
      setStatus('รูปแบบไฟล์ JSON ไม่ถูกต้อง');
    }
  };

  return (
    <Card variant="default" padding="md" className="space-y-4">
      <h2 className="font-display font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
        <Icon name="Download" size={18} className="text-brass-400" />
        <span>สำรองและกู้คืนข้อมูล (JSON Backup)</span>
      </h2>

      {status && (
        <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)] flex items-center gap-2">
          <Icon
            name={status.includes('สำเร็จ') || status.includes('เรียบร้อย') ? 'Check' : 'AlertCircle'}
            size={16}
            className="text-brass-400"
          />
          <span>{status}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          type="button"
          onClick={handleExport}
          variant="secondary"
          size="md"
          leftIcon={<Icon name="Download" size={16} />}
        >
          ส่งออกข้อมูล (JSON Export)
        </Button>

        <label className="inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-color)] h-11 px-4 text-sm gap-2 cursor-pointer select-none">
          <Icon name="Upload" size={16} className="text-brass-400" />
          <span>นำเข้าข้อมูล (JSON Import)</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </Card>
  );
}
