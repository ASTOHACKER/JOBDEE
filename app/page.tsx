import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import JobSearchSidebar from "@/components/JobSearchSidebar";

export default async function Home() {
  const supabase = await createClient();
  
  // 1. ดึงตำแหน่งงานจริง 6 ตำแหน่งล่าสุด
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(6);

  // 2. ดึงสถิติจริง
  const { count: jobsCount } = await supabase.from("jobs").select("*", { count: "exact", head: true });
  const { count: profilesCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });

  const topCompanies = [
    { name: "CP Axtra", logo: "CPA", industry: "ค้าปลีก/ส่ง" },
    { name: "CPF", logo: "CPF", industry: "เกษตรและอาหาร" },
    { name: "Lotus's", logo: "LTS", industry: "ห้างสรรพสินค้า" },
    { name: "Changan", logo: "CAG", industry: "ยานยนต์ไฟฟ้า" },
    { name: "Uniqlo", logo: "UQ", industry: "แฟชั่นเครื่องแต่งกาย" },
    { name: "DataFlow Co.", logo: "DFC", industry: "เทคโนโลยีและคลาวด์" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-100 transition-colors">
        
        {/* Layout แบบ JobThai: สองคอลัมน์ใหญ่ (Sidebar คัดกรองซ้าย + คอนเทนต์ขวา) */}
        <div className="container mx-auto px-4 py-8 max-w-6xl mt-12 flex-1 flex flex-col md:flex-row gap-6">
          
          {/* คอลัมน์ซ้าย: Sidebar ตัวกรองหางานละเอียด (สไตล์ JobThai) */}
          <aside className="w-full md:w-80 flex-shrink-0">
            <JobSearchSidebar />
          </aside>

          {/* คอลัมน์ขวา: แบนเนอร์ + ค้นหายอดฮิต + งานแนะนำ + บริษัทชั้นนำ */}
          <div className="flex-1 space-y-8">
            
            {/* ส่วนหัวแคมเปญ & คำค้นหายอดนิยม */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h1 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-white">
                หางานที่ใช่ เริ่มต้นง่ายๆ ที่ <span className="text-[var(--color-primary)]">JOBDEE</span>
              </h1>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
                เข้าถึงตำแหน่งงานจากกลุ่มธุรกิจชั้นนำ สมัครด้วยเรซูเมจริง หรือฝากประวัติส่วนตัวออนไลน์ได้รวดเร็วทันใจ
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider mr-1">ค้นหายอดนิยม:</span>
                {["Frontend", "React", "Remote", "สงขลา", "ElysiaJS", "PHP"].map((tag) => (
                  <Link 
                    key={tag} 
                    href={`/jobs?q=${tag}`}
                    className="px-2.5 py-1 bg-gray-200/50 dark:bg-white/5 border border-gray-300/30 dark:border-white/5 rounded text-[10px] text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* แบนเนอร์พิเศษ (แบบ JobThai) */}
            <div className="glass-panel rounded-xl overflow-hidden relative border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded text-[8px] font-semibold uppercase tracking-wider">
                  Featured Campaign
                </span>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">รับสมัครโปรแกรมเมอร์พูดภาษาจีน (Mandarin Speaker)</h3>
                <p className="text-xs text-gray-500">เงินเดือนเริ่มต้น 50,000 - 80,000 บาท/เดือน สัญญาจ้างระยะยาวพร้อมสวัสดิการครบครัน</p>
              </div>
              <Link 
                href="/jobs?q=Chinese" 
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center shrink-0"
              >
                ดูรายละเอียดงานนี้
              </Link>
            </div>

            {/* งานแนะนำสำหรับคุณ (ดึงจริง 6 ตำแหน่งล่าสุด) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">งานแนะนำล่าสุด</h2>
                <Link href="/jobs" className="text-[10px] text-[var(--color-primary)] hover:underline">
                  ดูตำแหน่งงานทั้งหมด →
                </Link>
              </div>

              {jobs && jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {jobs.map((job: any) => (
                    <Link 
                      key={job.id} 
                      href={`/jobs/${job.id}`}
                      className="glass-panel rounded-xl p-5 hover:border-gray-300 dark:hover:border-gray-800 transition-all cursor-pointer group flex flex-col justify-between h-44"
                    >
                      <div>
                        <span className="text-[8px] text-gray-400 uppercase tracking-wider block mb-1">New Posting</span>
                        <h3 className="text-xs font-medium text-gray-900 dark:text-white group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                          {job.profiles?.full_name || "ไม่ระบุชื่อบริษัท"} • {job.location || "ไม่ระบุสถานที่"}
                        </p>
                      </div>
                      <span className="text-[11px] text-[var(--color-accent)] font-medium mt-3">
                        {job.salary ? `${Number(job.salary).toLocaleString()} บาท/เดือน` : "ตามตกลง"}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 glass-panel rounded-xl">
                  <p className="text-xs text-gray-500">ยังไม่มีประกาศงานจริงในระบบในขณะนี้</p>
                </div>
              )}
            </div>

            {/* บริษัทชั้นนำ (Top Companies Grid - แบบ JobThai) */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">บริษัทชั้นนำร่วมงานกับเรา</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {topCompanies.map((comp) => (
                  <div key={comp.name} className="glass-panel p-4 rounded-xl text-center flex flex-col justify-center items-center h-28 group hover:border-gray-300 dark:hover:border-gray-800 transition-all cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-semibold mb-2 group-hover:scale-105 transition-transform">
                      {comp.logo}
                    </div>
                    <p className="text-[11px] font-medium text-gray-900 dark:text-white truncate w-full">{comp.name}</p>
                    <p className="text-[9px] text-gray-500 mt-0.5 truncate w-full">{comp.industry}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200/30 dark:border-gray-800/30 py-10 mt-12 bg-gray-100 dark:bg-[#060608]/50 transition-colors">
          <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            <p>© 2026 JOBDEE — แพลตฟอร์มหางานออนไลน์ครบวงจร</p>
            <p>พัฒนาโดย Narudom O-kart (PSU IT)</p>
          </div>
        </footer>

      </main>
    </>
  );
}
