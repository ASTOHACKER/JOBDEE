import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileEditForm from "@/components/ProfileEditForm";

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

      <ProfileEditForm
        profile={profile}
        fullData={fullData}
        sectionTitle={sectionTitle}
        labelClass={labelClass}
        inputClass={inputClass}
      />
    </div>
  );
}
