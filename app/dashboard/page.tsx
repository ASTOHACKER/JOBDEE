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
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-8">สวัสดี, {profile?.full_name || user.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/profile" className="glass-panel p-6 rounded-2xl hover:border-[#6366f1] border border-gray-800 transition-colors">
            <h2 className="font-medium mb-1">ข้อมูลส่วนตัว</h2>
            <p className="text-sm text-gray-400">ดูและแก้ไขข้อมูลโปรไฟล์</p>
          </Link>

          {isCompany ? (
            <Link href="/company/dashboard" className="glass-panel p-6 rounded-2xl hover:border-[#6366f1] border border-gray-800 transition-colors">
              <h2 className="font-medium mb-1">จัดการงาน</h2>
              <p className="text-sm text-gray-400">ลงประกาศและจัดการตำแหน่งงาน</p>
            </Link>
          ) : (
            <Link href="/jobs" className="glass-panel p-6 rounded-2xl hover:border-[#6366f1] border border-gray-800 transition-colors">
              <h2 className="font-medium mb-1">หางาน</h2>
              <p className="text-sm text-gray-400">ค้นหาและสมัครงานที่เหมาะกับคุณ</p>
            </Link>
          )}

          <Link href="/profile/settings" className="glass-panel p-6 rounded-2xl hover:border-[#6366f1] border border-gray-800 transition-colors">
            <h2 className="font-medium mb-1">ตั้งค่าบัญชี</h2>
            <p className="text-sm text-gray-400">เปลี่ยนอีเมล รหัสผ่าน</p>
          </Link>
        </div>
      </main>
    </>
  );
}
