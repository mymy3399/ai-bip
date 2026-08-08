import { validateCitizenId } from './validation'

describe('citizen ID validation', () => {
  it('accepts exactly thirteen numeric characters in the demo', () => {
    expect(validateCitizenId('0000000000000')).toBeNull()
  })

  it('explains when a citizen ID does not have thirteen digits', () => {
    expect(validateCitizenId('123')).toMatch(/13 หลัก/)
  })
})
