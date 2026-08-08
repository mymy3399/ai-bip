# AI-BIP Police AI Platform: Prototype Design

วันที่: 7 สิงหาคม 2569  
สถานะ: อนุมัติให้ดำเนินการตามดุลยพินิจการออกแบบ  
ขอบเขต: ต้นแบบสำหรับพิสูจน์แนวคิดและนำเสนอ ไม่เชื่อมระบบจริง

## 1. เป้าหมาย

สร้าง responsive web application ตัวเดียวสำหรับมือถือ แท็บเล็ต และคอมพิวเตอร์ โดยมี 5 โมดูลหลัก ได้แก่ Biometric Field Check, ANPR Surveillance Center, Legal AI Assistant, Police AI Assistants และ Operational Flow / Presentation Mode

ต้นแบบต้องคลิกใช้งานได้ครบทุกโมดูล โดยลงรายละเอียด Biometric Field Check และ Legal AI Assistant มากที่สุด ข้อมูล บุคคล ภาพ ผลตรวจ และเอกสารทั้งหมดเป็นข้อมูลสมมติ

## 2. ขอบเขตที่ไม่ทำในต้นแบบ

- ไม่เชื่อม AFIS, DOPA, ฐานหมายจับ หรือฐานข้อมูลตำรวจจริง
- ไม่เก็บข้อมูลประชาชนจริงและไม่ใช้ภาพบุคคลจริง
- ไม่มีระบบยืนยันตัวตนและสิทธิ์ผู้ใช้จริง
- ไม่ส่งผลตรวจไปยังหน่วยงานภายนอก
- Legal AI ไม่วินิจฉัยคดีและไม่สร้างผลทางกฎหมาย
- ไม่มี backend หรือฐานข้อมูลถาวร การทำงานทั้งหมดอยู่ใน browser

## 3. แนวทางเทคนิค

- React, TypeScript และ Vite
- React Router สำหรับเส้นทางภายในแอป
- CSS design tokens และ responsive layout โดยไม่ผูกกับ component framework ขนาดใหญ่
- Lucide icons สำหรับไอคอนระบบที่เป็น code-native
- Simulation Service เป็น service interface กลาง ทำให้ภายหลังเปลี่ยนเป็น API adapter ได้
- ข้อมูลตัวอย่างแยกจาก component และระบุ `synthetic: true` ทุก record
- State ของ flow เก็บในหน่วยความจำ ไม่บันทึกเลขประจำตัวหรือข้อมูล biometric ลง local storage

## 4. Information Architecture

### 4.1 App Shell

Desktop ใช้ sidebar และ top bar พื้นที่ทำงานกว้าง Mobile ใช้ top bar แบบย่อและ bottom navigation 5 รายการ ได้แก่ Home, Field Check, Legal AI, Assistants และ Flow

ทุกหน้าจะแสดงสถานะ `DEMO / ข้อมูลสมมติ` ในตำแหน่งคงที่ หน้าที่มีผลคัดกรองจะแสดงคำเตือน Human-in-the-Loop ติดอยู่ใกล้ผลลัพธ์

### 4.2 Routes

- `/` Home และทางลัดเข้าสู่ 4 โมดูล
- `/field-check` เลือกข้อมูลนำเข้า
- `/field-check/capture` จำลอง fingerprint หรือ face capture
- `/field-check/results` Candidate List
- `/field-check/candidate/:id` Candidate Detail
- `/legal-ai` กรอกพฤติการณ์และดูผลวิเคราะห์
- `/assistants` รายการ Police AI Assistants
- `/assistants/:id` Chat interface ของผู้ช่วยแต่ละราย
- `/flow` Operational Flow
- `/flow/presentation` Presentation Mode แบบเต็มจอ

## 5. Visual Direction

