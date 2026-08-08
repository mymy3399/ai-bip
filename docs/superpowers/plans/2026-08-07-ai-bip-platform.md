# AI-BIP Police AI Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้าง responsive React prototype ที่สาธิต Biometric Field Check, Legal AI, Police AI Assistants และ Operational Flow ได้ครบด้วยข้อมูลสมมติ

**Architecture:** React + TypeScript ทำงานใน browser และเรียก `SimulationService` ผ่าน interface กลาง แต่ละ feature แยก route, components, data และ tests ออกจากกัน App shell รับผิดชอบ responsive navigation และ demo disclosure เท่านั้น

**Tech Stack:** React, TypeScript, Vite, React Router, Vitest, Testing Library, Lucide React, Sarabun

## Current delivered scope (August 2026)

The implementation has expanded beyond the original four-module plan to include the ANPR Surveillance Center. The current behavior and presentation script are documented in `docs/USER-GUIDE-AND-PRESENTATION.md`.

- ANPR: three primary tabs, nested CCTV/Geofence tabs, watchlist management, and transport-registry lookup simulation.
- Legal AI: explicit fact-analysis action with progress animation; case-contextual Candidate Charges, Fact Matrix, Supreme Court Precedents, Bail Risk, and Statute Reference.
- Platform: PWA shell, responsive mobile layouts, Host-safe Vite Dev/Preview on port 5180.
- Verification baseline: `npm run build` passes; `npm run test:run` passes 6 files / 10 tests.

## Global Constraints

- ไม่เชื่อม AFIS, DOPA, ฐานหมายจับ หรือฐานข้อมูลตำรวจจริง
- ไม่เก็บเลขประจำตัวหรือข้อมูล biometric ลง local storage
- ทุก record ต้องมี `synthetic: true`
- ทุกหน้าผลคัดกรองต้องแสดง `ข้อมูลนี้เป็นผลคัดกรองเบื้องต้น ไม่ใช่การยืนยันตัวบุคคลหรือสถานะทางคดี`
- UI ห้ามใช้ถ้อยคำที่สั่งจับกุม ปล่อยตัว หรืออ้างว่า AI ยืนยันบุคคลหรือชี้ขาดคดี
- Mobile ต้องใช้งานได้ตั้งแต่ 360 พิกเซล และไม่มี horizontal overflow
- Desktop เป้าหมาย 1440 × 900 และ Presentation เป้าหมายสัดส่วน 16:9
- ใช้ข้อมูลและภาพบุคคลสังเคราะห์เท่านั้น
- Workspace นี้ไม่มี Git repository ที่ใช้งานได้ จึงบันทึก checkpoint ด้วย test result แทน commit

---

## File Map

```text
src/
  app/App.tsx                     route composition
  app/AppShell.tsx                desktop/mobile navigation
  app/routes.ts                   route metadata
  components/                     shared UI primitives
  features/home/HomePage.tsx
  features/field-check/           input, capture, results, candidate detail
  features/legal-ai/              case input and structured analysis
  features/assistants/            assistant directory and chat
  features/flow/                  operational and presentation modes
  simulation/                     service interface, scenarios, fake records
  styles/                         tokens, globals, layout, feature styles
  test/                           test setup and shared render helper
```

### Task 1: Project foundation and design tokens

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `index.html`
- Create: `src/main.tsx`, `src/app/App.tsx`, `src/test/setup.ts`
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Test: `src/app/App.test.tsx`

**Interfaces:**
- Produces: `App(): JSX.Element`, CSS tokens under `:root`, Vitest environment with `@testing-library/jest-dom`

- [ ] **Step 1: Install the exact dependency families**

Run:

```bash
npm install react react-dom react-router-dom lucide-react @fontsource/sarabun
npm install -D typescript vite @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event eslint
```

- [ ] **Step 2: Write the failing shell test**

```tsx
import { render, screen } from '@testing-library/react'
import { App } from './App'

it('renders the AI-BIP application name and demo disclosure', () => {
  render(<App />)
  expect(screen.getByText('AI-BIP')).toBeInTheDocument()
  expect(screen.getByText(/ข้อมูลสมมติ/)).toBeInTheDocument()
})
```

