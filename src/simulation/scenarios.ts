import { candidates } from './candidates'
import type { Candidate, SearchScenario, SourceMatch } from './types'

export interface ScenarioFixture {
  candidates: Candidate[]
  sourceMatches: SourceMatch[]
}

const baseSources: SourceMatch[] = [
  { source: 'ทะเบียนราษฎร์จำลอง', state: 'found', label: 'พบข้อมูลที่เกี่ยวข้อง' },
  { source: 'ฐานข้อมูลตำรวจจำลอง', state: 'found', label: 'พบข้อมูลที่เกี่ยวข้อง' },
  { source: 'ฐานหมายจับจำลอง', state: 'not-found', label: 'ไม่พบข้อมูล' },
  { source: 'AFIS / biometric index จำลอง', state: 'found', label: 'จัดอันดับ Candidate สำเร็จ' },
]

export function getScenarioFixture(scenario: SearchScenario): ScenarioFixture {
  if (scenario === 'exact-id') {
    return { candidates: [candidates[0]], sourceMatches: baseSources }
  }

  if (scenario === 'multiple') {
    return { candidates, sourceMatches: baseSources }
  }

  if (scenario === 'warrant') {
    const candidate = {
      ...candidates[0],
      warrantNotice: {
        number: 'หมายสมมติ-2567-0142',
        issuer: 'หน่วยงานผู้ออกหมายจำลอง',
        category: 'กลุ่มความผิดเกี่ยวกับทรัพย์',
        status: 'รอตรวจสอบกับระบบหลัก',
        receivedAt: '8 ส.ค. 2569 10:24',
      },
    }
    return {
      candidates: [candidate],
      sourceMatches: baseSources.map((item) =>
        item.source === 'ฐานหมายจับจำลอง'
          ? { ...item, state: 'partial', label: 'พบข้อมูลที่อาจเกี่ยวข้อง' }
          : item,
      ),
    }
  }

  if (scenario === 'conflict') {
    return {
      candidates: [
        {
          ...candidates[0],
          crossChecks: [
            ...candidates[0].crossChecks,
            { label: 'ข้อมูลบางรายการไม่สอดคล้อง', state: 'conflict', detail: 'ชื่อและจังหวัดจากแหล่งจำลองต่างกัน' },
          ],
        },
      ],
      sourceMatches: baseSources.map((item) =>
        item.source === 'ฐานข้อมูลตำรวจจำลอง'
          ? { ...item, state: 'conflict', label: 'ข้อมูลไม่สอดคล้องบางรายการ' }
          : item,
      ),
    }
  }

  return {
    candidates: [],
    sourceMatches: baseSources.map((item) => ({ ...item, state: 'not-found', label: 'ไม่พบข้อมูล' })),
  }
}
