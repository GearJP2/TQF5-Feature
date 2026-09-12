# TQF5 — ชุดไฟล์ตั้งต้นสำหรับทีม

โฟลเดอร์นี้คัดลอกเฉพาะ source และเอกสารที่เกี่ยวข้องจากโปรเจคหลัก เพื่อย้ายไป private repo ของทีม TQF5 โดยไม่ต้องให้ทีมเข้าถึง repo หลัก ประวัติ Git, environment จริง, ฐานข้อมูล, dependencies ที่ติดตั้งไว้ และ deployment ของระบบหลักไม่ได้ถูกคัดลอกมา

**สถานะ: เป็น source handoff ยังไม่ใช่แอปที่รันแยกได้ทันที** ยังไม่ได้สร้าง service entrypoint, UI TQF5, seed, migration หรือ Docker Compose สำหรับระบบใหม่ ไฟล์ที่คัดลอกคงเนื้อหาเดิมทั้งหมด ตรวจที่มาและ checksum ได้จาก `MANIFEST.json`

## ไฟล์ที่ใช้พัฒนาต่อ

| ตำแหน่ง | ใช้ทำอะไร |
| --- | --- |
| `backend/app/api/v1/endpoints/tqf5.py` | API ตั้งต้นสำหรับ list/create report |
| `backend/app/models/tqf5.py` | ตารางรายงานและผลสัมฤทธิ์ CLO |
| `backend/app/schemas/tqf5.py` | รูปร่าง request/response เดิม |
| `backend/app/models/course.py` | CourseSection, CLO และตารางที่ foreign key อ้างถึง |
| `backend/app/core/`, `backend/app/api/deps.py` | รูปแบบ settings, database session และ dependency |
| `backend/app/services/docx_service/docx_utils.py` | utilities จัดรูปแบบ Word และภาษาไทย; ยังไม่ใช่ตัวสร้าง TQF5 |
| `backend/requirements.txt` | dependencies เดิมเพื่ออ้างอิง; มีบางตัวที่ TQF5 อาจไม่ต้องใช้ |
| `frontend/components/ui/`, `frontend/hooks/`, `frontend/lib/utils.ts` | UI components และ helpers ที่ใช้ซ้ำได้ |
| `frontend/styles/globals.css` | ธีมเดิมของระบบ |
| `frontend/package*.json`, `frontend/tsconfig*.json`, `frontend/vite.config.ts` | dependencies และ build configuration ตั้งต้น |
| `resources/references/` | template TQF5, ตัวอย่าง TQF5 และ TQF3 ของวิชาเดียวกัน |
| `integration-reference/` | สำเนาจุดเชื่อมต่อของระบบหลัก ใช้อ่านประกอบ ไม่ใช่ source ของ service ใหม่ |

## ข้อเท็จจริงของ implementation เดิม

- Router หลัก mount TQF5 ที่ `/api/v1/tqf5` ปัจจุบันมีเพียง `GET /reports` และ `POST /reports`
- ยังไม่มี API แก้ไขรายงาน, บันทึก achievement, ส่งออก TQF5 หรือ UI TQF5 โดยเฉพาะ
- Model รายงานเดิมยังไม่ได้ครอบคลุมทุกช่องใน template ต้องตกลงขอบเขตกับผู้ใช้ก่อนขยาย schema
- `TQF5Report.section_id` อ้างถึง `course_sections`; achievement อ้างถึง `clos` การคัดลอก model ไปไม่ได้ทำให้ข้อมูลเหล่านี้มีอยู่ในฐานข้อมูลใหม่
- ระบบหลักยังไม่มี authentication และ approval workflow ตาม README หลัก จึงยังไม่มีระบบ login ให้เชื่อมใช้งานทันที
- Schema achievement เดิมใช้ `model_validate` กับ ORM object แต่ไม่ได้ตั้ง `from_attributes` ให้ตรวจและปรับเมื่อพัฒนาเส้นทางนี้

## เริ่มทำงานใน repo ใหม่

1. คัดลอกทั้งโฟลเดอร์นี้ออกไปเป็น working directory ของ repo ใหม่ แล้วจึง `git init` ที่ปลายทาง ไม่ต้องคัดลอก `.git` จาก repo หลัก
2. Backend: สร้าง `app/main.py` และ model registration ของ service ใหม่ เชื่อม router TQF5, DB initialization และ health endpoint ใช้ `integration-reference/backend/app/main.py` เป็นแนวทางเท่านั้น เพราะ entrypoint เดิมเรียก seed และ migration ของ TQF3 ที่ไม่ได้รวมมา
3. ตกลงว่า service จะรับ snapshot ของ course/section/CLO ผ่าน adapter หรือเก็บข้อมูลอ้างอิงอย่างไร ถ้าใช้ model เดิมต้องสร้างและ seed ตารางที่เกี่ยวข้องให้ครบ ห้ามถือว่าฐานข้อมูลระบบหลักเข้าถึงได้จาก repo นี้
4. Frontend: เพิ่ม `index.html`, `src/main.tsx`, `src/App.tsx` และหน้า TQF5 แล้วใช้ UI components ที่ให้มา `package.json` ยังมีคำสั่ง `verify:*` ของ TQF3 ซึ่งไม่ได้คัดลอก scripts มาด้วย ให้เอาออกหรือแทนด้วย checks ของ TQF5
5. ตั้ง backend URL/proxy และพอร์ต dev ให้เหมาะกับระบบใหม่ ค่า Vite ที่คัดลอกมายังอิงพอร์ตเดิม 5173/8000 จากนั้นจึงติดตั้ง dependencies และตรวจ build
6. เพิ่ม migration, mock data, tests และ Compose ของทีม โดยใช้ฐานข้อมูล/volume แยกจากระบบหลัก

ไม่ควรนำ `integration-reference` ไปวางทับโปรเจคหลักทั้งโฟลเดอร์ ให้เจ้าของ repo review diff และเชื่อมเฉพาะส่วนที่ตกลงกัน ไฟล์อ้างอิงบางไฟล์ import ส่วนอื่นของระบบหลักซึ่งไม่ได้รวมในชุดนี้

## แบ่งเจ้าของงาน 7 คน

| คน | พื้นที่รับผิดชอบ |
| --- | --- |
| 1 — เจ้าของ repo หลัก | API contract, จุดเข้า UI, สิทธิ์ และ integration กลับระบบหลัก |
| 2 — Backend รายงาน | models, schemas, CRUD/validation, migrations |
| 3 — Export | template TQF5 และบริการสร้างเอกสาร |
| 4 — UI รายการ | หน้ารายการ เลือกวิชา สร้าง/เปิดรายงาน |
| 5 — UI ฟอร์ม | ฟอร์มรายหมวด การบันทึก และ error states |
| 6 — Adapter/Preview | mock course context, adapter และพรีวิวเอกสาร |
| 7 — QA/Dev environment | Compose, CI, fixtures และทดสอบ flow ครบเส้น |

เริ่มด้วยข้อมูลจำลองหนึ่งรายวิชา: สร้างรายงาน → กรอกหนึ่งหมวด → บันทึก → เปิดใหม่ → export ตัวอย่าง แล้วจึงขยายหมวดที่เหลือ ให้เจ้าของงานแต่ละส่วนเพิ่ม checks ของตัวเองด้วย
