import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const fullData = profile?.full_data || {};

  const detailBlock = (title: string, value: string | undefined | null) => (
    value ? (
      <div>
        <span className="text-[10px] text-gray-500 uppercase block tracking-wider mb-1">{title}</span>
        <span className="text-xs text-gray-900 dark:text-gray-200">{value}</span>
      </div>
    ) : null
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-gray-950 dark:text-white">ข้อมูลประวัติส่วนตัว</h1>
          <p className="text-xs text-gray-500 mt-1">เรซูเมออนไลน์ของคุณสำหรับส่งให้บริษัทพิจารณา</p>
        </div>
        <Link href="/profile/edit" className="no-print px-4 py-2 bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-medium hover:bg-white/10 transition-all">
          แก้ไขประวัติ
        </Link>
      </div>

      <div className="space-y-6">
        {/* 1. ข้อมูลทั่วไป */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-base font-medium text-gray-900 dark:text-white">{profile?.full_name || "ยังไม่ได้กรอกชื่อ-นามสกุล"}</h2>
              <p className="text-xs text-[var(--color-primary)] mt-1 font-medium">{profile?.role === "candidate" ? "ผู้สมัครงาน" : "บริษัท"}</p>
            </div>
            {fullData.resume_url && (
              <a 
                href={fullData.resume_url} 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1.5 bg-[var(--color-primary)] text-white text-[10px] rounded font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                📄 เปิดดูไฟล์ PDF Resume
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200/20 dark:border-gray-800/40">
            {detailBlock("อีเมลติดต่อ", profile?.email)}
            {detailBlock("เบอร์โทรศัพท์", fullData.phone)}
            {detailBlock("เพศ", fullData.gender)}
            {detailBlock("วันเกิด", fullData.birthdate)}
            {detailBlock("สัญชาติ", fullData.nationality)}
          </div>
        </div>

        {/* 2. ที่อยู่ */}
        {(fullData.address || fullData.province) && (
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-wider">ที่อยู่ติดต่อ</h3>
            <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
              {[fullData.address, fullData.district, fullData.province, fullData.zipcode].filter(Boolean).join(", ")}
            </p>
          </div>
        )}

        {/* 3. ความต้องการงาน */}
        {(fullData.desired_position || fullData.desired_salary) && (
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-wider mb-4">ความต้องการงาน</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {detailBlock("ตำแหน่งงานที่คาดหวัง", fullData.desired_position)}
              {detailBlock("เงินเดือนที่ต้องการ", fullData.desired_salary ? `${Number(fullData.desired_salary).toLocaleString()} บาท/เดือน` : null)}
              {detailBlock("รูปแบบงาน", fullData.employment_type)}
              {detailBlock("พร้อมเริ่มงาน", fullData.available_date)}
            </div>
          </div>
        )}

        {/* 4. ประวัติการศึกษา */}
        {(fullData.institution || fullData.education_level) && (
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-wider mb-4">ประวัติการศึกษา</h3>
            <div className="grid grid-cols-2 gap-4">
              {detailBlock("สถาบัน", fullData.institution)}
              {detailBlock("คณะ/สาขา", fullData.field_of_study)}
              {detailBlock("ระดับการศึกษา", fullData.education_level)}
              {detailBlock("สถานะ", fullData.education_status)}
            </div>
          </div>
        )}

        {/* 5. ประวัติการทำงาน */}
        {(fullData.company_name || fullData.job_title) && (
          <div className="glass-panel p-6 rounded-xl space-y-3">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-wider">ประวัติการทำงานล่าสุด</h3>
            <div className="grid grid-cols-2 gap-4">
              {detailBlock("บริษัท/องค์กร", fullData.company_name)}
              {detailBlock("ตำแหน่ง", fullData.job_title)}
            </div>
            {fullData.job_description && (
              <div className="pt-2 border-t border-gray-200/10 dark:border-gray-800/20">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">รายละเอียดหน้าที่</span>
                <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{fullData.job_description}</p>
              </div>
            )}
          </div>
        )}

        {/* 6. ทักษะ */}
        {(fullData.skill_1 || fullData.skill_2 || fullData.skill_3 || fullData.skill_4 || fullData.portfolio) && (
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-wider">ทักษะและความสามารถ</h3>
            <div className="flex flex-wrap gap-2">
              {[fullData.skill_1, fullData.skill_2, fullData.skill_3, fullData.skill_4].filter(Boolean).map((skill, index) => (
                <span key={index} className="px-3 py-1.5 bg-gray-200/50 dark:bg-white/5 border border-gray-300/30 dark:border-white/5 rounded-lg text-xs font-medium text-gray-800 dark:text-gray-200">
                  {skill}
                </span>
              ))}
            </div>
            {fullData.portfolio && (
              <div className="pt-2 border-t border-gray-200/20 dark:border-gray-800/40">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">ผลงาน / ลิงก์แนบเพิ่มเติม</span>
                <a href={fullData.portfolio} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-primary)] hover:underline break-all">
                  {fullData.portfolio}
                </a>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
