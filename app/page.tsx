import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-6 pt-24 pb-20 text-center">
          <h1 className="text-4xl font-medium tracking-tight mb-4 text-gray-900 dark:text-white">
            หางานที่ใช่ เริ่มต้นที่ <span className="text-[var(--color-primary)]">JOBDEE</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-10 max-w-md mx-auto leading-relaxed">
            ค้นหาตำแหน่งงานจากบริษัทชั้นนำ ฝากประวัติ และสมัครงานได้ทันที
          </p>

          <div className="max-w-lg mx-auto flex gap-2">
            <input
              type="text"
              placeholder="ตำแหน่งงาน, บริษัท, หรือสถานที่..."
              className="input-field flex-1"
            />
            <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer">
              ค้นหา
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { number: "1,200+", label: "ตำแหน่งงาน" },
              { number: "350+", label: "บริษัท" },
              { number: "8,500+", label: "ผู้สมัครงาน" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-semibold text-[var(--color-primary)]">{stat.number}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Job Cards */}
        <section className="container mx-auto px-6 pb-24 max-w-5xl">
          <h2 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-6">งานแนะนำสำหรับคุณ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "Frontend Developer", company: "JOBDEE Inc.", location: "กรุงเทพฯ", salary: "35,000 - 55,000" },
              { title: "UX/UI Designer", company: "Creative Studio", location: "เชียงใหม่", salary: "30,000 - 45,000" },
              { title: "Backend Engineer", company: "DataFlow Co.", location: "Remote", salary: "40,000 - 70,000" },
            ].map((job) => (
              <div key={job.title} className="glass-panel rounded-xl p-6 hover:border-gray-300 dark:hover:border-gray-800 transition-all cursor-pointer group">
                <h3 className="text-sm font-medium mb-1 text-gray-900 dark:text-white group-hover:text-[var(--color-primary)] transition-colors">{job.title}</h3>
                <p className="text-xs text-gray-500">{job.company} • {job.location}</p>
                <p className="text-xs text-[var(--color-accent)] font-medium mt-4">{job.salary} บาท/เดือน</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200/30 dark:border-gray-800/30 py-10">
          <div className="container mx-auto px-6 flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            <p>© 2026 JOBDEE — แพลตฟอร์มหางานออนไลน์</p>
            <p>พัฒนาโดย Narudom O-kart</p>
          </div>
        </footer>
      </main>
    </>
  );
}
