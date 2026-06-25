import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const isCompany = profile?.role === "company";

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight">แผงควบคุมหลัก</h1>
          <p className="text-xs text-gray-500 mt-1.5">สวัสดีคุณ, {profile?.full_name || user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link href="/profile" className="glass-panel p-6 rounded-xl hover:border-gray-800 transition-all group">
            <h2 className="text-sm font-medium mb-1 text-white group-hover:text-[var(--color-primary)] transition-colors">ข้อมูลโปรไฟล์</h2>
            <p className="text-xs text-gray-500 leading-relaxed">เข้าไปดูใบสมัครงานและประวัติส่วนตัวของคุณ</p>
          </Link>

          {isCompany ? (
            <Link href="/company/dashboard" className="glass-panel p-6 rounded-xl hover:border-gray-800 transition-all group">
              <h2 className="text-sm font-medium mb-1 text-white group-hover:text-[var(--color-primary)] transition-colors">ลงประกาศงาน</h2>
              <p className="text-xs text-gray-500 leading-relaxed">เพิ่ม จัดการ และปิดการรับสมัครตำแหน่งงานของคุณ</p>
            </Link>
          ) : (
            <Link href="/jobs" className="glass-panel p-6 rounded-xl hover:border-gray-800 transition-all group">
              <h2 className="text-sm font-medium mb-1 text-white group-hover:text-[var(--color-primary)] transition-colors">ค้นหางาน</h2>
              <p className="text-xs text-gray-500 leading-relaxed">ค้นหาประกาศรับสมัครงานและส่งใบสมัครได้ทันที</p>
            </Link>
          )}

          <Link href="/profile/settings" className="glass-panel p-6 rounded-xl hover:border-gray-800 transition-all group">
            <h2 className="text-sm font-medium mb-1 text-white group-hover:text-[var(--color-primary)] transition-colors">ตั้งค่าบัญชี</h2>
            <p className="text-xs text-gray-500 leading-relaxed">เปลี่ยนอีเมล ปรับรหัสผ่าน หรือลบบัญชีผู้ใช้งาน</p>
          </Link>
        </div>
      </main>
    </>
  );
}
