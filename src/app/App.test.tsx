import { render, screen } from '@testing-library/react'
import { App } from './App'

describe('App foundation', () => {
  it('renders the AI-BIP application name and demo disclosure', () => {
    render(<App />)

    expect(screen.getAllByText('AI-BIP').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/ข้อมูลสมมติ/).length).toBeGreaterThan(0)
  })
})
