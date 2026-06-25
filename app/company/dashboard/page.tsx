import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { createJob, updateJob, deleteJob, updateApplicationStatus } from "../../actions";
import Navbar from "@/components/Navbar";

export default async function CompanyDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 1. ดึงตำแหน่งงานทั้งหมดของบริษัท
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", user.id)
    .order("created_at", { ascending: false });

  // 2. ดึงใบสมัครงานทั้งหมดที่มีคนส่งเข้ามาในงานของบริษัทนี้
  const { data: apps } = await supabase
    .from("applications")
    .select("*, jobs!inner(*), profiles:candidate_id(full_name, email)")
    .eq("jobs.company_id", user.id)
    .order("applied_at", { ascending: false });

  const inputClass = "w-full p-3 bg-gray-200/40 dark:bg-white/5 border border-gray-300/30 dark:border-white/5 rounded-lg focus:ring-2 focus:ring-[#6366f1] outline-none text-sm text-gray-900 dark:text-white";

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium tracking-tight">แดชบอร์ดบริษัท</h1>
          <span className="text-xs text-gray-500">จัดการตำแหน่งงานและผู้สมัคร</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* คอลัมน์ 1: ฟอร์มลงประกาศ & จัดการงาน (CRUD) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-xl h-fit">
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-5">ลงประกาศงานใหม่</h2>
              <form action={createJob} className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">ตำแหน่งงาน *</label>
                  <input name="title" required className={inputClass} placeholder="เช่น Backend Engineer" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">รายละเอียดงาน</label>
                  <textarea name="description" rows={4} className={inputClass} placeholder="รายละเอียดหน้าที่งาน..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">เงินเดือน (บาท)</label>
                    <input name="salary" type="number" className={inputClass} placeholder="ตามตกลง" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">สถานที่ทำงาน</label>
                    <input name="location" className={inputClass} placeholder="เช่น Remote" />
                  </div>
                </div>
                <button type="submit" className="no-print w-full p-3 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer">
                  ลงประกาศตำแหน่งนี้
                </button>
              </form>
            </div>
          </div>

          {/* คอลัมน์ 2: รายชื่อตำแหน่งงานที่เปิดรับ (แก้ไข/ลบ) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">ตำแหน่งงานที่เปิดรับ ({jobs?.length || 0})</h2>
            <div className="space-y-3">
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job.id} className="glass-panel p-5 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {job.location || "ไม่ระบุสถานที่"} • {job.salary ? `${Number(job.salary).toLocaleString()} บาท` : "ตามตกลง"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-800/20 dark:border-gray-800/40">
                      {/* ฟอร์มลบงาน */}
                      <form action={deleteJob} className="w-1/2">
                        <input type="hidden" name="id" value={job.id} />
                        <button type="submit" className="w-full py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 rounded text-[10px] font-medium cursor-pointer transition-all">
                          ลบตำแหน่งนี้
                        </button>
                      </form>
                      {/* ลิงก์ไปดูรายละเอียดจริง */}
                      <a href={`/jobs/${job.id}`} className="w-1/2 text-center py-2 bg-white/5 border border-white/10 rounded text-[10px] font-medium text-gray-300 hover:bg-white/10 transition-all">
                        ดูหน้ารายละเอียด
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-panel p-6 rounded-xl text-center">
                  <p className="text-xs text-gray-500">ยังไม่มีตำแหน่งงานในระบบ</p>
                </div>
              )}
            </div>
          </div>

          {/* คอลัมน์ 3: รายชื่อผู้สมัครงาน (เฝ้าติดตาม/จัดการ Status) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">ใบสมัครงานที่ได้รับ ({apps?.length || 0})</h2>
            <div className="space-y-3">
              {apps && apps.length > 0 ? (
                apps.map((app: any) => (
                  <div key={app.id} className="glass-panel p-5 rounded-xl space-y-3">
                    <div>
                      <span className="text-[9px] font-medium uppercase px-2 py-0.5 bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 rounded">
                        {app.jobs?.title}
                      </span>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                        {app.profiles?.full_name || "ไม่ระบุชื่อผู้สมัคร"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{app.profiles?.email}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-800/20 dark:border-gray-800/40">
                      {/* อัปเดตสถานะใบสมัคร */}
                      <form action={updateApplicationStatus} className="flex gap-2 w-full">
                        <input type="hidden" name="application_id" value={app.id} />
                        <select 
                          name="status" 
                          defaultValue={app.status}
                          className="flex-1 p-1.5 bg-gray-200/50 dark:bg-white/5 border border-gray-300/30 dark:border-white/5 rounded text-[10px] text-gray-900 dark:text-white focus:outline-none"
                        >
                          <option value="pending">กำลังพิจารณา</option>
                          <option value="accepted">รับพิจารณา</option>
                          <option value="rejected">ปฏิเสธ</option>
                        </select>
                        <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-medium rounded cursor-pointer transition-all">
                          อัปเดต
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-panel p-6 rounded-xl text-center">
                  <p className="text-xs text-gray-500">ยังไม่มีผู้สมัครงานส่งใบสมัครเข้ามา</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
