/**
 * Actions available to the demo shell. This deliberately accepts action IDs,
 * never command strings, so UI input cannot become executable input.
 */
export type ShellAction = 'toggle-theme' | 'navigate-back'

export function isShellAction(value: string): value is ShellAction {
  return value === 'toggle-theme' || value === 'navigate-back'
}

export function dispatchShellAction(action: ShellAction, handlers: Record<ShellAction, () => void>): void {
  handlers[action]()
}
