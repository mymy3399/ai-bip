import { describe, expect, it, vi } from 'vitest'
import { dispatchShellAction, isShellAction } from './shellActions'

describe('shell action boundary', () => {
  it('accepts only the named internal actions', () => {
    expect(isShellAction('toggle-theme')).toBe(true)
    expect(isShellAction('navigate-back')).toBe(true)
    expect(isShellAction('rm -rf /')).toBe(false)
  })

  it('dispatches an allowlisted action to its handler', () => {
    const toggleTheme = vi.fn()
    dispatchShellAction('toggle-theme', {
      'toggle-theme': toggleTheme,
      'navigate-back': vi.fn(),
    })
    expect(toggleTheme).toHaveBeenCalledOnce()
  })
})
