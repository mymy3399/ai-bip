import { getScenarioFixture } from './scenarios'
import type { FieldSearchInput, SearchOptions, SearchResult, SearchScenario } from './types'
import { rankCandidates } from './validation'

const disclosure = 'ข้อมูลนี้เป็นผลคัดกรองเบื้องต้น ไม่ใช่การยืนยันตัวบุคคลหรือสถานะทางคดี'

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, delayMs))
}

export const simulationService = {
  async search(input: FieldSearchInput, scenario: SearchScenario = 'multiple', options: SearchOptions = {}): Promise<SearchResult> {
    void input
    await wait(options.delayMs ?? 420)
    const fixture = getScenarioFixture(scenario)
    const rankedCandidates = rankCandidates(fixture.candidates)
    const searchMethods = [
      input.face ? 'Face' : null,
      input.fingerprint ? 'Fingerprint' : null,
      input.fullName || input.citizenId ? 'ID Card' : null,
    ].filter((method): method is string => method !== null)

    return {
      scenario,
      candidates: options.multiModal && scenario === 'multiple' ? rankedCandidates.slice(0, 1) : rankedCandidates,
      sourceMatches: fixture.sourceMatches,
      disclosure,
      completedAt: '8 ส.ค. 2569 10:24',
      searchMethods,
      searchQuery: {
        fullName: input.fullName,
        citizenId: input.citizenId,
      },
    }
  },
}
