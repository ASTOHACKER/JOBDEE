import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, full_data")
    .eq("id", user.id)
    .single();

  const d = (profile?.full_data as Record<string, string>) || {};

  const fields = [
    { label: "อีเมล", value: user.email },
    { label: "เบอร์โทร", value: d.phone },
    { label: "เพศ", value: d.gender === "male" ? "ชาย" : d.gender === "female" ? "หญิง" : undefined },
    { label: "สัญชาติ", value: d.nationality },
    { label: "ที่อยู่", value: d.address },
    { label: "จังหวัด", value: d.province },
    { label: "ตำแหน่งที่ต้องการ", value: d.desired_position },
    { label: "เงินเดือนที่ต้องการ", value: d.desired_salary ? `${Number(d.desired_salary).toLocaleString()} บาท` : undefined },
    { label: "สถาบันการศึกษา", value: d.institution },
    { label: "สาขาวิชา", value: d.field_of_study },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium tracking-tight">โปรไฟล์</h1>
        <Link href="/profile/edit" className="no-print px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/10 transition-all">
          แก้ไขข้อมูล
        </Link>
      </div>

      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-base font-medium text-white">{profile?.full_name || "ยังไม่ได้ระบุชื่อ"}</h2>
        <p className="text-xs text-gray-500 mt-1">{profile?.role === "company" ? "บริษัท" : "ผู้สมัครงาน"}</p>
      </div>

      <div className="glass-panel p-6 rounded-xl divide-y divide-gray-800/40">
        {fields.map((f) => (
          <div key={f.label} className="flex justify-between py-3.5 first:pt-0 last:pb-0">
            <span className="text-xs text-gray-500">{f.label}</span>
            <span className="text-xs font-normal text-gray-300">{f.value || <span className="text-gray-700">ไม่ได้ระบุ</span>}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