- [ ] **Step 3: Run the test and confirm red state**

Run: `npm test -- --run src/app/App.test.tsx`  
Expected: FAIL because `App` and test configuration do not exist.

- [ ] **Step 4: Add Vite, Vitest, TypeScript and the minimal App**

```tsx
export function App() {
  return <main><h1>AI-BIP</h1><p>DEMO · ข้อมูลสมมติ</p></main>
}
```

Define navy, white, pale blue, blue, amber and red semantic tokens; Sarabun typography; focus rings; 44px minimum interactive target; reduced-motion rules.

- [ ] **Step 5: Run foundation checks**

Run: `npm test -- --run src/app/App.test.tsx && npm run build`  
Expected: PASS and Vite emits `dist/`.

### Task 2: Simulation domain and deterministic scenarios

**Files:**
- Create: `src/simulation/types.ts`
- Create: `src/simulation/candidates.ts`, `src/simulation/scenarios.ts`
- Create: `src/simulation/SimulationService.ts`
- Create: `src/simulation/validation.ts`
- Test: `src/simulation/SimulationService.test.ts`, `src/simulation/validation.test.ts`

**Interfaces:**
- Produces: `SearchScenario`, `Candidate`, `SourceMatch`, `FieldSearchInput`, `SearchResult`
- Produces: `simulationService.search(input, scenario): Promise<SearchResult>`
- Produces: `validateCitizenId(value): string | null`, `rankCandidates(items): Candidate[]`

- [ ] **Step 1: Write validation and ranking tests**

```ts
it('accepts exactly thirteen numeric characters', () => {
  expect(validateCitizenId('0000000000000')).toBeNull()
  expect(validateCitizenId('123')).toMatch(/13 หลัก/)
})

it('orders candidates by similarity descending without asserting identity', () => {
  const ranked = rankCandidates([{ id: 'b', similarity: 84 }, { id: 'a', similarity: 91 }] as Candidate[])
  expect(ranked.map(item => item.id)).toEqual(['a', 'b'])
})
```

- [ ] **Step 2: Run tests and confirm missing functions**

Run: `npm test -- --run src/simulation`  
Expected: FAIL with unresolved imports.

- [ ] **Step 3: Implement types, validation and five scenarios**

```ts
export type SearchScenario = 'exact-id' | 'multiple' | 'warrant' | 'conflict' | 'no-result'

export interface FieldSearchInput {
  citizenId?: string
  fullName?: string
  fingerprint?: boolean
  face?: boolean
}

export interface Candidate {
  id: string
  synthetic: true
  displayName: string
  portraitUrl: string
  similarity?: number
  crossChecks: Array<{ label: string; state: 'match' | 'possible' | 'conflict' | 'unknown' }>
  warrantNotice?: { number: string; issuer: string; category: string; status: string }
}
```

Use deterministic synthetic records for 91%, 84% and 76% ranking. Use masked or all-zero demonstration identifiers only.

- [ ] **Step 4: Implement SimulationService progress and result**

`search` returns source states for synthetic DOPA, police, warrant and AFIS sources plus scenario-specific candidates. It waits a short deterministic delay that can be disabled in tests.

- [ ] **Step 5: Run simulation tests**

Run: `npm test -- --run src/simulation`  
Expected: PASS for validation, ordering and scenario selection.

### Task 3: Responsive app shell and Home

**Files:**
- Create: `src/app/routes.ts`, `src/app/AppShell.tsx`
- Create: `src/components/DemoBadge.tsx`, `src/components/ModuleIcon.tsx`
- Create: `src/features/home/HomePage.tsx`
- Create: `src/styles/shell.css`, `src/styles/home.css`
- Modify: `src/app/App.tsx`
- Test: `src/app/AppShell.test.tsx`

**Interfaces:**
- Consumes: route metadata `{ path, label, shortLabel, icon }[]`
- Produces: `<AppShell><Outlet /></AppShell>` and Home links to all modules

- [ ] **Step 1: Write navigation test**

```tsx
it('offers every primary module from Home', () => {
  renderApp('/')
  for (const label of ['Biometric Field Check', 'Legal AI Assistant', 'Police AI Assistants', 'Operational Flow']) {
    expect(screen.getByRole('link', { name: new RegExp(label) })).toBeInTheDocument()
  }
})
```

