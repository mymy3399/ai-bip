import { rankCandidates } from './validation'
import { simulationService } from './SimulationService'
import type { Candidate } from './types'

describe('simulation service', () => {
  it('orders biometric candidates by similarity without asserting identity', () => {
    const ranked = rankCandidates([
      { id: 'b', similarity: 84 } as Candidate,
      { id: 'a', similarity: 91 } as Candidate,
    ])

    expect(ranked.map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('returns three synthetic candidates for the multiple-candidate scenario', async () => {
    const result = await simulationService.search(
      { fullName: 'นาย กิตติ สมมติ', face: true },
      'multiple',
      { delayMs: 0 },
    )

    expect(result.candidates).toHaveLength(3)
    expect(result.candidates.every((item) => item.synthetic)).toBe(true)
    expect(result.candidates.map((item) => item.similarity)).toEqual([91, 84, 76])
  })

  it('returns a possible warrant notice without an arrest instruction', async () => {
    const result = await simulationService.search(
      { citizenId: '0000000000000' },
      'warrant',
      { delayMs: 0 },
    )

    expect(result.candidates[0].warrantNotice?.number).toBe('หมายสมมติ-2567-0142')
    expect(result.disclosure).toMatch(/ผลคัดกรองเบื้องต้น/)
    expect(result.disclosure).not.toMatch(/จับกุมทันที/)
  })
})
