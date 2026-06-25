import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import JobSearchSidebar from "@/components/JobSearchSidebar";

interface SearchParams {
  searchParams: Promise<{ 
    q?: string; 
    loc?: string; 
    cat?: string; 
    mode?: string; 
    min_salary?: string;
  }>;
}

export default async function JobsPage({ searchParams }: SearchParams) {
  const { 
    q = "", 
    loc = "all", 
    cat = "all", 
    mode = "all", 
    min_salary = "" 
  } = await searchParams;
  const supabase = await createClient();

  // สร้าง Query ดึงข้อมูลตำแหน่งงานจริง
  let query = supabase
    .from("jobs")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  // 1. ค้นหาคำหลัก (Title หรือ Description)
  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }
  
  // 2. คัดกรองตามสถานที่
  if (loc && loc !== "all") {
    query = query.ilike("location", `%${loc}%`);
  }
  
  // 3. คัดกรองตามประเภทงาน (ใน DB jobs ไม่มีคอลัมน์ category แต่เราใช้ filter จาก description/title ไปก่อนแบบ Smart)
  if (cat && cat !== "all") {
    query = query.or(`title.ilike.%${cat}%,description.ilike.%${cat}%`);
  }

  // 4. รูปแบบการทำงาน (Hybrid / Remote / All)
  if (mode === "hybrid") {
    query = query.or("location.ilike.%hybrid%,title.ilike.%hybrid%,description.ilike.%hybrid%");
  } else if (mode === "wfh") {
    query = query.or("location.ilike.%remote%,location.ilike.%wfh%,title.ilike.%remote%,description.ilike.%remote%");
  }

  // 5. คัดกรองเงินเดือนขั้นต่ำ
  if (min_salary) {
    query = query.gte("salary", Number(min_salary));
  }

  const { data: jobs } = await query;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-100 transition-colors">
        <div className="container mx-auto px-4 py-8 max-w-6xl mt-12 flex flex-col md:flex-row gap-6">
          
          {/* Sidebar ค้นหาละเอียดฝั่งซ้าย */}
          <aside className="w-full md:w-80 flex-shrink-0">
            <JobSearchSidebar 
              initialQ={q}
              initialLoc={loc}
              initialCat={cat}
              initialMode={mode}
              initialMinSalary={min_salary}
            />
          </aside>

          {/* รายการแสดงตำแหน่งงานฝั่งขวา */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h1 className="text-xl font-medium tracking-tight text-gray-950 dark:text-white">ตำแหน่งงานที่พบ</h1>
                <p className="text-xs text-gray-500 mt-0.5">คัดกรองตามความต้องการของคุณ</p>
              </div>
              <span className="text-xs text-gray-500 font-medium">พบทั้งหมด {jobs?.length || 0} ตำแหน่ง</span>
            </div>

            <div className="space-y-4">
              {jobs && jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job: any) => (
                    <div key={job.id} className="glass-panel rounded-xl p-6 hover:border-gray-300 dark:hover:border-gray-800 transition-all cursor-pointer group flex flex-col justify-between h-44">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium mb-1 text-gray-900 dark:text-white group-hover:text-[var(--color-primary)] transition-colors">
                            {job.title}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {job.profiles?.full_name || "ไม่ระบุชื่อบริษัท"} • {job.location || "ไม่ระบุสถานที่"}
                        </p>
                        {job.description && (
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2.5 line-clamp-2 leading-relaxed">
                            {job.description}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-250/10 dark:border-gray-850/10">
                        <span className="text-xs text-[var(--color-accent)] font-medium">
                          {job.salary ? `${Number(job.salary).toLocaleString()} บาท/เดือน` : "ตามตกลง"}
                        </span>
                        <Link href={`/jobs/${job.id}`} className="text-[10px] uppercase font-medium text-gray-400 group-hover:text-white transition-colors">
                          ดูรายละเอียด →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 glass-panel rounded-xl">
                  <p className="text-xs text-gray-500">ไม่พบตำแหน่งงานที่ตรงตามเงื่อนไขการค้นหาของคุณ</p>
                  <Link href="/jobs" className="text-xs text-[var(--color-primary)] hover:underline mt-2 inline-block">
                    ล้างตัวกรองทั้งหมด
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
