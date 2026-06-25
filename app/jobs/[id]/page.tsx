import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!job) notFound();

  const { data: company } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", job.company_id)
    .single();

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <Link href="/jobs" className="no-print text-xs text-gray-500 hover:text-gray-300 mb-6 inline-block transition-colors">
          ← ย้อนกลับไปหน้ารายการงาน
        </Link>

        <div className="glass-panel p-8 rounded-xl space-y-6">
          <div>
            <h1 className="text-xl font-medium tracking-tight mb-2 text-white">{job.title}</h1>
            <p className="text-xs text-gray-500">
              {company?.full_name || "ไม่ระบุชื่อบริษัท"} • {job.location || "ไม่ระบุสถานที่"}
            </p>
          </div>

          <div className="border-t border-gray-800/40 pt-5">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">ผลตอบแทน</span>
            <span className="text-base font-medium text-[var(--color-accent)]">
              {job.salary ? `${Number(job.salary).toLocaleString()} บาท/เดือน` : "ตามตกลง"}
            </span>
          </div>

          {job.description && (
            <div className="border-t border-gray-800/40 pt-5">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2">รายละเอียดงาน</span>
              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}

          <div className="no-print border-t border-gray-800/40 pt-6">
            <button className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-all cursor-pointer">
              ส่งใบสมัครงาน
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
