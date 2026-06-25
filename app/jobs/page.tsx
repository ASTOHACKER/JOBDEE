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
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">หางาน</h1>

        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="glass-panel p-6 rounded-2xl hover:border-[#6366f1] border border-gray-800 transition-colors">
                <h3 className="text-lg font-medium mb-2">{job.title}</h3>
                <p className="text-sm text-gray-400 mb-1">{job.location || "ไม่ระบุสถานที่"}</p>
                <p className="text-sm text-[#10b981] font-medium mb-4">
                  {job.salary ? `${Number(job.salary).toLocaleString()} บาท/เดือน` : "ตามตกลง"}
                </p>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{job.description || ""}</p>
                <Link href={`/jobs/${job.id}`} className="block text-center py-2 border border-[#6366f1] rounded-lg text-[#6366f1] text-sm hover:bg-[#6366f1] hover:text-white transition-colors">
                  ดูรายละเอียด
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">ยังไม่มีประกาศงานในระบบ</p>
            <p className="text-sm mt-2">บริษัทสามารถลงประกาศได้ที่หน้า สำหรับบริษัท</p>
          </div>
        )}
      </main>
    </>
  );
}
