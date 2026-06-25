"use client";

import { useActionState } from "react";
import { signUp } from "../actions";
import Link from "next/link";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signUp, null);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="text-xl font-semibold text-[var(--color-primary)]">JOBDEE</Link>
          <h1 className="text-2xl font-semibold mt-4">สมัครสมาชิก</h1>
          <p className="text-sm text-gray-500 mt-1">สร้างบัญชีเพื่อเริ่มต้นหางานหรือลงประกาศ</p>
        </div>

        {state?.error && (
          <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-red-400 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={action} className="glass-panel p-6 rounded-xl space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">อีเมล</label>
            <input name="email" type="email" required className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">รหัสผ่าน</label>
            <input name="password" type="password" required className="input-field" placeholder="อย่างน้อย 6 ตัวอักษร" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">ประเภทบัญชี</label>
            <select name="role" required className="input-field">
              <option value="">เลือกประเภท</option>
              <option value="candidate">ผู้สมัครงาน</option>
              <option value="company">บริษัท / ผู้ประกอบการ</option>
            </select>
          </div>
          <button type="submit" disabled={pending} className="w-full p-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50">
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
