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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">โปรไฟล์</h1>
        <Link href="/profile/edit" className="px-4 py-2 bg-[var(--color-primary)] rounded-lg text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
          แก้ไขข้อมูล
        </Link>
      </div>

      <div className="glass-panel p-5 rounded-xl mb-5">
        <h2 className="text-lg font-medium">{profile?.full_name || "ยังไม่ได้ระบุชื่อ"}</h2>
        <p className="text-xs text-gray-500 mt-1">{profile?.role === "company" ? "บริษัท" : "ผู้สมัครงาน"}</p>
      </div>

      <div className="glass-panel p-5 rounded-xl">
        {fields.map((f, i) => (
          <div key={f.label} className={`flex justify-between py-3 ${i < fields.length - 1 ? "border-b border-gray-800/50" : ""}`}>
            <span className="text-sm text-gray-500">{f.label}</span>
            <span className="text-sm font-medium">{f.value || <span className="text-gray-600">ไม่ได้ระบุ</span>}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
