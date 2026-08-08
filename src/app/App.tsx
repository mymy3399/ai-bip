import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './AppShell'
import { ModulePlaceholder } from './ModulePlaceholder'
import { HomePage } from '../features/home/HomePage'
import { FieldCheckPage, FieldCapturePage } from '../features/field-check/FieldCheckPage'
import { FieldResultsPage } from '../features/field-check/FieldResultsPage'
import { FieldCandidateDetailPage } from '../features/field-check/FieldCandidateDetailPage'
import { LegalAIPage } from '../features/legal-ai/LegalAIPage'
import { ANPRSurveillancePage } from '../features/surveillance/ANPRSurveillancePage'
import { AssistantsPage } from '../features/assistants/AssistantsPage'
import { FlowPage, PresentationPage } from '../features/flow/FlowPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/field-check" element={<FieldCheckPage />} />
          <Route path="/field-check/capture" element={<FieldCapturePage />} />
          <Route path="/field-check/results" element={<FieldResultsPage />} />
          <Route path="/field-check/candidate/:candidateId" element={<FieldCandidateDetailPage />} />
          <Route path="/surveillance" element={<ANPRSurveillancePage />} />
          <Route path="/legal-ai" element={<LegalAIPage />} />
          <Route path="/assistants/*" element={<AssistantsPage />} />
          <Route path="/flow" element={<FlowPage />} />
          <Route path="/flow/presentation" element={<PresentationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
