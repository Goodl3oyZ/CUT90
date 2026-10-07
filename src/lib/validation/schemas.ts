import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร')
    .max(32, 'ชื่อผู้ใช้ต้องไม่เกิน 32 ตัวอักษร')
    .regex(/^[a-z0-9_]+$/i, 'ชื่อผู้ใช้ใช้ได้เฉพาะ a-z, 0-9 และ _'),
  password: z
    .string()
    .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
    .max(128, 'รหัสผ่านต้องไม่เกิน 128 ตัวอักษร'),
  inviteCode: z.string().optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'กรุณากรอกชื่อผู้ใช้'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'กรุณากรอกรหัสผ่านปัจจุบัน'),
  newPassword: z
    .string()
    .min(8, 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร')
    .max(128, 'รหัสผ่านใหม่ต้องไม่เกิน 128 ตัวอักษร'),
});

export const profileSchema = z.object({
  sex: z.enum(['male', 'female'], {
    invalid_type_error: 'กรุณาเลือกเพศ',
  }),
  age: z
    .number()
    .int('อายุต้องเป็นจำนวนเต็ม')
    .min(10, 'อายุต้องอย่างน้อย 10 ปี')
    .max(120, 'อายุไม่เกิน 120 ปี'),
  heightCm: z
    .number()
    .min(100, 'ส่วนสูงต้องอย่างน้อย 100 ซม.')
    .max(250, 'ส่วนสูงไม่เกิน 250 ซม.'),
  startWeight: z
    .number()
    .min(30, 'น้ำหนักเริ่มต้นอย่างน้อย 30 กก.')
    .max(300, 'น้ำหนักเริ่มต้นไม่เกิน 300 กก.'),
  goalWeight: z
    .number()
    .min(30, 'น้ำหนักเป้าหมายอย่างน้อย 30 กก.')
    .max(300, 'น้ำหนักเป้าหมายไม่เกิน 300 กก.'),
  activity: z.enum(['sedentary', 'lightly', 'moderately', 'very', 'extremely']),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'รูปแบบวันที่ต้องเป็น YYYY-MM-DD'),
  proteinGPerKg: z.number().min(0.5).max(4.0).default(2.1),
  fatGPerKg: z.number().min(0.2).max(2.0).default(0.8),
  recalDay: z.number().int().min(1).max(90).nullable().optional(),
  recalWeight: z.number().min(30).max(300).nullable().optional(),
});

export const dailyLogSchema = z.object({
  day: z.number().int().min(1).max(90),
  weightKg: z.number().min(30).max(300).nullable().optional(),
  proteinG: z.number().int().min(0).max(2000).nullable().optional(),
  carbG: z.number().int().min(0).max(2000).nullable().optional(),
  fatG: z.number().int().min(0).max(2000).nullable().optional(),
  waistCm: z.number().min(30).max(250).nullable().optional(),
  updatedAt: z.number().optional(),
});

export const importSchema = z.object({
  profile: profileSchema,
  logs: z.array(dailyLogSchema),
});
