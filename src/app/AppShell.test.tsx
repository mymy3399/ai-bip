import { render, screen } from '@testing-library/react'
import { App } from './App'

describe('App shell navigation', () => {
  it('offers every primary module from Home', () => {
    render(<App />)

    for (const label of ['Biometric Field Check', 'Legal AI Assistant', 'Police AI Assistants', 'Operational Flow']) {
      expect(screen.getByRole('link', { name: new RegExp(label) })).toBeInTheDocument()
    }
  })

  it('shows the persistent demo disclosure in the shell', () => {
    render(<App />)

    expect(screen.getAllByText(/DEMO · ข้อมูลสมมติ/).length).toBeGreaterThan(0)
  })
})
