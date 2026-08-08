import { Info } from 'lucide-react'

export function ScreeningNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`screening-notice ${compact ? 'screening-notice--compact' : ''}`} role="note">
      <span className="notice-icon" aria-hidden="true"><Info size={16} /></span>
      <span>
        <strong>ผลคัดกรองเบื้องต้น</strong>
        <small>ข้อมูลนี้เป็นผลคัดกรองเบื้องต้น ไม่ใช่การยืนยันตัวบุคคลหรือสถานะทางคดี</small>
      </span>
    </aside>
  )
}
