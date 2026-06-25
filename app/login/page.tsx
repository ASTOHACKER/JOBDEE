"use client";

import { useActionState } from "react";
import { signIn, signInWithGoogle } from "../actions";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50 dark:bg-[#09090b] transition-colors">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="text-xl font-semibold text-[var(--color-primary)] tracking-tight">JOBDEE</Link>
          <h1 className="text-xl font-medium mt-4 text-gray-950 dark:text-white">เข้าสู่ระบบ</h1>
          <p className="text-xs text-gray-500 mt-1">เข้าสู่ระบบเพื่อจัดการประวัติและสมัครงาน</p>
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
            <input name="password" type="password" required className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={pending} className="w-full p-3 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 cursor-pointer">
            {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="relative text-center">
          <span className="text-[10px] text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-[#09090b] px-3 relative z-10 uppercase font-medium">หรือ</span>
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800"></div></div>
        </div>

        <form action={signInWithGoogle}>
          <button type="submit" className="w-full p-3 glass-panel rounded-lg text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer text-gray-700 dark:text-gray-300">
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
