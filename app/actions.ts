"use server";

import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ---- Auth ----

export async function signUp(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } },
  });

  if (error) return { error: error.message };
  redirect("/login");
}

export async function signIn(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };
  redirect("/");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
  if (data.url) redirect(data.url);
}

// ---- Profile ----

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const full_name = formData.get("full_name") as string;
  
  // รวบรวมฟิลด์ทั้งหมดจากฟอร์ม
  const full_data = {
    phone: formData.get("phone") as string,
    gender: formData.get("gender") as string,
    birthdate: formData.get("birthdate") as string,
    nationality: formData.get("nationality") as string,
    address: formData.get("address") as string,
    province: formData.get("province") as string,
    district: formData.get("district") as string,
    zipcode: formData.get("zipcode") as string,
    desired_position: formData.get("desired_position") as string,
    desired_salary: formData.get("desired_salary") as string,
    employment_type: formData.get("employment_type") as string,
    available_date: formData.get("available_date") as string,
    education_status: formData.get("education_status") as string,
    education_level: formData.get("education_level") as string,
    institution: formData.get("institution") as string,
    field_of_study: formData.get("field_of_study") as string,
    company_name: formData.get("company_name") as string,
    job_title: formData.get("job_title") as string,
    job_description: formData.get("job_description") as string,
    skill_1: formData.get("skill_1") as string,
    skill_2: formData.get("skill_2") as string,
    skill_3: formData.get("skill_3") as string,
    skill_4: formData.get("skill_4") as string,
    portfolio: formData.get("portfolio") as string,
  };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, full_data })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/profile/edit");
  revalidatePath("/profile");
}

// ---- Jobs (Company) ----

export async function createJob(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("jobs").insert({
    company_id: user.id,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    salary: Number(formData.get("salary")) || null,
    location: formData.get("location") as string,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/company/dashboard");
  revalidatePath("/jobs");
}
