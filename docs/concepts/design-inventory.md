# AI-BIP Concept Inventory

## Accepted concept paths

- `docs/concepts/field-check-desktop.png` at 1584 × 1008
- `docs/concepts/field-check-mobile.png` at 853 × 1856
- `docs/concepts/legal-ai-desktop.png` at 1584 × 1008
- `docs/concepts/assistants-desktop.png` at 1584 × 1008
- `docs/concepts/presentation-mode.png` at 1680 × 945

## Visual priority

1. Field Check uses image-led comparison and is the densest operational screen.
2. Legal AI uses a two-column analysis workspace with structured facts on the left and charge evidence on the right.
3. Assistants uses a narrow assistant rail and a source-backed conversation area.
4. Presentation Mode uses a full-width open canvas, large nodes, one explanation band and no application navigation.

## Color lock

- Sidebar and presentation header: deep navy `#071f3c` to `#0b2d55`, solid or extremely subtle same-hue depth only
- Page background: true white `#ffffff`
- Working surface: cool blue-gray `#f5f8fc`
- Primary action: `#0868df`
- Primary hover: `#0759bd`
- Main text: `#10233f`
- Muted text: `#5f7088`
- Border: `#d7e1ed`
- Success: `#16833e`
- Review / amber: `#c87b00` on `#fff8e8`
- Warrant-related notice: `#c82d37` on `#fff4f4`
- No cream, beige page background, neon, glow or unrelated gradients

## Typography

- Family: Sarabun
- App title desktop: 24–28px, weight 700, line-height 1.25
- Page title mobile: 20px, weight 700
- Section heading: 18–20px, weight 700
- Body: 15–16px, weight 400–500, line-height 1.55
- UI control: 14–15px, weight 600
- Caption: 12–13px, weight 400–500
- Presentation title: 40–48px; node text: 18–22px; explanation: 18–24px

## Spacing and geometry

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40
- Page gutter desktop: 20–24px
- Page gutter mobile: 16px
- Radius: 8px controls, 10px rows, 12px panels, 14px primary media frame
- Border: 1px cool gray; selected border: 2px action blue
- Shadow: only on elevated work panels, low opacity and short blur
- Minimum target: 44px

## Container model

- Use open page regions, rails, lists and one-level panels.
- Do not nest multiple floating cards.
- Candidate items are list rows with image emphasis.
- Legal facts are table-like rows, not a grid of cards.
- Assistant messages may use a bordered response block; citations are rows within it.
- Presentation uses no card grid.

## Above-the-fold copy lock

### App shell

- AI-BIP
- Police AI Platform
- Home
- Field Check
- Legal AI
- Assistants
- Flow
- DEMO · ข้อมูลสมมติ
- Secure Demo Mode

### Field Check result

- Biometric Field Check
- Candidate List
- Candidate 1 / 91%
- Candidate 2 / 84%
- Candidate 3 / 76%
- นาย กิตติ สมมติ
- พบข้อมูลที่อาจเกี่ยวข้องกับหมายจับ
- เปิดรายละเอียดเพื่อตรวจสอบ
- ดูขั้นตอน Formal Verification
- ข้อมูลนี้เป็นผลคัดกรองเบื้องต้น ไม่ใช่การยืนยันตัวบุคคลหรือสถานะทางคดี

### Field Check mobile capture

- ข้อมูลนำเข้า
- ตรวจคุณภาพ
- ค้นหา
- Candidate
- Quality Check
- ใบหน้าอยู่ในกรอบ
- แสงสว่างเพียงพอ
- ภาพคมชัด
- Face Capture
- ค้นหา Candidate
- ถ่ายใหม่

### Legal AI

