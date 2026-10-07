import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1319] py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลัก</span>
        </Link>

        <div className="bg-white dark:bg-[#15202b] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cobalt-600" />
            <h1 className="font-brand font-bold text-2xl text-slate-900 dark:text-white">
              นโยบายความเป็นส่วนตัว (Privacy Policy)
            </h1>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            แอปพลิเคชัน <strong>Cut 90 Planner</strong> ให้ความสำคัญอย่างยิ่งกับความเป็นส่วนตัวและความปลอดภัยของข้อมูลสุขภาพของคุณ
          </p>

          <hr className="border-slate-100 dark:border-slate-800" />

          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              1. ข้อมูลสุขภาพที่เราจัดเก็บ
            </h2>
            <p>
              จัดเก็บข้อมูลร่างกายเบื้องต้น ได้แก่ เพศ อายุ ส่วนสูง น้ำหนักเริ่มต้น น้ำหนักเป้าหมาย ระดับกิจกรรม และข้อมูลบันทึกประจำวัน ได้แก่ น้ำหนักเช้า สารอาหาร (โปรตีน คาร์บ ไขมัน) และขนาดรอบเอว
            </p>

            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              2. สถานที่จัดเก็บข้อมูล
            </h2>
            <p>
              ข้อมูลทั้งหมดถูกจัดเก็บในฐานข้อมูล SQLite บนเซิร์ฟเวอร์ส่วนตัวของคุณ (หรือดิสก์ Docker Volume) โดยไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์ภายนอกหรือผู้ให้บริการบุคคลที่สามใดๆ
            </p>

            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              3. การส่งออกข้อมูล (Data Export)
            </h2>
            <p>
              คุณสามารถส่งออกข้อมูลทั้งหมดของคุณในรูปแบบไฟล์ JSON ได้ตลอดเวลาจากหน้า <strong>ตั้งค่า &gt; ส่งออกข้อมูล (JSON)</strong>
            </p>

            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              4. การลบข้อมูลและบัญชีผู้ใช้ (Data Deletion)
            </h2>
            <p>
              คุณสามารถลบบัญชีและประวัติการบันทึกทั้งหมดอย่างถาวรได้ทันทีจากหน้า <strong>ตั้งค่า &gt; ลบบัญชีผู้ใช้</strong> โดยระบบจะทำการลบข้อมูลทั้งหมดออกจากฐานข้อมูลทันที
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
