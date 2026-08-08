# AI-BIP prototype QA

## Automated

- `npm run test:run`: 6 test files, 10 tests passed.
- `npm run build`: TypeScript and Vite production build passed.
- Latest verification: 6 test files, 10 tests passed; Vite build passed after Legal AI context updates and ANPR navigation updates.
- Human-in-the-loop prohibited-copy scan: UI source contains none of the prohibited arrest/identity certainty phrases.

## Rendered fallback

The Browser plugin was not available in this session. Playwright CLI was attempted as the documented fallback, but the Chromium download endpoint returned a truncated archive in the managed environment. The dev server was verified on `http://127.0.0.1:5180/`; rendered screenshots were therefore not captured in this run.

## Key interaction coverage

- Field Check: select Face + Name, run simulated screening, open Candidate Detail.
- Legal AI: Candidate Charges tab switching and official citation link.
- Legal AI: Fact Analyzer loading workflow, scenario-specific Candidate Charges/Fact Matrix, case-specific precedents, bail assessment, and statute ordering.
- ANPR: primary tabs, nested Real-time tabs, watchlist entry, transport lookup input/image flow, and responsive navigation.
- Assistants: prompt chip/chat response and citation row.
- Flow: clickable nodes and Presentation Mode route.
