import type { Candidate } from './types'

export function validateCitizenId(value: string): string | null {
  if (!/^\d{13}$/.test(value)) {
    return 'เลขประจำตัวประชาชนต้องเป็นตัวเลข 13 หลักในข้อมูลจำลอง'
  }

  return null
}

export function rankCandidates(items: Candidate[]): Candidate[] {
  return [...items].sort((left, right) => (right.similarity ?? -1) - (left.similarity ?? -1))
}
