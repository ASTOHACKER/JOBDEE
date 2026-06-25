"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menu = [
    { name: "โปรไฟล์ออนไลน์", href: "/profile", icon: "👤" },
    { name: "แก้ไขข้อมูลประวัติ", href: "/profile/edit", icon: "✍️" },
    { name: "ตั้งค่าบัญชี", href: "/profile/settings", icon: "⚙️" },
  ];

  return (
    <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-60 shrink-0">
        <div className="glass-panel rounded-2xl p-4 space-y-4 sticky top-24">
          <div className="px-2 py-1">
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">เมนูจัดการประวัติ</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">จัดการข้อมูลและบัญชีของคุณ</p>
          </div>
          <nav className="space-y-1">
            {menu.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="text-sm opacity-85">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
