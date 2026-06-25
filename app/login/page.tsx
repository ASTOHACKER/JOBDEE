"use client";

import { useActionState } from "react";
import { signIn, signInWithGoogle } from "../actions";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="text-xl font-semibold text-[var(--color-primary)]">JOBDEE</Link>
          <h1 className="text-2xl font-semibold mt-4">เข้าสู่ระบบ</h1>
          <p className="text-sm text-gray-500 mt-1">เข้าสู่ระบบเพื่อจัดการประวัติและสมัครงาน</p>
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
            <input name="password" type="password" required className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={pending} className="w-full p-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50">
            {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="relative text-center">
          <span className="text-xs text-gray-600 bg-[#09090b] px-3 relative z-10">หรือ</span>
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
        </div>

        <form action={signInWithGoogle}>
          <button type="submit" className="w-full p-3 glass-panel rounded-lg text-sm font-medium hover:border-gray-600 transition-colors">
            เข้าสู่ระบบด้วย Google
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          ยังไม่มีบัญชี? <Link href="/register" className="text-[var(--color-primary)] hover:underline">สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  );
}
