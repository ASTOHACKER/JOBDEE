import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="no-print border-b border-gray-800/50 bg-[#09090b]/95 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 h-14 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold tracking-tight text-[var(--color-primary)]">
          JOBDEE
        </Link>

        <div className="flex items-center gap-5 text-sm font-normal text-gray-400">
          <Link href="/jobs" className="hover:text-white transition-colors">หางาน</Link>

          {user ? (
            <>
              <Link href="/profile" className="hover:text-white transition-colors">ประวัติของฉัน</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <div className="h-3.5 w-px bg-gray-700" />
              <form action="/auth/signout" method="post">
                <button type="submit" className="text-gray-500 hover:text-red-400 transition-colors">ออกจากระบบ</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/profile/edit" className="hover:text-white transition-colors">ฝากประวัติ</Link>
              <Link href="/register" className="hover:text-white transition-colors">สมัครสมาชิก</Link>
              <Link href="/login" className="hover:text-white transition-colors">เข้าสู่ระบบ</Link>
              <div className="h-3.5 w-px bg-gray-700" />
              <Link href="/company/dashboard" className="text-[var(--color-primary)] hover:text-indigo-400 transition-colors font-medium">สำหรับบริษัท</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
