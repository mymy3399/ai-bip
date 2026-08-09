# CodeFlow Analysis Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Resolve the CodeFlow findings while preserving the existing demo behavior and UI.

**Architecture:** Keep feature ownership inside `src/features`, move static data and pure parsing into feature modules, and keep `src/app` responsible only for routing and shell composition. Replace any command-capable shell abstraction with an allowlisted, non-user-controlled action API.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, lucide-react.

## Global Constraints

- Preserve existing routes, visible labels, and demo-only behavior.
- Do not introduce runtime dependencies.
- Do not execute arbitrary system commands or interpolate user input into commands.
- Add regression tests before production changes for security and extracted pure logic.

### Task 1: Establish a clean baseline and security regression coverage

**Files:**
- Modify: `src/app/AppShell.test.tsx`
- Create: `src/app/shellActions.ts`
- Create: `src/app/shellActions.test.ts`

- [ ] Add tests proving only named internal actions can run and arbitrary command strings are rejected.
- [ ] Run the focused tests and confirm the new tests fail before implementation.
- [ ] Implement a typed allowlist action dispatcher with no shell/process API and export it for the shell.
- [ ] Run focused tests and the existing suite.

### Task 2: Remove app-layer coupling and the utils-to-components violation

**Files:**
- Modify: `src/app/App.tsx`
- Modify: `src/app/AppShell.tsx`
- Modify: `src/app/routes.ts`
- Create: `src/app/routeConfig.tsx`
- Modify: `src/components/DemoBadge.tsx`

- [ ] Move route metadata and route element composition into a single app-owned configuration module.
- [ ] Keep reusable visual components imported only by feature/app layers, never by utilities.
- [ ] Add/adjust route tests for every primary route and fallback behavior.
- [ ] Run typecheck and app tests.

### Task 3: Decompose field results responsibilities

**Files:**
- Create: `src/features/field-check/fieldResultsData.ts`
- Create: `src/features/field-check/fieldResultsStorage.ts`
- Create: `src/features/field-check/FieldCandidateCard.tsx`
- Create: `src/features/field-check/FieldCandidatePanel.tsx`
- Modify: `src/features/field-check/FieldResultsPage.tsx`
- Create: `src/features/field-check/fieldResultsStorage.test.ts`

- [ ] Extract candidate fixtures and session-storage parsing into pure modules.
- [ ] Add tests for malformed storage, empty IDs, search labels, and one-to-one mode.
- [ ] Extract candidate list/detail presentation while keeping page state orchestration in the page.
- [ ] Run focused tests, typecheck, and the full suite.

### Task 4: Decompose Legal AI and ANPR feature data/presentation

**Files:**
- Create: `src/features/legal-ai/legalData.ts`
- Create: `src/features/legal-ai/LegalAnalyzerPanel.tsx`
- Create: `src/features/legal-ai/LegalLibraryPanel.tsx`
- Modify: `src/features/legal-ai/LegalAIPage.tsx`
- Create: `src/features/surveillance/anprData.ts`
- Create: `src/features/surveillance/AnprToolPanels.tsx`
- Create: `src/features/surveillance/AnprMonitorPanel.tsx`
- Modify: `src/features/surveillance/ANPRSurveillancePage.tsx`

- [ ] Move static scenario/statute/detection data out of page components.
- [ ] Extract independent analyzer/library, watchlist/transport, and monitor panels with typed props.
- [ ] Keep asynchronous demo timers and user-visible interactions unchanged.
- [ ] Run feature tests, typecheck, and build.

### Task 5: Reduce biometric complexity and verify all findings

**Files:**
- Modify: `src/features/field-check/BiometricFaceViewfinder.tsx`
- Modify: `src/features/field-check/BiometricFingerprintViewfinder.tsx`
- Create: `src/features/field-check/biometricScan.ts`
- Create: `src/features/field-check/biometricScan.test.ts`
- Modify: `README.md`

- [ ] Extract timer/progress transitions into tested pure helpers and ensure timers are cleaned up.
- [ ] Run the full test suite, typecheck, and production build.
- [ ] Re-scan source for command execution, cross-layer imports, and remaining oversized page responsibilities.
- [ ] Document the security boundary and verification commands in the README.
