import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateProfile } from "../../actions";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const fullData = profile?.full_data || {};

  const sectionTitle = "text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200/20 dark:border-gray-800/40 pb-2";
  const labelClass = "text-[10px] text-gray-500 uppercase mb-1.5 block";
  const inputClass = "w-full p-3 bg-gray-200/40 dark:bg-white/5 border border-gray-300/30 dark:border-white/5 rounded-lg focus:ring-2 focus:ring-[#6366f1] outline-none text-sm text-gray-900 dark:text-white";

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium tracking-tight">แก้ไขข้อมูลประวัติส่วนตัว</h1>
        <span className="text-xs text-gray-500">ข้อมูลทั้งหมดจะแสดงในเรซูเมของคุณ</span>
      </div>

      <form action={updateProfile} className="space-y-8" encType="multipart/form-data">
        {/* ซ่อน URL ของเรซูเมเดิมไว้เพื่อไม่ให้หายไปถ้าผู้ใช้ไม่ได้อัปโหลดใหม่ */}
        <input type="hidden" name="existing_resume_url" value={fullData.resume_url || ""} />

        {/* 0. อัปโหลดไฟล์ PDF */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className={sectionTitle}>เอกสารเรซูเม (PDF)</h2>
          <div>
            <label className={labelClass}>แนบไฟล์เรซูเม (จำกัดเฉพาะ .pdf เท่านั้น)</label>
            <input 
              name="resume" 
              type="file" 
              accept=".pdf" 
              className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[var(--color-primary)] file:text-white hover:file:bg-[var(--color-primary-hover)] file:cursor-pointer" 
            />
            {fullData.resume_url && (
              <p className="text-xs text-gray-400 mt-3">
                ไฟล์ปัจจุบัน: <a href={fullData.resume_url} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:underline">คลิกเพื่อเปิดดูไฟล์เรซูเม</a>
              </p>
            )}
          </div>
        </div>

        {/* 1. ข้อมูลส่วนตัว */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className={sectionTitle}>ข้อมูลส่วนตัวทั่วไป</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>ชื่อ-นามสกุล *</label>
              <input name="full_name" required defaultValue={profile?.full_name || ""} className={inputClass} placeholder="เช่น สมชาย ใจดี" />
            </div>
            <div>
              <label className={labelClass}>เบอร์โทรศัพท์</label>
              <input name="phone" defaultValue={fullData.phone || ""} className={inputClass} placeholder="เช่น 0891234567" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>เพศ</label>
              <select name="gender" defaultValue={fullData.gender || ""} className={inputClass}>
                <option value="">เลือกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>วันเกิด</label>
              <input name="birthdate" type="date" defaultValue={fullData.birthdate || ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>สัญชาติ</label>
              <input name="nationality" defaultValue={fullData.nationality || ""} className={inputClass} placeholder="เช่น ไทย" />
            </div>
          </div>
        </div>

        {/* 2. ข้อมูลติดต่อและที่อยู่ */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className={sectionTitle}>ที่อยู่ติดต่อ</h2>
          <div>
            <label className={labelClass}>ที่อยู่ปัจจุบัน</label>
            <textarea name="address" defaultValue={fullData.address || ""} rows={2} className={inputClass} placeholder="เลขที่บ้าน ถนน ซอย..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>จังหวัด</label>
              <input name="province" defaultValue={fullData.province || ""} className={inputClass} placeholder="เช่น สงขลา" />
            </div>
            <div>
              <label className={labelClass}>อำเภอ / เขต</label>
              <input name="district" defaultValue={fullData.district || ""} className={inputClass} placeholder="เช่น หาดใหญ่" />
            </div>
            <div>
              <label className={labelClass}>รหัสไปรษณีย์</label>
              <input name="zipcode" defaultValue={fullData.zipcode || ""} className={inputClass} placeholder="เช่น 90110" />
            </div>
          </div>
        </div>

        {/* 3. งานที่ต้องการ */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className={sectionTitle}>ความต้องการในการทำงาน</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>ตำแหน่งงานที่คาดหวัง</label>
              <input name="desired_position" defaultValue={fullData.desired_position || ""} className={inputClass} placeholder="เช่น Full Stack Developer" />
            </div>
            <div>
              <label className={labelClass}>เงินเดือนที่ต้องการ (บาท)</label>
              <input name="desired_salary" type="number" defaultValue={fullData.desired_salary || ""} className={inputClass} placeholder="เช่น 35000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>รูปแบบการทำงาน</label>
              <select name="employment_type" defaultValue={fullData.employment_type || ""} className={inputClass}>
                <option value="">เลือกรูปแบบ</option>
                <option value="งานประจำ">งานประจำ</option>
                <option value="งานพาร์ทไทม์">งานพาร์ทไทม์</option>
                <option value="ฟรีแลนซ์">ฟรีแลนซ์</option>
                <option value="ฝึกงาน">ฝึกงาน</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>วันที่พร้อมเริ่มงาน</label>
              <input name="available_date" type="date" defaultValue={fullData.available_date || ""} className={inputClass} />
            </div>
          </div>
        </div>

        {/* 4. ประวัติการศึกษา */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className={sectionTitle}>ประวัติการศึกษา</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>สถานภาพการศึกษา</label>
              <select name="education_status" defaultValue={fullData.education_status || ""} className={inputClass}>
                <option value="">เลือกสถานภาพ</option>
                <option value="จบการศึกษาแล้ว">จบการศึกษาแล้ว</option>
                <option value="กำลังศึกษาอยู่">กำลังศึกษาอยู่</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>ระดับการศึกษาสูงสุด</label>
              <select name="education_level" defaultValue={fullData.education_level || ""} className={inputClass}>
                <option value="">เลือกระดับการศึกษา</option>
                <option value="มัธยมศึกษาตอนปลาย">มัธยมศึกษาตอนปลาย / ปวช.</option>
                <option value="อนุปริญญา">อนุปริญญา / ปวสน.</option>
                <option value="ปริญญาตรี">ปริญญาตรี</option>
                <option value="ปริญญาโท">ปริญญาโท</option>
                <option value="ปริญญาเอก">ปริญญาเอก</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>สถาบันการศึกษา</label>
              <input name="institution" defaultValue={fullData.institution || ""} className={inputClass} placeholder="เช่น มหาวิทยาลัยสงขลานครินทร์" />
            </div>
            <div>
              <label className={labelClass}>คณะ / สาขาวิชา</label>
              <input name="field_of_study" defaultValue={fullData.field_of_study || ""} className={inputClass} placeholder="เช่น วิทยาการคอมพิวเตอร์" />
            </div>
          </div>
        </div>

        {/* 5. ประวัติการทำงาน (ถ้ามี) */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className={sectionTitle}>ประวัติการทำงานล่าสุด</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>ชื่อบริษัท/องค์กร</label>
              <input name="company_name" defaultValue={fullData.company_name || ""} className={inputClass} placeholder="เช่น JOBDEE Inc." />
            </div>
            <div>
              <label className={labelClass}>ตำแหน่งงาน</label>
              <input name="job_title" defaultValue={fullData.job_title || ""} className={inputClass} placeholder="เช่น Junior Developer" />
            </div>
          </div>
          <div>
            <label className={labelClass}>รายละเอียดหน้าที่งาน</label>
            <textarea name="job_description" defaultValue={fullData.job_description || ""} rows={3} className={inputClass} placeholder="อธิบายสั้นๆ เกี่ยวกับหน้าที่ของคุณ..." />
          </div>
        </div>

        {/* 6. ทักษะความสามารถ (Skills) */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className={sectionTitle}>ทักษะและความสามารถ</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>ทักษะที่ 1</label>
              <input name="skill_1" defaultValue={fullData.skill_1 || ""} className={inputClass} placeholder="เช่น React / Next.js" />
            </div>
            <div>
              <label className={labelClass}>ทักษะที่ 2</label>
              <input name="skill_2" defaultValue={fullData.skill_2 || ""} className={inputClass} placeholder="เช่น TypeScript" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>ทักษะที่ 3</label>
              <input name="skill_3" defaultValue={fullData.skill_3 || ""} className={inputClass} placeholder="เช่น Node.js / ElysiaJS" />
            </div>
            <div>
              <label className={labelClass}>ทักษะที่ 4</label>
              <input name="skill_4" defaultValue={fullData.skill_4 || ""} className={inputClass} placeholder="เช่น SQL / Supabase" />
            </div>
          </div>
          <div className="pt-2">
            <label className={labelClass}>ผลงาน / ลิงก์แนบเพิ่มเติม (Portfolio Link)</label>
            <input name="portfolio" type="url" defaultValue={fullData.portfolio || ""} className={inputClass} placeholder="https://github.com/yourname" />
          </div>
        </div>

        <button type="submit" className="no-print w-full p-4 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer text-center block">
          บันทึกข้อมูลและอัปโหลดเรซูเมทั้งหมด
        </button>
      </form>
    </div>
  );
}
