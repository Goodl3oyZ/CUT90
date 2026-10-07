'use client';

import { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';

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
    <div className="bg-white dark:bg-[#15202b] rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <h3 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
        สำรองและกู้คืนข้อมูล (JSON Export / Import)
      </h3>

      {status && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          {status.includes('สำเร็จ') || status.includes('เรียบร้อย') ? (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500" />
          )}
          <span>{status}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Export */}
        <button
          onClick={handleExport}
          type="button"
          className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-cobalt-500" />
          <span>ส่งออกข้อมูล (JSON)</span>
        </button>

        {/* Import */}
        <label className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer">
          <Upload className="w-4 h-4 text-cobalt-500" />
          <span>นำเข้าข้อมูล (JSON)</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
