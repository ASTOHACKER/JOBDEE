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

  // ดึงประวัติการสมัครงาน (สำหรับผู้สมัครงาน)
  const { data: myApplications } = await supabase
    .from("applications")
    .select("*, jobs(*, profiles(full_name))")
    .eq("candidate_id", user.id)
    .order("applied_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight">แผงควบคุมหลัก</h1>
          <p className="text-xs text-gray-500 mt-1.5">สวัสดีคุณ, {profile?.full_name || user.email}</p>
        </div>

        {/* เมนูการจัดการหลัก */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <Link href="/profile" className="glass-panel p-6 rounded-xl hover:border-gray-800 transition-all group">
            <h2 className="text-sm font-medium mb-1 text-white group-hover:text-[var(--color-primary)] transition-colors">ข้อมูลโปรไฟล์</h2>
            <p className="text-xs text-gray-500 leading-relaxed">เข้าไปดูใบสมัครงานและประวัติส่วนตัวของคุณ</p>
          </Link>

          {isCompany ? (
            <Link href="/company/dashboard" className="glass-panel p-6 rounded-xl hover:border-gray-800 transition-all group">
              <h2 className="text-sm font-medium mb-1 text-white group-hover:text-[var(--color-primary)] transition-colors">แผงควบคุมบริษัท</h2>
              <p className="text-xs text-gray-500 leading-relaxed">ลงประกาศงาน และบริหารรายชื่อผู้สมัครรับเลือกเข้าทำงาน</p>
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

        {/* ตารางแสดงประวัติการสมัครงาน (Candidate Only) */}
        {!isCompany && (
          <div className="space-y-4">
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">ประวัติการสมัครงานของคุณ ({myApplications?.length || 0})</h2>
            <div className="space-y-3">
              {myApplications && myApplications.length > 0 ? (
                myApplications.map((app: any) => (
                  <div key={app.id} className="glass-panel p-5 rounded-xl flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-white">{app.jobs?.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {app.jobs?.profiles?.full_name || "ไม่ระบุบริษัท"} • {app.jobs?.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-medium ${
                        app.status === "accepted" ? "bg-green-950/40 border border-green-900/40 text-green-400" :
                        app.status === "rejected" ? "bg-red-950/40 border border-red-900/40 text-red-400" :
                        "bg-yellow-950/40 border border-yellow-900/40 text-yellow-400"
                      }`}>
                        {app.status === "accepted" ? "รับพิจารณาแล้ว" :
                         app.status === "rejected" ? "ปฏิเสธ" : "กำลังพิจารณา"}
                      </span>
                      <Link href={`/jobs/${app.jobs?.id}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                        ดูรายละเอียดงาน
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-panel p-8 rounded-xl text-center">
                  <p className="text-xs text-gray-500">คุณยังไม่มีประวัติการสมัครงานในระบบ</p>
                  <Link href="/jobs" className="text-xs text-[var(--color-primary)] hover:underline mt-2 inline-block">
                    ค้นหาและสมัครงานแรกของคุณเลย
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
