import { render, screen } from '@testing-library/react'
import { App } from '../../app/App'

it('shows structured candidate charges with legal citations', () => {
  window.history.replaceState({}, '', '/legal-ai')
  render(<App />)
  expect(screen.getByRole('heading', { name: /Legal AI Assistant/i })).toBeInTheDocument()
  expect(screen.getByText(/Candidate Charges/i)).toBeInTheDocument()
  expect(screen.getByText(/ข้อเท็จจริงที่ยังขาด/i)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /ราชกิจจานุเบกษา/i })).toHaveAttribute('href', expect.stringContaining('ratchakitcha.soc.go.th'))
})