- [ ] **Step 2: Verify red state**

Run: `npm test -- --run src/app/AppShell.test.tsx`  
Expected: FAIL because router shell and Home do not exist.

- [ ] **Step 3: Implement routes and shell**

Desktop sidebar includes Home, Field Check, Legal AI, Assistants and Flow. Mobile bottom navigation uses the same five destinations. Top bar contains page title, secure demo status and `ข้อมูลสมมติ` disclosure.

- [ ] **Step 4: Implement Home as an operations launchpad**

Use one primary field-check action, one legal-analysis action and two lower-emphasis module links. Avoid fake metrics and avoid repetitive card grids.

- [ ] **Step 5: Run shell checks**

Run: `npm test -- --run src/app/AppShell.test.tsx && npm run build`  
Expected: PASS.

### Task 4: Biometric Field Check end-to-end flow

**Files:**
- Create: `src/features/field-check/FieldCheckContext.tsx`
- Create: `src/features/field-check/FieldCheckPage.tsx`
- Create: `src/features/field-check/CapturePage.tsx`
- Create: `src/features/field-check/ResultsPage.tsx`
- Create: `src/features/field-check/CandidateDetailPage.tsx`
- Create: `src/features/field-check/components/InputMethod.tsx`
- Create: `src/features/field-check/components/FingerprintCapture.tsx`
- Create: `src/features/field-check/components/FaceCapture.tsx`
- Create: `src/features/field-check/components/SearchSources.tsx`
- Create: `src/features/field-check/components/CandidateCard.tsx`
- Create: `src/components/ScreeningNotice.tsx`
- Create: `src/styles/field-check.css`
- Modify: `src/app/App.tsx`
- Test: `src/features/field-check/FieldCheckFlow.test.tsx`

**Interfaces:**
- Consumes: `simulationService.search`, scenario records and validation functions
- Produces: `FieldCheckProvider` state with `input`, `scenario`, `result`, `selectedCandidate`, `verifiedLocally`

- [ ] **Step 1: Write the core flow test**

```tsx
it('runs a face and name screening and opens candidate detail', async () => {
  const user = userEvent.setup()
  renderApp('/field-check')
  await user.click(screen.getByRole('button', { name: /ชื่อ/ }))
  await user.type(screen.getByLabelText(/ชื่อ-นามสกุล/), 'นาย กิตติ สมมติ')
  await user.click(screen.getByRole('button', { name: /ใบหน้า/ }))
  await user.click(screen.getByRole('button', { name: /เริ่มตรวจสอบ/ }))
  expect(await screen.findByText(/Candidate 1/)).toBeInTheDocument()
  await user.click(screen.getByRole('link', { name: /ดูรายละเอียด Candidate 1/ }))
  expect(screen.getByText(/ผลคัดกรองเบื้องต้น/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the test and confirm red state**

Run: `npm test -- --run src/features/field-check/FieldCheckFlow.test.tsx`  
Expected: FAIL because field routes and context do not exist.

- [ ] **Step 3: Implement input selection and scenario shortcuts**

Allow multiple active methods. Citizen ID is validated before navigation. Scenario shortcuts populate synthetic values and choose deterministic results. The main action remains disabled until at least one method is usable.

- [ ] **Step 4: Implement capture and parallel search states**

Fingerprint states: Connect, Place finger, Quality, Accepted, Search. Face states: Capture, Quality Check, Search, Candidate Ranking. Provide low-quality retry and cancel paths.

- [ ] **Step 5: Implement image-led Candidate List and detail**

Rank biometric candidates by similarity. Show warrant notice only as `พบข้อมูลที่อาจเกี่ยวข้องกับหมายจับ`. Detail shows identity fields, source-by-source cross-check, case category and formal verification guidance.

- [ ] **Step 6: Run field checks**

Run: `npm test -- --run src/features/field-check && npm run build`  
Expected: PASS.

### Task 5: Legal AI structured analysis

**Files:**
- Create: `src/features/legal-ai/legalData.ts`
- Create: `src/features/legal-ai/LegalAIPage.tsx`
- Create: `src/features/legal-ai/components/FactMatrix.tsx`
- Create: `src/features/legal-ai/components/ChargeList.tsx`
- Create: `src/features/legal-ai/components/ChargeDetail.tsx`
- Create: `src/features/legal-ai/components/CitationLink.tsx`
- Create: `src/styles/legal-ai.css`
- Modify: `src/app/App.tsx`
- Test: `src/features/legal-ai/LegalAIPage.test.tsx`

**Interfaces:**
- Produces: `LegalAnalysis`, `CandidateCharge`, `LegalCitation`
- Consumes official citation URLs from Royal Gazette and structured sample penalty fields

- [ ] **Step 1: Write legal interaction test**

```tsx
it('separates facts, candidate charges, missing facts and citations', async () => {
  const user = userEvent.setup()
  renderApp('/legal-ai')
  await user.click(screen.getByRole('button', { name: /ใช้ตัวอย่างคดีลักทรัพย์/ }))
  await user.click(screen.getByRole('button', { name: /วิเคราะห์ประเด็น/ }))
  expect(await screen.findByText('Candidate Charges')).toBeInTheDocument()
  expect(screen.getByText(/ข้อเท็จจริงที่ยังขาด/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /ราชกิจจานุเบกษา/ })).toHaveAttribute('href', expect.stringContaining('ratchakitcha.soc.go.th'))
})
```

- [ ] **Step 2: Verify red state**

Run: `npm test -- --run src/features/legal-ai/LegalAIPage.test.tsx`  
Expected: FAIL because the feature is absent.

- [ ] **Step 3: Define structured legal sample**

Use theft as a demonstration scenario. Candidate charge 1 is theft under section 334 with penalty fields supplied from the official 2017 amendment, and candidate charge 2 prompts the investigator to verify aggravating facts before considering a specific provision. Source URL: `https://www.ratchakitcha.soc.go.th/DATA/PDF/2560/A/032/51.PDF`.

