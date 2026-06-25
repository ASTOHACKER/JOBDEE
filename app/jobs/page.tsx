import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <h1 className="text-2xl font-medium tracking-tight mb-8">หางานทั้งหมด</h1>

        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <div key={job.id} className="glass-panel p-6 rounded-xl hover:border-gray-700 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-medium text-white mb-1">{job.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{job.location || "ไม่ระบุสถานที่"}</p>
                  <p className="text-xs text-[var(--color-accent)] font-medium mb-4">
                    {job.salary ? `${Number(job.salary).toLocaleString()} บาท/เดือน` : "ตามตกลง"}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-6">{job.description || "ไม่มีรายละเอียดเพิ่มเติม"}</p>
                </div>
                <Link href={`/jobs/${job.id}`} className="block text-center py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white hover:bg-white/10 transition-all duration-200">
                  ดูรายละเอียดงาน
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-panel rounded-xl">
            <p className="text-sm text-gray-400">ยังไม่มีตำแหน่งงานที่ประกาศในขณะนี้</p>
            <p className="text-xs text-gray-600 mt-2">บริษัทสามารถลงประกาศตำแหน่งงานได้จากแดชบอร์ด</p>
          </div>
        )}
      </main>
    </>
  );
}
