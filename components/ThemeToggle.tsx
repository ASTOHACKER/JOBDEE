"use client";

import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8 rounded-lg bg-gray-800/10 dark:bg-white/5 animate-pulse" />;

  return (
    <div className="no-print flex items-center gap-1 bg-gray-200/50 dark:bg-white/5 p-1 rounded-lg border border-gray-300/30 dark:border-white/5">
      {(["light", "dark", "system"] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-medium transition-all cursor-pointer ${
            theme === t
              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          {t === "light" ? "สว่าง" : t === "dark" ? "มืด" : "ระบบ"}
        </button>
      ))}
    </div>
  );
}