- [ ] **Step 4: Implement analysis workspace**

Left side contains case input and fact matrix. Right side contains ranked charges and selected detail. Mobile stacks input, facts and charges in that order. Each answer carries `รอพนักงานสอบสวนพิจารณา` and date checked.

- [ ] **Step 5: Implement citation and copy-question interactions**

External links open in a new tab with `noopener noreferrer`. Copy action copies only interview questions and announces completion with an ARIA live region.

- [ ] **Step 6: Run legal checks**

Run: `npm test -- --run src/features/legal-ai && npm run build`  
Expected: PASS.

### Task 6: Police AI Assistants

**Files:**
- Create: `src/features/assistants/assistantData.ts`
- Create: `src/features/assistants/AssistantsPage.tsx`
- Create: `src/features/assistants/AssistantChatPage.tsx`
- Create: `src/features/assistants/components/ChatMessage.tsx`
- Create: `src/features/assistants/components/SourceList.tsx`
- Create: `src/styles/assistants.css`
- Modify: `src/app/App.tsx`
- Test: `src/features/assistants/AssistantChatPage.test.tsx`

**Interfaces:**
- Produces: `AssistantProfile`, `SampleConversation`, `SourceReference`
- Consumes route parameter `:id` for investigator, personnel and procurement

- [ ] **Step 1: Write assistant chat test**

```tsx
it('answers a procurement sample prompt with dated official sources', async () => {
  const user = userEvent.setup()
  renderApp('/assistants/procurement')
  await user.click(screen.getByRole('button', { name: /ขั้นตอนจัดทำ TOR/ }))
  expect(await screen.findByText(/ประเด็นที่ควรตรวจ/)).toBeInTheDocument()
  expect(screen.getByText(/24 กุมภาพันธ์ 2560/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Confirm red state**

Run: `npm test -- --run src/features/assistants/AssistantChatPage.test.tsx`  
Expected: FAIL.

- [ ] **Step 3: Implement directory and three assistants**

Provide Investigator, Personnel/HR and Procurement. Use official references:

- G.Tr. appointment rule: `https://ratchakitcha.soc.go.th/documents/140A013N0000000002400.pdf`
- Procurement Act 2017: `https://www.ratchakitcha.soc.go.th/DATA/PDF/2560/A/024/13.PDF`
- Comptroller General Department regulations index: `https://www.cgd.go.th/cs/npa/npa/แผนงาน.html`

