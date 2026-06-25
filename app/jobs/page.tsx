import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

interface SearchParams {
  searchParams: Promise<{ q?: string; loc?: string }>;
}

export default async function JobsPage({ searchParams }: SearchParams) {
  const { q = "", loc = "" } = await searchParams;
  const supabase = await createClient();

  // สร้าง Query ดึงข้อมูลตำแหน่งงานจริง
  let query = supabase
    .from("jobs")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  // กรองข้อมูลตามที่ค้นหา (ถ้ามี)
  if (q) {
    query = query.ilike("title", `%${q}%`);
  }
  if (loc) {
    query = query.ilike("location", `%${loc}%`);
  }

  const { data: jobs } = await query;

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-xl font-medium tracking-tight text-gray-950 dark:text-white">ตำแหน่งงานทั้งหมด</h1>
            <p className="text-xs text-gray-500 mt-1">ค้นหาโอกาสงานใหม่และสมัครได้ทันที</p>
          </div>
          <span className="text-xs text-gray-500">{jobs?.length || 0} ตำแหน่งที่พบบนระบบ</span>
        </div>

        {/* ระบบ Filter & Search จริง */}
        <form method="GET" action="/jobs" className="no-print grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
          <input
            name="q"
            type="text"
            placeholder="ตำแหน่งงาน, บริษัท..."
            defaultValue={q}
            className="w-full p-3 bg-gray-200/40 dark:bg-white/5 border border-gray-300/30 dark:border-white/5 rounded-lg focus:ring-2 focus:ring-[#6366f1] outline-none text-xs text-gray-900 dark:text-white"
          />
          <input
            name="loc"
            type="text"
            placeholder="สถานที่ทำงาน..."
            defaultValue={loc}
            className="w-full p-3 bg-gray-200/40 dark:bg-white/5 border border-gray-300/30 dark:border-white/5 rounded-lg focus:ring-2 focus:ring-[#6366f1] outline-none text-xs text-gray-900 dark:text-white"
          />
          <button type="submit" className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer text-center">
            ค้นหางาน
          </button>
        </form>

        {/* ผลลัพธ์การค้นหา */}
        <div className="space-y-4">
          {jobs && jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {jobs.map((job: any) => (
                <div key={job.id} className="glass-panel rounded-xl p-6 hover:border-gray-300 dark:hover:border-gray-800 transition-all cursor-pointer group flex flex-col justify-between h-48">
                  <div>
                    <h3 className="text-sm font-medium mb-1 text-gray-900 dark:text-white group-hover:text-[var(--color-primary)] transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {job.profiles?.full_name || "ไม่ระบุชื่อบริษัท"} • {job.location || "ไม่ระบุสถานที่"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-[var(--color-accent)] font-medium">
                      {job.salary ? `${Number(job.salary).toLocaleString()} บาท` : "ตามตกลง"}
                    </span>
                    <Link href={`/jobs/${job.id}`} className="text-[10px] uppercase font-medium text-gray-400 group-hover:text-white transition-colors">
                      ดูรายละเอียด →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-panel rounded-xl">
              <p className="text-xs text-gray-500">ไม่พบข้อมูลตำแหน่งงานที่ค้นหา</p>
              <Link href="/jobs" className="text-xs text-[var(--color-primary)] hover:underline mt-2 inline-block">
                แสดงตำแหน่งงานทั้งหมด
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
