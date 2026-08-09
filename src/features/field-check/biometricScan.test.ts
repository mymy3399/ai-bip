import { describe, expect, it } from 'vitest'
import { advanceScanProgress, minutiaeForProgress } from './biometricScan'

describe('biometric scan progress', () => {
  it('caps progress at completion', () => {
    expect(advanceScanProgress(95, 8, 0.99)).toBe(100)
  })

  it('maps partial progress to minutiae and completion to the full set', () => {
    expect(minutiaeForProgress(50)).toBe(32)
    expect(minutiaeForProgress(100)).toBe(64)
  })
})
