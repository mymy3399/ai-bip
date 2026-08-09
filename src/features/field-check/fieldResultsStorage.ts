export interface FieldResultStorage {
  candidates?: Array<{ id: string }>
  searchMethods?: string[]
  searchQuery?: { fullName?: string; citizenId?: string }
}

export function readFieldResult(storage: Storage = sessionStorage): FieldResultStorage | null {
  const rawResult = storage.getItem('ai-bip-field-result')
  if (!rawResult) return null

  try {
    return JSON.parse(rawResult) as FieldResultStorage
  } catch {
    return null
  }
}

export function getVisibleCandidateIds(result: FieldResultStorage | null): Set<string> | null {
  return result?.candidates ? new Set(result.candidates.map((candidate) => candidate.id)) : null
}

export function getSearchMethodLabel(result: FieldResultStorage | null): string {
  return result?.searchMethods?.length ? result.searchMethods.join(' + ') : result ? 'Field Screening' : 'Face + Name Screening'
}

export function getSearchNameLabel(result: FieldResultStorage | null): string {
  if (!result?.searchMethods?.includes('ID Card')) return 'ไม่ได้ใช้ชื่อค้นหา'
  return result.searchQuery?.fullName || (result.searchQuery?.citizenId ? 'ค้นด้วยเลขประชาชน' : 'ไม่ได้ใช้ชื่อค้นหา')
}

export function isOneToOneSearch(result: FieldResultStorage | null): boolean {
  return result?.searchMethods?.length === 1 && result.searchMethods[0] === 'ID Card'
}
