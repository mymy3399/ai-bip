# AI-BIP Police AI Platform

Responsive prototype สำหรับแพลตฟอร์มช่วยงานตำรวจ ประกอบด้วย Biometric Field Check, ANPR Surveillance, Legal AI, Police AI Assistants และ Operational Flow

## เริ่มต้นใช้งาน

```bash
npm install
npm run dev
```

Dev/Preview ใช้พอร์ต `5180`

```bash
npm run build
npm run preview
```

รายละเอียดการใช้งานและสคริปต์นำเสนออยู่ที่ [docs/USER-GUIDE-AND-PRESENTATION.md](docs/USER-GUIDE-AND-PRESENTATION.md)

> ระบบนี้เป็นต้นแบบ ใช้ข้อมูลจำลอง และยังไม่เชื่อมต่อ AFIS, ฐานตำรวจ, กรมการขนส่ง หรือฐานข้อมูลราชการจริง
# AI-BIP Police AI Platform

This project is a browser-only demonstration platform. It does not execute operating-system commands. Shell interactions are represented by the allowlisted action IDs in `src/app/shellActions.ts`; user-provided strings are never interpreted as commands.

## Verification

```bash
npm test -- --run
npx tsc -p tsconfig.app.json --noEmit
npm run build
```
