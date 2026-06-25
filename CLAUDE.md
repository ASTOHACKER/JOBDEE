# คู่มือนักพัฒนา (Developer Guide) - JOBDEE

โปรเจกต์นี้ได้รับการควบคุมสิทธิ์และพฤติกรรมของตัวแทน AI ด้วย `AGENTS.md`

## การตรวจสอบและทดสอบระบบ (Verification & Testing)
ก่อนส่งมอบงานหรือสรุปงานทุกครั้ง ให้ทำตามขั้นตอนการตรวจสอบดังนี้:

1. **การตรวจสอบโครงสร้างและการคอมไพล์โค้ด:**
   - รันคำสั่งตรวจสอบประเภทข้อมูลและการสร้างเว็บแอปพลิเคชัน:
     ```bash
     npm run build
     ```
     *หมายเหตุ: ในสภาพแวดล้อม Windows Terminal ในบางสถานการณ์ ตัวรัน Node.js อาจเกิดข้อขัดแย้งเกี่ยวกับ ncrypto CSPRNG ของแซนด์บ็อกซ์ได้ ให้เรียกใช้ผ่าน Python Subprocess หรือปิดใช้งาน venv ชั่วคราวก่อนทดสอบ*

2. **การอัปโหลดขึ้นโปรดักชัน (Production Deployment):**
   - รันคำสั่งอัปเดตโค้ดขึ้นเว็บจริงด้วย Vercel:
     ```bash
     vercel deploy --prod --yes
     ```

3. **ปัญหาและวิธีแก้ไขที่ตรวจพบในอดีต (Known Issues & Fixes):**
   - **Error: Body exceeded 1 MB limit** -> แก้ไขแล้วโดยเพิ่ม `experimental.serverActions.bodySizeLimit` เข้าไปใน `next.config.ts`
   - **Error: Uploading to storage fails silently** -> แก้ไขแล้วโดยการสร้างนโยบาย RLS (Storage Policies) ให้กับตาราง `storage.objects` บนฐานข้อมูล Supabase เพื่ออนุญาตให้สิทธิ์บัญชีผู้สมัครสามารถเขียนไฟล์ได้
   - **Error: Form action ignores method/encType** -> ห้ามระบุ `encType` หรือ `method` ในฟอร์มที่มีการกำหนดฟังก์ชันแอ็กชันของ Server Action โดยตรงใน React 19

สำหรับภาพรวมทางเทคนิคและแผนผังฐานข้อมูล (Database Schema) ทั้งหมด โปรดอ่านเพิ่มเติมที่ไฟล์ `context.md`
