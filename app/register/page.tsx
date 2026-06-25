"use client";

import { useActionState } from "react";
import { signUp } from "../actions";
import Link from "next/link";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signUp, null);

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50 dark:bg-[#09090b] transition-colors">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="text-xl font-semibold text-[var(--color-primary)] tracking-tight">JOBDEE</Link>
          <h1 className="text-xl font-medium mt-4 text-gray-950 dark:text-white">สมัครสมาชิก</h1>
          <p className="text-xs text-gray-500 mt-1">สร้างบัญชีเพื่อเริ่มต้นหางานหรือลงประกาศ</p>
        </div>

        {state?.error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-xs text-center">
            {state.error}
          </div>
        )}

        <form action={action} className="glass-panel p-6 rounded-xl space-y-4">
          <div>
            <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">อีเมล</label>
            <input name="email" type="email" required className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">รหัสผ่าน</label>
            <input name="password" type="password" required className="input-field" placeholder="อย่างน้อย 6 ตัวอักษร" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">ประเภทบัญชี</label>
            <select name="role" required className="input-field">
              <option value="">เลือกประเภท</option>
              <option value="candidate">ผู้สมัครงาน</option>
              <option value="company">บริษัท / ผู้ประกอบการ</option>
            </select>
          </div>
          <button type="submit" disabled={pending} className="w-full p-3 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 cursor-pointer">
            {pending ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          มีบัญชีอยู่แล้ว? <Link href="/login" className="text-[var(--color-primary)] hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}
