import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateProfile } from "../../actions";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, full_data")
    .eq("id", user.id)
    .single();

  const d = (profile?.full_data as Record<string, string>) || {};

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-medium tracking-tight">แก้ไขประวัติ</h1>
      
      <form action={updateProfile} className="space-y-6">

        {/* ข้อมูลส่วนตัว */}
        <section className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">ข้อมูลส่วนตัว</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">ชื่อ-นามสกุล *</label>
              <input name="full_name" defaultValue={profile?.full_name || ""} required className="input-field" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">เบอร์โทรศัพท์ *</label>
              <input name="phone" defaultValue={d.phone || ""} required className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">เพศ</label>
              <select name="gender" defaultValue={d.gender || ""} className="input-field">
                <option value="">เลือก</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">วันเกิด</label>
              <input name="birthdate" type="date" defaultValue={d.birthdate || ""} className="input-field" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">สัญชาติ</label>
              <input name="nationality" defaultValue={d.nationality || "ไทย"} className="input-field" />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">ที่อยู่ปัจจุบัน</label>
            <textarea name="address" defaultValue={d.address || ""} rows={2} className="input-field" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">จังหวัด *</label>
              <input name="province" defaultValue={d.province || ""} className="input-field" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">อำเภอ *</label>
              <input name="district" defaultValue={d.district || ""} className="input-field" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">รหัสไปรษณีย์</label>
              <input name="zipcode" defaultValue={d.zipcode || ""} className="input-field" />
            </div>
          </div>
        </section>

        {/* ตำแหน่งที่ต้องการ */}
        <section className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">ตำแหน่งงานที่ต้องการ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">ตำแหน่ง *</label>
              <input name="desired_position" defaultValue={d.desired_position || ""} className="input-field" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">เงินเดือนที่ต้องการ (บาท)</label>
              <input name="desired_salary" type="number" defaultValue={d.desired_salary || ""} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">ประเภทการจ้างงาน</label>
              <select name="employment_type" defaultValue={d.employment_type || ""} className="input-field">
                <option value="">เลือก</option>
                <option value="fulltime">ประจำ</option>
                <option value="freelance">ฟรีแลนซ์</option>
                <option value="parttime">พาร์ทไทม์</option>
                <option value="intern">ฝึกงาน</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">วันที่สามารถเริ่มงานได้</label>
              <input name="available_date" type="date" defaultValue={d.available_date || ""} className="input-field" />
            </div>
          </div>
        </section>

        {/* การศึกษา */}
        <section className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">การศึกษา</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">สถานภาพ</label>
              <select name="education_status" defaultValue={d.education_status || ""} className="input-field">
                <option value="">เลือก</option>
                <option value="graduated">จบการศึกษา</option>
                <option value="studying">กำลังศึกษา</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">ระดับการศึกษา</label>
              <select name="education_level" defaultValue={d.education_level || ""} className="input-field">
                <option value="">เลือก</option>
                <option value="below_high_school">ต่ำกว่ามัยมศึกษา</option>
                <option value="high_school">มัธยมศึกษา / ปวช.</option>
                <option value="diploma">อนุปริญญา / ปวส.</option>
                <option value="bachelor">ปริญญาตรี</option>
                <option value="master">ปริญญาโท</option>
                <option value="doctorate">ปริญญาเอก</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">สถาบันการศึกษา</label>
            <input name="institution" defaultValue={d.institution || ""} className="input-field" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">สาขาวิชา</label>
            <input name="field_of_study" defaultValue={d.field_of_study || ""} className="input-field" />
          </div>
        </section>

        {/* ประสบการณ์ */}
        <section className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">ประสบการณ์ทำงาน</h2>
          <div>
            <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">ชื่อบริษัท</label>
            <input name="company_name" defaultValue={d.company_name || ""} className="input-field" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">ตำแหน่งงาน</label>
            <input name="job_title" defaultValue={d.job_title || ""} className="input-field" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">รายละเอียดงาน</label>
            <textarea name="job_description" defaultValue={d.job_description || ""} rows={3} className="input-field" />
          </div>
        </section>

        {/* ทักษะ */}
        <section className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">ทักษะและความสามารถ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input name="skill_1" defaultValue={d.skill_1 || ""} placeholder="ทักษะที่ 1" className="input-field" />
            <input name="skill_2" defaultValue={d.skill_2 || ""} placeholder="ทักษะที่ 2" className="input-field" />
            <input name="skill_3" defaultValue={d.skill_3 || ""} placeholder="ทักษะที่ 3" className="input-field" />
            <input name="skill_4" defaultValue={d.skill_4 || ""} placeholder="ทักษะที่ 4" className="input-field" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase mb-1.5 block">โครงการ / ผลงาน / ลิงก์ Portfolio</label>
            <textarea name="portfolio" defaultValue={d.portfolio || ""} rows={3} className="input-field" />
          </div>
        </section>

        <button type="submit" className="no-print w-full p-3.5 bg-[var(--color-primary)] text-white rounded-xl text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer">
          บันทึกข้อมูลทั้งหมด
        </button>
      </form>
    </div>
  );
}