โทนหลักเป็นน้ำเงินกรมท่าแบบระบบงานตำรวจสมัยใหม่ ใช้พื้นสีขาวจริงและพื้นเทาอมฟ้าอ่อนเพื่อแยกชั้นข้อมูล สีฟ้าสว่างใช้กับ action และสถานะกำลังประมวลผล สีส้มใช้กับข้อมูลที่ควรตรวจสอบ สีแดงใช้เฉพาะ notice ที่อาจเกี่ยวข้องกับหมายจับ โดยไม่ใช้สีแดงเป็นคำสั่งให้ดำเนินการ

Typography ใช้ Sarabun เป็นหลัก ตัวอักษร UI ชัดและมีขนาดเหมาะกับการใช้งานภาคสนาม ปุ่มสำคัญบนมือถือมีพื้นที่กดอย่างน้อย 44 พิกเซล Candidate List ใช้ภาพเป็นจุดเด่นและใช้ข้อความเท่าที่จำเป็นต่อการเปรียบเทียบ

การเคลื่อนไหวใช้เฉพาะจุดที่อธิบายสถานะ ได้แก่ fingerprint quality scan, face quality check, parallel data search และ candidate ranking พร้อมรองรับ `prefers-reduced-motion`

## 6. Biometric Field Check

### 6.1 Input

ผู้ใช้เลือกใช้ข้อมูลอย่างน้อยหนึ่งชนิดและใช้หลายชนิดพร้อมกันได้:

- Fingerprint ผ่าน FAP 20 จำลอง
- Face capture จากกล้องจำลอง
- ชื่อและนามสกุล
- เลขประจำตัวประชาชน 13 หลัก โดย input ตรวจเฉพาะรูปแบบในต้นแบบ

หน้าเริ่มต้นมี Scenario Shortcuts เพื่อใช้สาธิต ได้แก่ Exact ID Match, Multiple Candidates, Possible Warrant Notice, Conflicting Data และ No Result

### 6.2 Capture States

Fingerprint: Connect device, Place finger, Quality reading, Accepted, Search  
Face: Capture, Quality Check, Search, Candidate Ranking

แต่ละขั้นมี progress ที่มองเห็นได้ ปุ่มยกเลิก และ error state ได้แก่ คุณภาพต่ำ อุปกรณ์ไม่พร้อม และค้นหาเกินเวลา

### 6.3 Cross-Check Simulation

Simulation Service แสดงการค้นหาพร้อมกันจาก:

- ทะเบียนราษฎร์จำลอง
- ฐานข้อมูลตำรวจจำลอง
- ฐานหมายจับจำลอง
- AFIS / biometric index จำลอง

แสดงเฉพาะสถานะกำลังค้นหา พบข้อมูล หรือไม่พบข้อมูล ไม่มีการอ้างว่าติดต่อระบบจริง

### 6.4 Candidate List

Candidate card ประกอบด้วยภาพสังเคราะห์ ชื่อสมมติ อายุโดยประมาณ แหล่งข้อมูลที่พบ ค่าความคล้ายเฉพาะเมื่อค้นด้วย biometric และสถานะ cross-check

คำที่อนุญาต ได้แก่ `Candidate`, `พบข้อมูลที่อาจสอดคล้อง`, `ควรตรวจสอบเพิ่มเติม` และ `รอเจ้าหน้าที่ยืนยัน`

เมื่อมี warrant notice ให้ใช้ข้อความ `พบข้อมูลที่อาจเกี่ยวข้องกับหมายจับ` พร้อมเลขหมายสมมติ หน่วยงานผู้ออกหมาย กลุ่มฐานความผิด และเวลาที่ข้อมูลจำลองได้รับ มีปุ่ม `เปิดรายละเอียดเพื่อตรวจสอบ` แต่ไม่มีคำสั่งจับกุม

### 6.5 Candidate Detail

แสดงภาพขนาดใหญ่ ข้อมูลอัตลักษณ์ที่อนุญาต แหล่งข้อมูล ความสอดคล้องรายปัจจัย และข้อมูลคดีในระดับกลุ่มคดีเท่านั้น