- Legal AI Assistant
- วิเคราะห์พฤติการณ์คดี
- ใช้ตัวอย่างคดีลักทรัพย์
- วิเคราะห์ประเด็น
- ข้อเท็จจริงที่แยกได้
- Candidate Charges
- องค์ประกอบความผิด
- ข้อเท็จจริงที่สนับสนุน
- ข้อเท็จจริงที่ยังขาด
- ประเด็นที่ควรสอบเพิ่ม
- รอพนักงานสอบสวนพิจารณา
- AI เสนอประเด็นให้ตรวจ ไม่ใช่คำวินิจฉัย

### Assistants

- Police AI Assistants
- Investigator Assistant
- Personnel / HR Assistant
- Procurement Assistant
- ประเด็นที่ควรตรวจ
- แหล่งอ้างอิง
- ตัวอย่างการตอบ · ตรวจสอบเอกสารฉบับปัจจุบันก่อนใช้
- ขั้นตอนจัดทำ TOR
- การกำหนดราคากลาง
- การตรวจรับพัสดุ

### Presentation

- AI-BIP Operational Flow
- Field Screening
- Human Review
- Formal Verification
- Investigation
- Candidate List
- แสดงบุคคลที่อาจสอดคล้องตามลำดับ
- เจ้าหน้าที่ต้องเปรียบเทียบและตรวจสอบเพิ่มเติม
- Field Screening ไม่ใช่การยืนยันตัวบุคคล

## Icon inventory

- Family: Lucide rounded outline, 2px stroke
- Navigation: Home, Search, Scale, Bot, Workflow
- Status: Lock, CheckCircle, AlertTriangle, Clock, Info
- Biometric: Fingerprint, ScanFace, Camera
- Data source: Database, Landmark, Shield, IdCard
- Actions: Search, ExternalLink, Copy, ChevronRight, ArrowLeft, ArrowRight
- Icons remain 18–22px in controls and 24px in navigation; no filled/outline mixing except selected navigation background.

## Project assets

- `src/assets/ai-bip-mark.png`: fictional transparent project shield mark
- `src/assets/candidate-1.png`: synthetic portrait, navy shirt
- `src/assets/candidate-2.png`: synthetic portrait, gray shirt
- `src/assets/candidate-3.png`: synthetic portrait, beige shirt

## Motion

- 160–220ms transitions for selection and panels
- Search progress advances by source
- Face guide and fingerprint scan use a slow single sweep, not continuous glow
- Presentation node transitions use opacity and small translation
- Disable nonessential motion under `prefers-reduced-motion`

## Responsive continuation

- At 1024px and below, sidebar becomes compact or bottom navigation depending on available width.
- At 768px and below, all workspaces become one column.
- Candidate detail follows Candidate List on mobile.
- Legal input, facts, charges and selected detail stack in that order.
- Assistant rail becomes a horizontal selector above conversation.
- Presentation at narrow widths becomes a vertical stepper outside full-screen meeting mode.

## Intentional concept corrections

- Legal penalty values in code use verified structured source data. The generated concept's visual minimum/maximum labels are layout references only.
- Presentation implementation includes both `AFIS หลัก` and `พนักงานสอบสวน` as separate steps, preserving the user brief even where the concept compressed the sequence.
- Mobile implementation uses the AI-BIP mark plus shorter title spacing so the 360px viewport does not clip the demo disclosure.

## Current interactive states added after the concept

- Field Check results display the actual selected search methods, input context, candidate names, and synthetic citizen IDs. Exact ID searches use 1:1 language and hide biometric similarity.
- ANPR uses three primary tabs: Real-time Monitoring, Watchlist Management, and Transport Registry Check. CCTV and Geofence are nested tabs inside Real-time Monitoring.
- Legal AI includes an explicit Analyze Facts action with scan/progress animation. Candidate Charges and Fact Matrix update per case preset.
- Supreme Court Precedents, Bail Risk Assessment, and Statute Reference are case-contextual. The statute library remains globally searchable while related sections are promoted first.
- All external registry, AFIS, DLT, warrant, and biometric integrations remain simulated.
