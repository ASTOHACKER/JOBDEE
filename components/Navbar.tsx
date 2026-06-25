import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="no-print border-b border-gray-800/30 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50 transition-all">
      <nav className="container mx-auto px-6 h-16 flex justify-between items-center">
        <Link href="/" className="text-lg font-medium tracking-tight text-[var(--color-primary)] hover:opacity-90 transition-opacity">
          JOBDEE
        </Link>

        <div className="flex items-center gap-6 text-xs font-normal text-gray-400">
          <Link href="/jobs" className="hover:text-gray-200 transition-colors">หางาน</Link>

          {user ? (
            <>
              <Link href="/profile" className="hover:text-gray-200 transition-colors">ประวัติของฉัน</Link>
              <Link href="/dashboard" className="hover:text-gray-200 transition-colors">Dashboard</Link>
              <span className="h-3 w-px bg-gray-800" />
              <form action="/auth/signout" method="post" className="m-0">
                <button type="submit" className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs">
                  ออกจากระบบ
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/profile/edit" className="hover:text-gray-200 transition-colors">ฝากประวัติ</Link>
              <Link href="/register" className="hover:text-gray-200 transition-colors">สมัครสมาชิก</Link>
              <Link href="/login" className="hover:text-gray-200 transition-colors">เข้าสู่ระบบ</Link>
              <span className="h-3 w-px bg-gray-800" />
              <Link href="/company/dashboard" className="text-[var(--color-primary)] hover:text-indigo-400 transition-colors font-medium">สำหรับบริษัท</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
