import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { createJob } from "../../actions";
import Navbar from "@/components/Navbar";

export default async function CompanyDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium tracking-tight">แดชบอร์ดบริษัท</h1>
          <span className="text-xs text-gray-500">จัดการและลงประกาศงานของคุณ</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ฟอร์มลงประกาศ */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl h-fit">
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-5">ลงประกาศงานใหม่</h2>
            <form action={createJob} className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">ตำแหน่งงาน *</label>
                <input name="title" required className="input-field" placeholder="เช่น Software Engineer" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">รายละเอียดงาน</label>
                <textarea name="description" rows={4} className="input-field" placeholder="รายละเอียดหน้าที่ความรับผิดชอบ..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">เงินเดือน (บาท)</label>
                  <input name="salary" type="number" className="input-field" placeholder="ตามตกลง" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">สถานที่ทำงาน</label>
                  <input name="location" className="input-field" placeholder="เช่น กรุงเทพฯ / Remote" />
                </div>
              </div>
              <button type="submit" className="no-print w-full p-3 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer">
                ลงประกาศตำแหน่งนี้
              </button>
            </form>
          </div>

          {/* รายการงาน */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">ตำแหน่งงานที่เปิดรับ ({jobs?.length || 0})</h2>
            <div className="space-y-3">
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job.id} className="glass-panel p-5 rounded-xl flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-white">{job.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {job.location || "ไม่ระบุสถานที่"} • {job.salary ? `${Number(job.salary).toLocaleString()} บาท/เดือน` : "ตามตกลง"}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-950/30 border border-green-900/40 rounded text-[9px] text-green-400 font-medium">เปิดรับสมัคร</span>
                  </div>
                ))
              ) : (
                <div className="glass-panel p-8 rounded-xl text-center">
                  <p className="text-xs text-gray-500">คุณยังไม่ได้ลงประกาศตำแหน่งงานใดๆ</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
