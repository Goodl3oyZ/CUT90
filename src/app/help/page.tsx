'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { NavLayout } from '@/components/ui/NavLayout';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<'glossary' | 'faq' | 'install'>('glossary');

  return (
    <NavLayout>
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        <div className="border-b border-[var(--border-color)] pb-4">
          <h1 className="font-display font-bold text-2xl uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
            <Icon name="CircleHelp" size={24} className="text-brass-400" />
            <span>ศูนย์ช่วยเหลือ & คู่มือใช้งาน (Help & Guide)</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            อธิบายคลังศัพท์วิทยาศาสตร์ การแก้ไขปัญหา คำถามที่พบบ่อย และการติดตั้งแอปบนมือถือ
          </p>
        </div>

        {/* Category Selector Tabs */}
        <Tabs
          tabs={[
            { id: 'glossary', label: '1. คลังศัพท์ (Glossary)', icon: 'BookOpen' },
            { id: 'faq', label: '2. คำถามพบบ่อย (FAQ)', icon: 'HelpCircle' },
            { id: 'install', label: '3. ติดตั้งบนมือถือ (PWA Install)', icon: 'Smartphone' },
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as 'glossary' | 'faq' | 'install')}
        />

        {/* SECTION 1: GLOSSARY */}
        {activeTab === 'glossary' && (
          <div className="space-y-4">
            <Card variant="default" padding="md" className="space-y-4">
              <h2 className="font-display font-bold text-lg text-brass-400 flex items-center gap-2">
                <Icon name="BookOpen" size={20} />
                <span>คลังศัพท์วิทยาศาสตร์การเผาผลาญ (Glossary)</span>
              </h2>

              <div className="space-y-4 divide-y divide-[var(--border-color)] text-xs text-[var(--text-secondary)]">
                <div id="bmr" className="pt-3 space-y-1">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] font-mono">
                    BMR (Basal Metabolic Rate) - อัตราการเผาผลาญขั้นต่ำ
                  </h3>
                  <p className="leading-relaxed">
                    คือจำนวนพลังงาน (แคลอรี่) ขั้นต่ำที่สุดที่ร่างกายต้องการเพื่อใช้ในการพยุงอวัยวะภายในให้ทำงานและมีชีวิตรอดขณะพักผ่อน (เช่น การหายใจ การสูบฉีดเลือด การทำงานของสมอง) คำนวณโดยใช้สูตร Mifflin-St Jeor
                  </p>
                </div>

                <div id="tdee" className="pt-3 space-y-1">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] font-mono">
                    TDEE (Total Daily Energy Expenditure) - พลังงานเผาผลาญรวมต่อวัน
                  </h3>
                  <p className="leading-relaxed">
                    คือพลังงานทั้งหมดที่ร่างกายใช้จริงใน 1 วัน โดยเอา BMR มาคูณด้วยระดับกิจกรรมประจำวัน (Activity Multiplier 1.2 - 1.9) หากรับประทานอาหารเท่ากับ TDEE น้ำหนักจะคงที่
                  </p>
                </div>

                <div id="deficit" className="pt-3 space-y-1">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] font-mono">
                    Calorie Deficit - พลังงานติดลบสำหรับดึงไขมันมาใช้
                  </h3>
                  <p className="leading-relaxed">
                    คือสถานะที่ร่างกายได้รับพลังงานจากอาหารน้อยกว่า TDEE ทำให้ร่างกายต้องดึงพลังงานสำรองจากไขมันสะสมออกมาใช้ โดยการลดไขมัน 1 กิโลกรัม ต้องสร้าง Calorie Deficit สะสมรวมประมาณ 7,700 kcal
                  </p>
                </div>

                <div id="macros" className="pt-3 space-y-1">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] font-mono">
                    Macros (Protein, Carbohydrate, Fat) - สารอาหารหลัก
                  </h3>
                  <p className="leading-relaxed">
                    • <strong>โปรตีน (4 kcal/g):</strong> จำเป็นต่อการรักษาและซ่อมแซมมวลกล้ามเนื้อขณะลดไขมัน<br />
                    • <strong>คาร์โบไฮเดรต (4 kcal/g):</strong> แหล่งพลังงานหลักสำหรับสมองและการออกกำลังกาย<br />
                    • <strong>ไขมัน (9 kcal/g):</strong> จำเป็นต่อการสังเคราะห์ฮอร์โมนและการดูดซึมวิตามิน
                  </p>
                </div>

                <div id="7day-average" className="pt-3 space-y-1">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] font-mono">
                    7-Day Moving Average - ค่าเฉลี่ยน้ำหนัก 7 วัน
                  </h3>
                  <p className="leading-relaxed">
                    คือน้ำหนักเฉลี่ยย้อนหลัง 7 วันที่นำมาคำนวณเพื่อตัดสิ่งรบกวน (Noise) จากความผันผวนของน้ำในร่างกาย อาการบวมโซเดียม หรือปริมาณกากอาหารในลำไส้
                  </p>
                </div>

                <div id="recalibrate" className="pt-3 space-y-1">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] font-mono">
                    Recalibrate - การปรับคำนวณตั้งต้นแผนใหม่
                  </h3>
                  <p className="leading-relaxed">
                    การนำค่าน้ำหนักเฉลี่ย ณ วันปัจจุบัน มาคำนวณปรับจุดเริ่มใหม่สำหรับวันที่เหลืออยู่ ช่วยให้เป้าหมายโภชนาการสอดคล้องกับอัตราเผาผลาญจริงของร่างกายเสมอ
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* SECTION 2: FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <Card variant="default" padding="md" className="space-y-4">
              <h2 className="font-display font-bold text-lg text-brass-400 flex items-center gap-2">
                <Icon name="HelpCircle" size={20} />
                <span>คำถามที่พบบ่อย (Frequently Asked Questions)</span>
              </h2>

              <div className="space-y-4 divide-y divide-[var(--border-color)] text-xs text-[var(--text-secondary)]">
                <div className="pt-3 space-y-1">
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    1. ถ้าลืมบันทึกน้ำหนักหรืออาหารไป 1 วัน ต้องทำอย่างไร?
                  </h3>
                  <p className="leading-relaxed">
                    ไม่ต้องกังวล! ข้ามวันนั้นไปได้เลยและเริ่มบันทึกตามปกติในวันถัดไป อัลกอริทึม 7-Day Moving Average ของ Cut 90 ถูกออกแบบมาให้รับมือกับวันข้ามได้โดยไม่ทำให้แผนรวน
                  </p>
                </div>

                <div className="pt-3 space-y-1">
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    2. ทำไมน้ำหนักนิ่ง (Plateau) ติดต่อกัน 3-5 วัน ทั้งที่กินตามแผนเป๊ะ?
                  </h3>
                  <p className="leading-relaxed">
                    เป็นเรื่องปกติมาก! เกิดจากการสะสมน้ำในเซลล์ไขมันแทนที่ไขมันที่ถูกผลาญไป (Whoosh Effect) เมื่อผ่านไป 5-7 วัน ร่างกายจะขับน้ำออกและน้ำหนักจะลดลงวูบเดียว แนะนำให้ดูค่าเฉลี่ย 7 วันเป็นหลัก
                  </p>
                </div>

                <div className="pt-3 space-y-1">
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    3. ถ้ารู้สึกหิวมากระหว่างวัน ควรทำอย่างไร?
                  </h3>
                  <p className="leading-relaxed">
                    เพิ่มปริมาณผักใบเขียว ดื่มน้ำเปล่าเพิ่มขึ้น 500ml ก่อนมื้ออาหาร หรือปรับสัดส่วนโปรตีนให้สูงขึ้น (เช่น 2.2 - 2.4 g/kg) เพื่อเพิ่มความอิ่ม โดยที่พลังงานรวม kcal ยังเท่าเดิม
                  </p>
                </div>

                <div className="pt-3 space-y-1">
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    4. สูตรการคำนวณของ Cut 90 มีความแม่นยำแค่ไหน?
                  </h3>
                  <p className="leading-relaxed">
                    ใช้สูตร Mifflin-St Jeor ร่วมกับหลักการ 7,700 kcal/kg และข้อจำกัดความปลอดภัย 1.0% Bodyweight/week ซึ่งได้รับการยอมรับจากสมาคมโภชนาการและการกีฬาชั้นนำทั่วโลก
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* SECTION 3: PWA INSTALL GUIDE */}
        {activeTab === 'install' && (
          <div className="space-y-4">
            <Card variant="default" padding="md" className="space-y-4">
              <h2 className="font-display font-bold text-lg text-brass-400 flex items-center gap-2">
                <Icon name="Smartphone" size={20} />
                <span>วิธีติดตั้ง Cut 90 บนโทรศัพท์มือถือ (PWA Installation Guide)</span>
              </h2>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Cut 90 Planner เป็น Progressive Web App (PWA) ที่สามารถติดตั้งลงบนหน้าจอโฮมสกรีนมือถือของคุณได้เหมือนแอปแท้ ใช้งานได้แม้ออฟไลน์ และเปิดทำงานเต็มจออย่างราบรื่น
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* iOS Instructions */}
                <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
                    <Icon name="Apple" size={18} className="text-brass-400" />
                    <span>วิธีติดตั้งบน iPhone / iPad (iOS Safari)</span>
                  </div>
                  <ol className="text-xs text-[var(--text-secondary)] space-y-2 list-decimal list-inside leading-relaxed">
                    <li>เปิดเว็บไซต์ Cut 90 ผ่านเบราว์เซอร์ <strong>Safari</strong></li>
                    <li>กดปุ่ม <strong>แชร์ (Share)</strong> สัญลักษณ์รูปกล่องที่มีลูกศรชี้ขึ้น ที่แถบล่าง</li>
                    <li>เลื่อนลงมาแล้วเลือก <strong>"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)</strong></li>
                    <li>กดปุ่ม <strong>"เพิ่ม" (Add)</strong> ที่มุมขวาบน</li>
                    <li>ไอคอนแอป Cut 90 จะปรากฏบนหน้าจอมือถือของคุณทันที</li>
                  </ol>
                </div>

                {/* Android Instructions */}
                <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
                    <Icon name="Smartphone" size={18} className="text-brass-400" />
                    <span>วิธีติดตั้งบน Android (Google Chrome)</span>
                  </div>
                  <ol className="text-xs text-[var(--text-secondary)] space-y-2 list-decimal list-inside leading-relaxed">
                    <li>เปิดเว็บไซต์ Cut 90 ผ่านเบราว์เซอร์ <strong>Google Chrome</strong></li>
                    <li>กดปุ่มเมนู <strong>จุดสามจุด (⋮)</strong> ที่มุมขวาบน</li>
                    <li>เลือกเมนู <strong>"ติดตั้งแอป" (Install App)</strong> หรือ "เพิ่มไปยังหน้าจอหลัก"</li>
                    <li>กดปุ่ม <strong>"ติดตั้ง" (Install)</strong> ในหน้าต่างป๊อปอัปยืนยัน</li>
                    <li>ไอคอนแอป Cut 90 จะพร้อมใช้งานบนหน้าจอหลักทันที</li>
                  </ol>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Footer Return Link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-brass-400 font-semibold hover:underline"
          >
            <Icon name="ArrowLeft" size={14} />
            <span>กลับไปยังหน้าแดชบอร์ดหลัก (Today)</span>
          </Link>
        </div>
      </main>
    </NavLayout>
  );
}
