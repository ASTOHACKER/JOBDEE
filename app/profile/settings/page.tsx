import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">ตั้งค่าบัญชีผู้ใช้</h1>
      <p className="text-sm text-gray-500 mb-6">{user.email}</p>

      <div className="space-y-3">
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">เปลี่ยนอีเมล</h2>
            <p className="text-xs text-gray-500 mt-0.5">อัปเดตอีเมลใหม่ เพื่อใช้สมัครงาน</p>
          </div>
          <span className="text-[var(--color-primary)] text-xs cursor-pointer hover:underline">เปลี่ยน</span>
        </div>

        <div className="glass-panel p-5 rounded-xl flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">เปลี่ยนรหัสผ่าน</h2>
            <p className="text-xs text-gray-500 mt-0.5">เพิ่มความปลอดภัยให้บัญชีของคุณ</p>
          </div>
          <span className="text-[var(--color-primary)] text-xs cursor-pointer hover:underline">เปลี่ยน</span>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-800/50">
        <button className="text-red-500 text-xs hover:underline">ลบบัญชีผู้ใช้</button>
      </div>
    </div>
  );
}
