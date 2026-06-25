import Link from "next/link";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const menu = [
    { name: "โปรไฟล์", href: "/profile" },
    { name: "แก้ไขประวัติ", href: "/profile/edit" },
    { name: "ตั้งค่าบัญชี", href: "/profile/settings" },
  ];

  return (
    <div className="container mx-auto px-6 py-10 flex gap-8">
      <aside className="w-52 shrink-0">
        <nav className="glass-panel rounded-xl p-3 space-y-0.5">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