ปุ่มท้ายหน้าคือ `บันทึกว่าได้ตรวจสอบแล้ว`, `กลับไปดู Candidate อื่น` และ `ดูขั้นตอน Formal Verification` การบันทึกเปลี่ยน local UI state เท่านั้น

## 7. Legal AI Assistant

### 7.1 Input

มี textarea สำหรับพฤติการณ์ ตัวอย่างคดีที่กดเติมได้ และปุ่มวิเคราะห์ ก่อนเริ่มวิเคราะห์จะแจ้งว่าเป็นผลช่วยตรวจประเด็น ไม่ใช่คำวินิจฉัย

### 7.2 Analysis Output

ผลลัพธ์แบ่งเป็น:

- ข้อเท็จจริงที่แยกได้: ผู้กระทำ การกระทำ เจตนา ผล ทรัพย์หรือบุคคล เวลา สถานที่ และพฤติการณ์ประกอบ
- Candidate Charges แบบ Top-N
- กฎหมายและมาตราที่เกี่ยวข้อง
- องค์ประกอบความผิด
- ข้อเท็จจริงที่สนับสนุน
- ข้อเท็จจริงที่ยังขาด
- ประเด็นและคำถามที่ควรสอบเพิ่ม
- ประเด็นประกอบ เช่น พยายาม ตัวการ ผู้ใช้ ผู้สนับสนุน หลายกรรม เหตุเพิ่มหรือลดโทษ

อัตราโทษจะแสดงจาก structured sample data ไม่สร้างจากข้อความของโมเดล และมี citation พร้อมชื่อเอกสาร วันที่มีผลใช้บังคับ วันที่ตรวจสอบข้อมูล และลิงก์แหล่งทางการ

### 7.3 Interaction

ผู้ใช้เลือก Candidate Charge เพื่อเปิดรายละเอียด สลับดูเฉพาะข้อเท็จจริงที่ขาด คัดลอกคำถามสำหรับสอบสวน และเปิด citation ได้ มีสถานะ `รอพนักงานสอบสวนพิจารณา` ตลอดผลวิเคราะห์

## 8. Police AI Assistants

หน้ารวมมี Investigator, Personnel/HR และ Procurement พร้อมสถานะ `พร้อมทดลอง` ผู้ช่วยอื่นแสดงเป็นแผนการต่อยอดโดยไม่ทำเป็น card จำนวนมาก

แต่ละ Chat มี sample prompts, ประวัติสนทนาจำลอง และคำตอบที่แยกเนื้อหาออกจาก citation ชัดเจน Citation แสดงชื่อเอกสาร หน่วยงาน วันที่ และลิงก์ หากเป็นตัวอย่างที่ไม่ใช่ข้อกฎหมาย ให้ติดป้าย `ตัวอย่างการตอบ`

## 9. Operational Flow และ Presentation Mode

Flow หลัก:

ตำรวจภาคสนาม → Fingerprint / Face / Name / Citizen ID → Secure Gateway → Cross-Check → Biometric AI / Candidate Ranking → Candidate List → เจ้าหน้าที่ตรวจสอบ → Formal Verification → พิมพ์ 10 นิ้ว → AFIS หลัก → พนักงานสอบสวน → Legal AI Assistant

บนหน้าปกติ flow เป็น node ที่กดได้และเปิด detail panel Presentation Mode ซ่อน sidebar ขยายตัวอักษร ใช้ปุ่มลูกศรหรือแป้นพิมพ์เลื่อนไปทีละขั้น และออกจากโหมดด้วย Escape

## 10. Human-in-the-Loop และข้อความคุ้มครอง

หน้าผลคัดกรองทุกหน้าต้องแสดง:

> ข้อมูลนี้เป็นผลคัดกรองเบื้องต้น ไม่ใช่การยืนยันตัวบุคคลหรือสถานะทางคดี

