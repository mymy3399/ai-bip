import { describe, expect, it } from 'vitest'
import { getSearchMethodLabel, getSearchNameLabel, getVisibleCandidateIds, isOneToOneSearch, readFieldResult } from './fieldResultsStorage'

describe('field result storage parsing', () => {
  it('falls back safely when stored data is malformed', () => {
    const storage = { getItem: () => '{bad json' } as unknown as Storage
    const result = readFieldResult(storage)
    expect(result).toBeNull()
    expect(getSearchMethodLabel(result)).toBe('Face + Name Screening')
  })

  it('derives labels and selected candidate IDs from a valid result', () => {
    const result = { candidates: [{ id: 'candidate-2' }], searchMethods: ['Face', 'ID Card'], searchQuery: { fullName: 'สมชาย' } }
    expect(getVisibleCandidateIds(result)).toEqual(new Set(['candidate-2']))
    expect(getSearchMethodLabel(result)).toBe('Face + ID Card')
    expect(getSearchNameLabel(result)).toBe('สมชาย')
    expect(isOneToOneSearch(result)).toBe(false)
  })

  it('recognizes an ID-only search', () => {
    const result = { searchMethods: ['ID Card'], searchQuery: { citizenId: '123' } }
    expect(getSearchNameLabel(result)).toBe('ค้นด้วยเลขประชาชน')
    expect(isOneToOneSearch(result)).toBe(true)
  })
})
