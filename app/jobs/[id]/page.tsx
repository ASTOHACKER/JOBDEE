import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { applyJob, cancelApplication } from "../../actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  // 1. ดึงรายละเอียดงาน
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!job) notFound();

  // 2. ดึงข้อมูลบริษัท
  const { data: company } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", job.company_id)
    .single();

  // 3. ตรวจสอบว่าสมัครงานนี้ไปแล้วหรือยัง
  let hasApplied = false;
  let application: any = null;

  if (user) {
    const { data: appData } = await supabase
      .from("applications")
      .select("*")
      .eq("job_id", id)
      .eq("candidate_id", user.id)
      .maybeSingle();

    if (appData) {
      hasApplied = true;
      application = appData;
    }
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <Link href="/jobs" className="no-print text-xs text-gray-500 hover:text-gray-300 mb-6 inline-block transition-colors">
          ← ย้อนกลับไปหน้ารายการงาน
        </Link>

        <div className="glass-panel p-8 rounded-xl space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-medium tracking-tight mb-2 text-white">{job.title}</h1>
              <p className="text-xs text-gray-500">
                {company?.full_name || "ไม่ระบุชื่อบริษัท"} • {job.location || "ไม่ระบุสถานที่"}
              </p>
            </div>
            {hasApplied && (
              <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-medium ${
                application.status === "accepted" ? "bg-green-950/40 border border-green-900/40 text-green-400" :
                application.status === "rejected" ? "bg-red-950/40 border border-red-900/40 text-red-400" :
                "bg-yellow-950/40 border border-yellow-900/40 text-yellow-400"
              }`}>
                {application.status === "accepted" ? "รับพิจารณาแล้ว" :
                 application.status === "rejected" ? "ปฏิเสธ" : "กำลังพิจารณา"}
              </span>
            )}
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
            {hasApplied ? (
              <form action={cancelApplication}>
                <input type="hidden" name="application_id" value={application.id} />
                <input type="hidden" name="job_id" value={job.id} />
                <button type="submit" className="w-full py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 rounded-lg text-xs font-medium transition-all cursor-pointer">
                  ยกเลิกการสมัครงานนี้
                </button>
              </form>
            ) : (
              <form action={applyJob}>
                <input type="hidden" name="job_id" value={job.id} />
                <button type="submit" className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-all cursor-pointer">
                  ส่งใบสมัครงานทันที
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