ห้ามใช้คำว่า `บุคคลนี้เป็นคนร้าย`, `AI ยืนยันว่าเป็นผู้ต้องหา`, `จับกุมทันที` หรือ `ปล่อยตัวได้`

Formal Verification Guidance อธิบายว่าหากจำเป็นต้องยืนยันบุคคลในกระบวนการสอบสวน ต้องเข้าสู่กระบวนการหลักและส่งตรวจ AFIS ตามขั้นตอนของสำนักงานตำรวจแห่งชาติ

## 11. Error Handling

- Validation อธิบายสิ่งที่ต้องแก้ตรง field และรักษาค่าที่ผู้ใช้กรอกไว้
- Low-quality biometric เสนอให้ลองใหม่หรือเพิ่มข้อมูลชนิดอื่น
- Search timeout แสดงว่าการจำลองไม่สำเร็จและให้เริ่มใหม่ ไม่มีผล candidate ค้างจากครั้งก่อน
- Conflicting sources แสดงความไม่สอดคล้องรายแหล่งโดยไม่รวมเป็นผลยืนยัน
- No result ระบุว่าไม่พบข้อมูลไม่เท่ากับยืนยันว่าไม่มีประวัติ
- Route หรือ scenario ที่ไม่รู้จักนำกลับ Home พร้อมข้อความที่เข้าใจได้

## 12. Accessibility และ Responsive Behavior

- ใช้งาน keyboard ได้ใน flow สำคัญ
- มี visible focus, semantic headings และ ARIA label สำหรับ icon-only control
- สีสถานะต้องมีข้อความกำกับ ไม่สื่อด้วยสีเพียงอย่างเดียว
- Mobile รองรับความกว้างตั้งแต่ 360 พิกเซลโดยไม่มี horizontal overflow
- Desktop ออกแบบหลักที่ 1440 × 900 และ Presentation ที่ 16:9
- Candidate image มี alt text ที่ระบุว่าเป็นภาพบุคคลสมมติ

## 13. Verification

- Build, type check และ lint ต้องผ่าน
- Unit test สำหรับ validation, scenario selection และ candidate ranking
- Interaction test สำหรับ Field Check ตั้งแต่เลือกข้อมูลจนเปิด Candidate Detail
- Interaction test สำหรับ Legal AI ตั้งแต่กรอกพฤติการณ์จนเปิด Candidate Charge
- ตรวจ viewport อย่างน้อย 390 × 844, 768 × 1024 และ 1440 × 900
- ตรวจ Presentation Mode ที่ 1920 × 1080 หรือสัดส่วน 16:9 ที่ใกล้เคียง

## 14. Post-implementation update

- ANPR เพิ่มแท็บหลักสำหรับ Real-time, Watchlist และ Transport Registry โดยแยก CCTV/Geofence เป็นแท็บย่อยภายใน Real-time
- Legal AI เพิ่ม workflow การกดวิเคราะห์พร้อม loading animation และผูก Candidate Charges/Fact Matrix/Precedents/Bail/Statutes กับ case context เดียวกัน
- เอกสารการใช้งานและสคริปต์นำเสนออยู่ที่ `docs/USER-GUIDE-AND-PRESENTATION.md`
- เปรียบเทียบ browser screenshot กับภาพ concept ทั้ง desktop และ mobile

## 14. Definition of Done

ต้นแบบถือว่าเสร็จเมื่อผู้ใช้สามารถเดิน flow หลักทั้ง 4 โมดูลได้จริง ข้อมูลทุกจุดระบุว่าเป็นข้อมูลสมมติ ไม่มีคำที่ทำให้เข้าใจว่า AI ยืนยันบุคคลหรือชี้ขาดคดี UI ใช้งานได้บน mobile และ desktop และผลการทดสอบที่กำหนดผ่านทั้งหมด
