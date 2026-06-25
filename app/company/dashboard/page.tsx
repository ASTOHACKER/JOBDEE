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
      <main className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-8">สำหรับบริษัท</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ฟอร์มลงประกาศ */}
          <div className="glass-panel p-5 rounded-xl">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">ลงประกาศงานใหม่</h2>
            <form action={createJob} className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">ตำแหน่งงาน *</label>
                <input name="title" required className="input-field" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">รายละเอียดงาน</label>
                <textarea name="description" rows={4} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">เงินเดือน (บาท)</label>
                  <input name="salary" type="number" className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">สถานที่ทำงาน</label>
                  <input name="location" className="input-field" />
                </div>
              </div>
              <button type="submit" className="w-full p-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
                ลงประกาศ
              </button>
            </form>
          </div>

          {/* รายการงาน */}
          <div>
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">งานที่ลงประกาศแล้ว ({jobs?.length || 0})</h2>
            <div className="space-y-3">
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job.id} className="glass-panel p-4 rounded-xl">
                    <h3 className="text-sm font-medium">{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {job.location || "ไม่ระบุสถานที่"} • {job.salary ? `${Number(job.salary).toLocaleString()} บาท` : "ตามตกลง"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">ยังไม่มีประกาศงาน</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
