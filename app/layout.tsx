import type { Metadata } from "next";
import { Prompt, Outfit } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JOBDEE — หางาน สมัครงาน ฝากประวัติ",
  description: "แพลตฟอร์มหางานออนไลน์สำหรับคนไทย ค้นหาตำแหน่งงาน ฝากประวัติ และสมัครงานได้ง่ายๆ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${prompt.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
