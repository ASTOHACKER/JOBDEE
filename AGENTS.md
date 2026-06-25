<!-- BEGIN:nextjs-agent-rules -->
# กฎและข้อพิจารณาสำหรับ AI Agent ในการพัฒนา JOBDEE

โปรเจกต์นี้มีโครงสร้างและข้อกำหนดเฉพาะที่แตกต่างจากความรู้ทั่วไปในฐานข้อมูลของท่าน โปรดอ่านและปฏิบัติตามคำสั่งเหล่านี้อย่างเคร่งครัด:

## 1. ข้อกำหนด Next.js 16 & Tailwind CSS v4
- **Next.js 16.2.9 (Turbopack):** ใช้โครงสร้าง App Router
- **ขีดจำกัด Request Body (Server Actions):** มีการตั้งค่าใน `next.config.ts` ให้จำกัดขนาดที่ `10mb` เพื่อให้ผู้สมัครอัปโหลดเรซูเมไฟล์ PDF ขนาดใหญ่ได้สำเร็จ ห้ามนำค่านี้ออก
- **Tailwind CSS v4:** ใช้สไตล์โมเดิร์นแบบกำหนดเอง หลีกเลี่ยงการใช้สไตล์เอฟเฟกต์สีสันที่ดูเป็นเทมเพลต AI (AI-generated look)

## 2. ระบบความปลอดภัยพื้นที่จัดเก็บไฟล์ (Supabase Storage)
- ถังเก็บข้อมูล (`bucket`) สำหรับอัปโหลดเรซูเมชื่อ **`resumes`** เป็นถังจัดเก็บแบบสาธารณะ (Public bucket)
- **สิทธิ์ RLS (Row-Level Security) ของ Storage:** มีการกำหนดนโยบาย RLS บนตาราง `storage.objects` ดังนี้:
  - สิทธิ์อ่าน (`SELECT`): อนุญาตให้ทุกคนอ่านสาธารณะ
  - สิทธิ์เขียน/แก้ไข/ลบ (`INSERT`, `UPDATE`, `DELETE`): อนุญาตเฉพาะผู้ใช้ที่ลงชื่อเข้าใช้ระบบ (Authenticated) และเป็นเจ้าของไฟล์จัดการข้อมูลเท่านั้น
- **ข้อพึงระวัง:** หากมีการเปลี่ยนชื่อถังเก็บไฟล์หรือสร้างถังเก็บใหม่ ต้องเข้าไปตั้งค่านโยบาย RLS บนตาราง `storage.objects` ทุกครั้ง มิเช่นนั้นจะอัปโหลดไฟล์ไม่เข้า

## 3. หน้าแก้ไขโปรไฟล์ (Profile Edit Form)
- เพื่อรองรับความปลอดภัยและสถานะการทำงานของฟอร์ม (Form state / Loading state) ให้ดีขึ้น ฟอร์มถูกแยกออกเป็น **Client Component** ที่ชื่อ `components/ProfileEditForm.tsx`
- ใช้คุณสมบัติ `useActionState` ของ React 19 ในการจัดการสถานะการทำงานร่วมกับ Server Action `updateProfile` ในไฟล์ `app/actions.ts`
- ห้ามเปลี่ยนกลับไปใช้ Server Action เดี่ยวๆ ผูกกับ `<form action={...}>` บน Server Component โดยตรง เพื่อเลี่ยงปัญหา Error "Body exceeded 1 MB limit" และเพื่อให้หน้าแจ้งเตือน (Toast alert) ทำงานได้อย่างถูกต้อง

## 4. การทำงานร่วมกับ Vercel Production
- โปรเจกต์นี้ใช้งานบนที่อยู่ [https://jobdee.vercel.app](https://jobdee.vercel.app)
- การอัปเดตระบบการลงทะเบียนและล็อกอินในอนาคต: ต้องตรวจสอบให้แน่ใจว่า **Auth Redirect URLs** ของโครงการ Supabase ได้ถูกผูกกับโดเมน Vercel ดังกล่าวแล้ว (ห้ามชี้กลับไปเพียงแค่ `localhost` บนโปรดักชัน)
<!-- END:nextjs-agent-rules -->