- [ ] **Step 4: Implement deterministic chat interaction**

Prompt chips add a user message, show a short thinking state and then append the predefined answer with citations. Free text maps to a safe generic response that asks the user to select a source-backed topic.

- [ ] **Step 5: Run assistant checks**

Run: `npm test -- --run src/features/assistants && npm run build`  
Expected: PASS.

### Task 7: Operational Flow and Presentation Mode

**Files:**
- Create: `src/features/flow/flowData.ts`
- Create: `src/features/flow/FlowPage.tsx`
- Create: `src/features/flow/PresentationPage.tsx`
- Create: `src/features/flow/components/FlowNode.tsx`
- Create: `src/styles/flow.css`
- Modify: `src/app/App.tsx`
- Test: `src/features/flow/PresentationPage.test.tsx`

**Interfaces:**
- Produces: `FlowStep { id, title, shortTitle, description, phase }`
- Produces: keyboard behavior for ArrowLeft, ArrowRight and Escape

- [ ] **Step 1: Write node and keyboard tests**

```tsx
it('opens step detail and advances presentation with ArrowRight', async () => {
  const user = userEvent.setup()
  renderApp('/flow/presentation')
  expect(screen.getByText('ตำรวจภาคสนาม')).toBeInTheDocument()
  await user.keyboard('{ArrowRight}')
  expect(screen.getByText(/Fingerprint.*Face.*Name.*Citizen ID/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Confirm red state**

Run: `npm test -- --run src/features/flow/PresentationPage.test.tsx`  
Expected: FAIL.

- [ ] **Step 3: Implement interactive operational map**

Group steps into Field Screening, Human Review, Formal Verification and Investigation. Clicking a node updates a persistent detail panel without changing the flow order.

- [ ] **Step 4: Implement full-screen presentation**

Hide app navigation, enlarge type, show one active step and adjacent context, provide visible next/previous controls, keyboard support and Escape back to `/flow`.

- [ ] **Step 5: Run flow checks**

Run: `npm test -- --run src/features/flow && npm run build`  
Expected: PASS.

### Task 8: Responsive, accessibility and visual verification

**Files:**
- Modify: `src/styles/*.css`
- Create: `docs/qa/fidelity-ledger.md`
- Create: `docs/qa/test-results.md`

**Interfaces:**
- Consumes: accepted concept images and browser screenshots
- Produces: verified `dist/`, QA ledger and deliverable archive

- [ ] **Step 1: Run complete automated checks**

Run: `npm test -- --run && npm run build`  
Expected: all tests pass and production build succeeds.

- [ ] **Step 2: Run local app and inspect core workflows**

Run: `npm run dev -- --host 0.0.0.0`  
Verify exact-id and multiple-candidate field flows, legal sample analysis, one assistant prompt and presentation keyboard navigation.

- [ ] **Step 3: Capture and inspect required viewports**

Capture Home and Field Check at 390 × 844, Legal AI at 768 × 1024 and 1440 × 900, and Presentation at 1920 × 1080. Confirm no overflow, clipped controls, accidental wrapping or unreadable text.

- [ ] **Step 4: Compare concept and implementation with `view_image`**

Inspect copy, navigation, typography, palette, icon treatment, spacing, responsive behavior and motion. Record each mismatch and its fix in `docs/qa/fidelity-ledger.md`.

- [ ] **Step 5: Run prohibited-copy and synthetic-data checks**

Run:

```bash
rg -n "บุคคลนี้เป็นคนร้าย|AI ยืนยันว่าเป็นผู้ต้องหา|จับกุมทันที|ปล่อยตัวได้" src
rg -n "synthetic: true" src/simulation
```

Expected: prohibited phrases appear only in explicit guardrail tests or documentation; every candidate data record is marked synthetic.

- [ ] **Step 6: Package the verified source**

Create `ai-bip-police-ai-platform.zip` excluding `node_modules`, `dist` screenshots and temporary QA artifacts. Save the archive persistently and provide a clickable handoff link.
