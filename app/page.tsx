import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-6 pt-20 pb-16 text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-3">
            หางานที่ใช่ เริ่มต้นที่ <span className="text-[var(--color-primary)]">JOBDEE</span>
          </h1>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            ค้นหาตำแหน่งงานจากบริษัทชั้นนำ ฝากประวัติ และสมัครงานได้ทันที
          </p>

          <div className="max-w-lg mx-auto flex gap-2">
            <input
              type="text"
              placeholder="ตำแหน่งงาน, บริษัท, หรือสถานที่..."
              className="input-field flex-1"
            />
            <button className="px-5 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
              ค้นหา
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-6 pb-12">
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { number: "1,200+", label: "ตำแหน่งงาน" },
              { number: "350+", label: "บริษัท" },
              { number: "8,500+", label: "ผู้สมัครงาน" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-semibold text-[var(--color-primary)]">{stat.number}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Job Cards */}
        <section className="container mx-auto px-6 pb-20">
          <h2 className="text-lg font-medium mb-6">งานแนะนำ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Frontend Developer", company: "JOBDEE Inc.", location: "กรุงเทพฯ", salary: "35,000 - 55,000" },
              { title: "UX/UI Designer", company: "Creative Studio", location: "เชียงใหม่", salary: "30,000 - 45,000" },
              { title: "Backend Engineer", company: "DataFlow Co.", location: "Remote", salary: "40,000 - 70,000" },
            ].map((job) => (
              <div key={job.title} className="glass-panel rounded-xl p-5 hover:border-[var(--color-primary)] transition-colors cursor-pointer group">
                <h3 className="font-medium mb-1 group-hover:text-[var(--color-primary)] transition-colors">{job.title}</h3>
                <p className="text-sm text-gray-400">{job.company} • {job.location}</p>
                <p className="text-sm text-[var(--color-accent)] font-medium mt-3">{job.salary} บาท/เดือน</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 py-8">
          <div className="container mx-auto px-6 flex justify-between items-center text-xs text-gray-500">
            <p>© 2026 JOBDEE — แพลตฟอร์มหางานออนไลน์</p>
            <p>พัฒนาโดย Narudom O-kart</p>
          </div>
        </footer>
      </main>
    </>
  );
}
