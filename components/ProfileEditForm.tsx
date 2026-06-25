"use client";

import { useActionState, useEffect, useState } from "react";
import { updateProfile } from "@/app/actions";

interface ProfileEditFormProps {
  profile: any;
  fullData: any;
  sectionTitle: string;
  labelClass: string;
  inputClass: string;
}

export default function ProfileEditForm({
  profile,
  fullData,
  sectionTitle,
  labelClass,
  inputClass,
}: ProfileEditFormProps) {
  // ใช้ useActionState จัดการ state และ pending จาก Server Action
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      try {
        await updateProfile(formData);
        return { success: true, error: null };
      } catch (err: any) {
        return { success: false, error: err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
      }
    },
    null
  );

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (state) {
      if (state.success) {
        setToastMessage("บันทึกข้อมูลและอัปโหลดเรซูเมเรียบร้อยแล้ว!");
        setToastType("success");
        setShowToast(true);
      } else if (state.error) {
        setToastMessage(state.error);
        setToastType("error");
        setShowToast(true);
      }
    }
  }, [state]);

  // ซ่อน toast อัตโนมัติใน 4 วินาที
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <>
      {/* Pop-up Toast Alert */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-xs font-medium ${
              toastType === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            } backdrop-blur-md`}
          >
            {toastType === "success" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span>{toastMessage}</span>
            <button onClick={() => setShowToast(false)} className="ml-2 hover:opacity-80 cursor-pointer">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-8">
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
                ไฟล์ปัจจุบัน:{" "}
                <a
                  href={fullData.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  คลิกเพื่อเปิดดูไฟล์เรซูเม
                </a>
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
              <input
                name="full_name"
                required
                defaultValue={profile?.full_name || ""}
                className={inputClass}
                placeholder="เช่น สมชาย ใจดี"
              />
            </div>
            <div>
              <label className={labelClass}>เบอร์โทรศัพท์</label>
              <input
                name="phone"
                defaultValue={fullData.phone || ""}
                className={inputClass}
                placeholder="เช่น 0891234567"
              />
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
              <input
                name="nationality"
                defaultValue={fullData.nationality || ""}
                className={inputClass}
                placeholder="เช่น ไทย"
              />
            </div>
          </div>
        </div>

        {/* 2. ข้อมูลติดต่อและที่อยู่ */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className={sectionTitle}>ที่อยู่ติดต่อ</h2>
          <div>
            <label className={labelClass}>ที่อยู่ปัจจุบัน</label>
            <textarea
              name="address"
              defaultValue={fullData.address || ""}
              rows={2}
              className={inputClass}
              placeholder="เลขที่บ้าน ถนน ซอย..."
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>จังหวัด</label>
              <input
                name="province"
                defaultValue={fullData.province || ""}
                className={inputClass}
                placeholder="เช่น สงขลา"
              />
            </div>
            <div>
              <label className={labelClass}>อำเภอ / เขต</label>
              <input
                name="district"
                defaultValue={fullData.district || ""}
                className={inputClass}
                placeholder="เช่น หาดใหญ่"
              />
            </div>
            <div>
              <label className={labelClass}>รหัสไปรษณีย์</label>
              <input
                name="zipcode"
                defaultValue={fullData.zipcode || ""}
                className={inputClass}
                placeholder="เช่น 90110"
              />
            </div>
          </div>
        </div>

        {/* 3. งานที่ต้องการ */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className={sectionTitle}>ความต้องการในการทำงาน</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>ตำแหน่งงานที่คาดหวัง</label>
              <input
                name="desired_position"
                defaultValue={fullData.desired_position || ""}
                className={inputClass}
                placeholder="เช่น Full Stack Developer"
              />
            </div>
            <div>
              <label className={labelClass}>เงินเดือนที่ต้องการ (บาท)</label>
              <input
                name="desired_salary"
                type="number"
                defaultValue={fullData.desired_salary || ""}
                className={inputClass}
                placeholder="เช่น 35000"
              />
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
              <input
                name="institution"
                defaultValue={fullData.institution || ""}
                className={inputClass}
                placeholder="เช่น มหาวิทยาลัยสงขลานครินทร์"
              />
            </div>
            <div>
              <label className={labelClass}>คณะ / สาขาวิชา</label>
              <input
                name="field_of_study"
                defaultValue={fullData.field_of_study || ""}
                className={inputClass}
                placeholder="เช่น วิทยาการคอมพิวเตอร์"
              />
            </div>
          </div>
        </div>

        {/* 5. ประวัติการทำงาน (ถ้ามี) */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className={sectionTitle}>ประวัติการทำงานล่าสุด</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>ชื่อบริษัท/องค์กร</label>
              <input
                name="company_name"
                defaultValue={fullData.company_name || ""}
                className={inputClass}
                placeholder="เช่น JOBDEE Inc."
              />
            </div>
            <div>
              <label className={labelClass}>ตำแหน่งงาน</label>
              <input
                name="job_title"
                defaultValue={fullData.job_title || ""}
                className={inputClass}
                placeholder="เช่น Junior Developer"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>รายละเอียดหน้าที่งาน</label>
            <textarea
              name="job_description"
              defaultValue={fullData.job_description || ""}
              rows={3}
              className={inputClass}
              placeholder="อธิบายสั้นๆ เกี่ยวกับหน้าที่ของคุณ..."
            />
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
            <input
              name="portfolio"
              type="url"
              defaultValue={fullData.portfolio || ""}
              className={inputClass}
              placeholder="https://github.com/yourname"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="no-print w-full p-4 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer text-center block disabled:opacity-50"
        >
          {isPending ? "กำลังบันทึกข้อมูล..." : "บันทึกข้อมูลและอัปโหลดเรซูเมทั้งหมด"}
        </button>
      </form>
    </>
  );
}
