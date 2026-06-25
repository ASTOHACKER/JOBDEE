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

  // 2. ดึงข้อมูลบริษัทผู้ลงประกาศ
  const { data: company } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", job.company_id)
    .single();

  const companyData = company?.full_data || {};

  // 3. ตรวจสอบว่าผู้สมัครล็อกอินและสมัครงานนี้ไปแล้วหรือยัง
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

  // แยกรายละเอียดงานออกเป็นส่วนๆ หรือเตรียมข้อมูล Mockup ที่ดูสมจริงหากคำอธิบายสั้นเกินไป
  const jobDesc = job.description || "ไม่มีการระบุรายละเอียดหน้าที่งานเพิ่มเติม";

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl mt-12">
        
        {/* Navigation & Actions แถวบน */}
        <div className="no-print flex justify-between items-center mb-6">
          <Link href="/jobs" className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1.5 transition-colors">
            <span>←</span> ย้อนกลับไปหน้ารายการงาน
          </Link>
          
          <button 
            onClick={() => typeof window !== "undefined" && window.print()}
            className="px-3 py-1.5 bg-white/5 border border-gray-250/20 dark:border-gray-800/40 rounded-lg text-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer uppercase tracking-wider font-medium"
          >
            🖨️ พิมพ์หน้านี้ / บันทึก PDF
          </button>
        </div>

        {/* Layout หลัก: แบ่งเป็น คอนเทนต์งานซ้าย (70%) + ข้อมูลบริษัทขวา (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* คอลัมน์ซ้าย: รายละเอียดตำแหน่งงานแบบจัดเต็ม */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* กล่องหัวข้อประกาศงาน */}
            <div className="glass-panel p-6 md:p-8 rounded-xl space-y-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <span className="px-2 py-0.5 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] rounded text-[9px] font-semibold uppercase tracking-wider">
                    Featured Position
                  </span>
                  <h1 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-white">{job.title}</h1>
                  <p className="text-xs text-gray-500 font-medium">
                    🏢 {company?.full_name || "ไม่ระบุชื่อบริษัท"} • 📍 {job.location || "ไม่ระบุสถานที่ปฏิบัติงาน"}
                  </p>
                </div>

                {hasApplied && (
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider shrink-0 ${
                    application.status === "accepted" ? "bg-green-950/30 border border-green-900/30 text-green-400" :
                    application.status === "rejected" ? "bg-red-950/30 border border-red-900/30 text-red-400" :
                    "bg-yellow-950/30 border border-yellow-900/30 text-yellow-400"
                  }`}>
                    {application.status === "accepted" ? "● รับพิจารณาแล้ว" :
                     application.status === "rejected" ? "● ปฏิเสธการพิจารณา" : "● กำลังพิจารณาใบสมัคร"}
                  </span>
                )}
              </div>

              {/* Grid ข้อมูลหลักของงาน (Job Info Grid) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200/10 dark:border-gray-850/40">
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-semibold">อัตราเงินเดือน</span>
                  <span className="text-sm font-semibold text-[var(--color-accent)]">
                    {job.salary ? `${Number(job.salary).toLocaleString()} บาท` : "ตามตกลง"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-semibold">รูปแบบการทำงาน</span>
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-300">
                    {job.location?.toLowerCase().includes("remote") ? "Remote Work" : 
                     job.location?.toLowerCase().includes("hybrid") ? "Hybrid Work" : "ทำงานที่ออฟฟิศ"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-semibold">จำนวนที่รับ</span>
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-300">1 อัตรา</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-semibold">วันที่ลงประกาศ</span>
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-300">
                    {new Date(job.created_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            {/* รายละเอียดงาน */}
            <div className="glass-panel p-6 md:p-8 rounded-xl space-y-6">
              <div>
                <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200/10 dark:border-gray-850/40 pb-2">
                  รายละเอียดหน้าที่ความรับผิดชอบ
                </h2>
                <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {jobDesc}
                </div>
              </div>

              {/* คุณสมบัติพื้นฐาน (จำลองเพิ่มเพื่อให้ดูเป็นใบประกาศงานมืออาชีพ) */}
              <div>
                <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200/10 dark:border-gray-850/40 pb-2">
                  คุณสมบัติผู้สมัครพื้นฐาน
                </h2>
                <ul className="list-disc list-inside text-xs text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
                  <li>ไม่จำกัดเพศ อายุ 22 ปีขึ้นไป (ยินดีรับนักศึกษาจบใหม่)</li>
                  <li>วุฒิการศึกษาระดับปริญญาตรีขึ้นไป ในสาขาคอมพิวเตอร์ เทคโนโลยีสารสนเทศ หรือสาขาที่เกี่ยวข้อง</li>
                  <li>มีความรับผิดชอบ มุ่งมั่นในการเรียนรู้สิ่งใหม่ๆ และทำงานร่วมกับผู้อื่นได้ดี</li>
                  <li>มีทักษะความรู้พื้นฐานตรงตามตำแหน่งที่ลงสมัคร</li>
                </ul>
              </div>

              {/* สวัสดิการทั่วไป */}
              <div>
                <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200/10 dark:border-gray-850/40 pb-2">
                  สวัสดิการของบริษัท
                </h2>
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">✓ ประกันสังคม / ประกันสุขภาพกลุ่ม</div>
                  <div className="flex items-center gap-2">✓ โบนัสประจำปี (ตามผลประกอบการ)</div>
                  <div className="flex items-center gap-2">✓ เวลาทำงานยืดหยุ่น (Flexible hours)</div>
                  <div className="flex items-center gap-2">✓ วันหยุดประจำปีและวันลาพักร้อน</div>
                </div>
              </div>
            </div>

          </div>

          {/* คอลัมน์ขวา: ข้อมูลบริษัทผู้รับสมัคร + ปุ่มกดควบคุมสมัครงาน */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* กล่องสมัครงาน (Apply Action Box) */}
            <div className="no-print glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-200/10 dark:border-gray-850/40 pb-2">
                สมัครงานตำแหน่งนี้
              </h3>
              
              {!user ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    คุณจำเป็นต้องเข้าสู่ระบบก่อนทำการส่งใบสมัครงานไปยังผู้ประกอบการ
                  </p>
                  <Link 
                    href={`/login?returnTo=/jobs/${job.id}`} 
                    className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-all cursor-pointer text-center block"
                  >
                    เข้าสู่ระบบเพื่อสมัครงาน
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    ระบบจะทำการส่งข้อมูลโปรไฟล์และเรซูเมล่าสุดของคุณไปยังบริษัทโดยตรงเพื่อพิจารณา
                  </p>
                  {hasApplied ? (
                    <form action={cancelApplication}>
                      <input type="hidden" name="application_id" value={application.id} />
                      <input type="hidden" name="job_id" value={job.id} />
                      <button type="submit" className="w-full py-3 bg-red-950/10 hover:bg-red-950/30 border border-red-900/40 text-red-400 rounded-lg text-xs font-medium transition-all cursor-pointer">
                        ยกเลิกใบสมัครงานนี้
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
              )}
            </div>

            {/* กล่องข้อมูลบริษัทผู้ว่าจ้าง (Employer Profile Card) */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-200/10 dark:border-gray-850/40 pb-2">
                ข้อมูลบริษัทผู้ว่าจ้าง
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {company?.full_name || "ไม่ระบุชื่อบริษัทเด่นชัด"}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {companyData.industry || "ธุรกิจเทคโนโลยีและสารสนเทศ"}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-gray-200/10 dark:border-gray-850/40 text-xs text-gray-600 dark:text-gray-400">
                  {company?.email && (
                    <div>
                      <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase block">อีเมลผู้ติดต่อ</span>
                      <span>{company.email}</span>
                    </div>
                  )}
                  {companyData.address && (
                    <div>
                      <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase block">ที่ตั้งบริษัท</span>
                      <span>{companyData.address} {companyData.province}</span>
                    </div>
                  )}
                  {companyData.portfolio && (
                    <div>
                      <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase block">เว็บไซต์บริษัท</span>
                      <a href={companyData.portfolio} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:underline break-all">
                        {companyData.portfolio}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </>
  );
}
