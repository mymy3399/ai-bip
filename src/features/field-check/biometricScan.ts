function secureRandomFraction(): number {
  const values = new Uint32Array(1)
  globalThis.crypto.getRandomValues(values)
  return values[0] / 2 ** 32
}

export function advanceScanProgress(current: number, minimumStep: number, random = secureRandomFraction()): number {
  const step = Math.floor(random * 15) + minimumStep
  return Math.min(100, current + step)
}

export function minutiaeForProgress(progress: number): number {
  return progress >= 100 ? 64 : Math.floor((progress / 100) * 64)
}
