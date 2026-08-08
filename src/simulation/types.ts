export type SearchScenario = 'exact-id' | 'multiple' | 'warrant' | 'conflict' | 'no-result'

export type SourceState = 'searching' | 'found' | 'not-found' | 'partial' | 'conflict'

export interface FieldSearchInput {
  citizenId?: string
  fullName?: string
  fingerprint?: boolean
  face?: boolean
}

export interface SourceMatch {
  source: string
  state: Exclude<SourceState, 'searching'>
  label: string
}

export interface Candidate {
  id: string
  synthetic: true
  displayName: string
  portraitUrl: string
  ageApprox: number
  similarity?: number
  identityFields: Array<{ label: string; value: string }>
  crossChecks: Array<{
    label: string
    state: 'match' | 'possible' | 'conflict' | 'unknown'
    detail: string
  }>
  caseGroups: Array<{ label: string; status: string }>
  warrantNotice?: {
    number: string
    issuer: string
    category: string
    status: string
    receivedAt: string
  }
}

export interface SearchResult {
  scenario: SearchScenario
  candidates: Candidate[]
  sourceMatches: SourceMatch[]
  disclosure: string
  completedAt: string
  searchMethods?: string[]
  searchQuery?: Pick<FieldSearchInput, 'fullName' | 'citizenId'>
}

export interface SearchOptions {
  delayMs?: number
  multiModal?: boolean
}
