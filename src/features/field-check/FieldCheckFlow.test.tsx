import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../../app/App'

describe('Biometric Field Check flow', () => {
  it('runs a name and face screening and opens candidate detail', async () => {
    const user = userEvent.setup()
    window.history.replaceState({}, '', '/')
    render(<App />)

    await user.click(screen.getByRole('link', { name: /Biometric Field Check/i }))
    expect(screen.getByRole('heading', { name: /Biometric Field Check/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /ชื่อ-นามสกุล/i }))
    await user.type(screen.getByLabelText(/ชื่อ-นามสกุล/i), 'นาย กิตติ สมมติ')
    await user.click(screen.getByRole('button', { name: /Face/i }))
    await user.click(screen.getByRole('button', { name: /บันทึกและค้นหา/i }))

    expect(await screen.findByText(/รายละเอียด Candidate 1/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /เปิดรายละเอียดเพื่อตรวจสอบ/i }))
    expect(await screen.findByRole('heading', { name: /นาย กิตติ สมมติ/i })).toBeInTheDocument()
    expect(screen.getAllByText(/ผลคัดกรองเบื้องต้น/i).length).toBeGreaterThan(0)
  })
})
