"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  initialQ?: string;
  initialLoc?: string;
  initialCat?: string;
  initialMode?: string;
  initialMinSalary?: string;
}

export default function JobSearchSidebar({
  initialQ = "",
  initialLoc = "all",
  initialCat = "all",
  initialMode = "all",
  initialMinSalary = "",
}: SidebarProps) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [loc, setLoc] = useState(initialLoc);
  const [cat, setCat] = useState(initialCat);
  const [mode, setMode] = useState(initialMode);
  const [minSalary, setMinSalary] = useState(initialMinSalary);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (loc && loc !== "all") params.set("loc", loc);
    if (cat && cat !== "all") params.set("cat", cat);
    if (mode && mode !== "all") params.set("mode", mode);
    if (minSalary) params.set("min_salary", minSalary);

    router.push(`/jobs?${params.toString()}`);
  };

  const labelClass = "text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1.5 block font-semibold tracking-wider";
  const selectClass = "w-full p-2.5 bg-white dark:bg-[#121214] border border-gray-350 dark:border-gray-800/65 text-gray-900 dark:text-white rounded-lg outline-none text-xs focus:ring-2 focus:ring-[var(--color-primary)] transition-all cursor-pointer";
  const inputClass = "w-full p-2.5 bg-white dark:bg-[#121214] border border-gray-350 dark:border-gray-800/65 text-gray-900 dark:text-white rounded-lg outline-none text-xs focus:ring-2 focus:ring-[var(--color-primary)] transition-all";

  return (
    <div className="glass-panel p-6 rounded-xl space-y-5 sticky top-24">
      <div className="flex justify-between items-center border-b border-gray-200/20 dark:border-gray-800/40 pb-2.5">
        <h2 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          ค้นหาด่วน (Search Filter)
        </h2>
        {/* <span className="text-[9px] px-1.5 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold rounded uppercase">
          JobThai Style
        </span> */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. คำที่ต้องการค้นหา */}
        <div>
          <label className={labelClass}>คำที่ต้องการค้นหา</label>
          <div className="relative">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ระบุตำแหน่งงาน หรือชื่อบริษัท..."
              className={inputClass}
            />
          </div>
        </div>

        {/* 2. สถานที่ปฏิบัติงาน */}
        <div>
          <label className={labelClass}>สถานที่ปฏิบัติงาน</label>
          <select value={loc} onChange={(e) => setLoc(e.target.value)} className={selectClass}>
            <option value="all">ทั้งหมด (ทุกสถานที่)</option>
            <option value="กรุงเทพฯ">กรุงเทพมหานคร</option>
            <option value="สงขลา">สงขลา (หาดใหญ่)</option>
            <option value="เชียงใหม่">เชียงใหม่</option>
            <option value="ภูเก็ต">ภูเก็ต</option>
            <option value="Remote">Remote (ทำงานที่บ้าน)</option>
          </select>
        </div>

        {/* 3. ประเภทงาน */}
        <div>
          <label className={labelClass}>ประเภทงาน</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={selectClass}>
            <option value="all">ทั้งหมด (ทุกประเภทงาน)</option>
            <option value="Developer">ไอที / ซอฟต์แวร์ / Developer</option>
            <option value="Designer">ออกแบบ / UX/UI / กราฟิก</option>
            <option value="Marketing">การตลาด / โฆษณา</option>
            <option value="Engineer">งานวิศวกรรม / เทคนิค</option>
            <option value="Admin">งานบริการลูกค้า / Admin</option>
          </select>
        </div>

        {/* 4. รูปแบบการทำงาน (Radio Buttons เหมือน JobThai) */}
        <div>
          <label className={labelClass}>รูปแบบการทำงาน</label>
          <div className="space-y-2 pt-1">
            {[
              { id: "mode-all", value: "all", label: "ทั้งหมด" },
              { id: "mode-hybrid", value: "hybrid", label: "Hybrid Work" },
              { id: "mode-wfh", value: "wfh", label: "Work from Home (100%)" },
            ].map((item) => (
              <div key={item.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={item.id}
                  name="work_mode"
                  value={item.value}
                  checked={mode === item.value}
                  onChange={() => setMode(item.value)}
                  className="w-3.5 h-3.5 text-[var(--color-primary)] border-gray-350 dark:border-gray-800 bg-transparent focus:ring-[var(--color-primary)] cursor-pointer accent-[#6366f1]"
                />
                <label htmlFor={item.id} className="text-xs text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ค้นหาอย่างละเอียด (Advanced Search Toggle) */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] text-gray-500 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1 cursor-pointer select-none"
          >
            <span>{showAdvanced ? "▼ ซ่อนการค้นหาละเอียด" : "▶ ค้นหาอย่างละเอียด"}</span>
          </button>

          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-800/40 space-y-4">
              <div>
                <label className={labelClass}>เงินเดือนขั้นต่ำ (บาท/เดือน)</label>
                <input
                  type="number"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  placeholder="เช่น 30000"
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        {/* ปุ่มค้นหา */}
        <button
          type="submit"
          className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-lg text-xs transition-colors cursor-pointer text-center block shadow-sm hover:shadow"
        >
          ค้นหาตำแหน่งงาน
        </button>
      </form>
    </div>
  );
}
