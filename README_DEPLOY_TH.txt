KPI Dashboard — Cloudflare Pages + Google Sheets

ไฟล์สำหรับ GitHub / Cloudflare Pages (อัปโหลดไฟล์ที่แตก ZIP แล้ว ไม่ใช่ ZIP):
  index.html, favicon-32.png, icon-192.png, icon-512.png, _headers, functions/api/kpi.js
ไฟล์สำหรับ Google Apps Script เท่านั้น:
  Code.gs (แทนโค้ด Code.gs ของโปรเจ็กต์ Apps Script เดิม หลังสำรองข้อมูล)

ขั้นตอน:
1. สำรอง Code.gs เดิม และตรวจสอบว่า Apps Script นี้ผูกกับ Google Sheets เดิม หรือระบุ SPREADSHEET_ID ใน Code.gs หากเป็น standalone.
2. วาง Code.gs จาก ZIP นี้ลงใน Apps Script เดิม แล้วบันทึก. อย่ารัน setupDashboardAuth ซ้ำหากมีระบบเข้าสู่ระบบที่ใช้งานอยู่ เพราะอาจรีเซ็ตรหัสผ่าน.
3. Project Settings > Script properties เพิ่ม KPI_BRIDGE_SECRET เป็นสตริงสุ่มยาวอย่างน้อย 32 ตัว (ไม่ต้องใส่ใน GitHub).
4. ทำให้ใช้งานได้ > จัดการการทำให้ใช้งานได้ > เลือกเว็บแอป > แก้ไข > เวอร์ชันใหม่; ดำเนินการในฐานะฉัน; สิทธิ์เข้าถึงทุกคน (จำเป็นสำหรับ Cloudflare ที่ไม่ลงชื่อเข้า Google; bridge ใช้ secret และระบบล็อกอินสองชั้น). ใช้ลิงก์ /exec เท่านั้น.
5. แตก ZIP แล้วอัปโหลดไฟล์เว็บไซต์และโฟลเดอร์ functions ไปที่ root ของ GitHub repository ซึ่งเชื่อม Cloudflare Pages. อย่าอัปโหลด Code.gs หรือ ZIP ขึ้นเว็บสาธารณะ.
6. Cloudflare Pages > Settings > Variables and secrets: GAS_URL = URL /exec (Text), KPI_BRIDGE_SECRET = ค่าเดียวกับใน Apps Script (Secret). ต้องกำหนดใน Production แล้วสร้าง deployment ใหม่.
7. เปิดเว็บไซต์ / ลองล็อกอินและตรวจสอบข้อมูล. หาก API ส่ง 502 ตรวจสอบ Apps Script > การเรียกใช้ > doPost และ Chrome DevTools > Network > api/kpi > Response.

หมายเหตุ: การ Deploy สำเร็จไม่ได้ยืนยันว่าการเชื่อม Google Sheets สำเร็จ. การแก้ไขนี้ไม่ได้เปลี่ยนข้อมูลในชีตหรือสร้างฐานข้อมูลใหม่.
ความปลอดภัย: เว็บไซต์ต้องเข้าถึง Apps Script แบบ public endpoint แต่การเรียกเมธอดต้องผ่าน secret ฝั่ง Cloudflare เท่านั้น. ระวังการแชร์ repository สาธารณะ: Code.gs มีข้อมูลการตั้งค่าและข้อมูลระบบภายใน จึงไม่ควรอัปโหลด.
