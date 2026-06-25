"use client";

import { useActionState, useState } from "react";
import { updateEmail, updatePassword } from "../../actions";

export default function SettingsPage() {
  const [emailState, emailAction, emailPending] = useActionState(updateEmail, null);
  const [passState, passAction, passPending] = useActionState(updatePassword, null);

  const [activeForm, setActiveForm] = useState<"none" | "email" | "password">("none");

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-medium tracking-tight">ตั้งค่าบัญชีผู้ใช้</h1>

      <div className="space-y-4">
        {/* ส่วนเปลี่ยนอีเมล */}
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-white">เปลี่ยนอีเมล</h2>
              <p className="text-xs text-gray-500 mt-1">อัปเดตอีเมลใหม่สำหรับล็อกอินและสมัครงาน</p>
            </div>
            <button 
              onClick={() => setActiveForm(activeForm === "email" ? "none" : "email")}
              className="text-xs text-[var(--color-primary)] hover:underline cursor-pointer"
            >
              {activeForm === "email" ? "ปิด" : "แก้ไข"}
            </button>
          </div>

          {activeForm === "email" && (
            <form action={emailAction} className="mt-5 pt-5 border-t border-gray-800/40 space-y-4 max-w-sm">
              {emailState?.error && (
                <p className="text-xs text-red-400 bg-red-950/20 p-2.5 rounded border border-red-900/30 text-center">{emailState.error}</p>
              )}
              {emailState?.success && (
                <p className="text-xs text-green-400 bg-green-950/20 p-2.5 rounded border border-green-900/30 text-center">{emailState.success}</p>
              )}
              <div>
                <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">อีเมลใหม่</label>
                <input name="email" type="email" required className="input-field" placeholder="new-email@example.com" />
              </div>
              <button type="submit" disabled={emailPending} className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50">
                {emailPending ? "กำลังบันทึก..." : "อัปเดตอีเมล"}
              </button>
            </form>
          )}
        </div>

        {/* ส่วนเปลี่ยนรหัสผ่าน */}
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-white">เปลี่ยนรหัสผ่าน</h2>
              <p className="text-xs text-gray-500 mt-1">เพิ่มความปลอดภัยให้บัญชีผู้ใช้งานของคุณ</p>
            </div>
            <button 
              onClick={() => setActiveForm(activeForm === "password" ? "none" : "password")}
              className="text-xs text-[var(--color-primary)] hover:underline cursor-pointer"
            >
              {activeForm === "password" ? "ปิด" : "แก้ไข"}
            </button>
          </div>

          {activeForm === "password" && (
            <form action={passAction} className="mt-5 pt-5 border-t border-gray-800/40 space-y-4 max-w-sm">
              {passState?.error && (
                <p className="text-xs text-red-400 bg-red-950/20 p-2.5 rounded border border-red-900/30 text-center">{passState.error}</p>
              )}
              {passState?.success && (
                <p className="text-xs text-green-400 bg-green-950/20 p-2.5 rounded border border-green-900/30 text-center">{passState.success}</p>
              )}
              <div>
                <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">รหัสผ่านใหม่</label>
                <input name="password" type="password" required className="input-field" placeholder="อย่างน้อย 6 ตัวอักษร" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">ยืนยันรหัสผ่านใหม่</label>
                <input name="confirm_password" type="password" required className="input-field" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={passPending} className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50">
                {passPending ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
