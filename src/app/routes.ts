import type { LucideIcon } from 'lucide-react'
import { Bot, Camera, Home, Network, Scale, ScanFace } from 'lucide-react'

export interface AppRoute {
  path: string
  label: string
  shortLabel: string
  icon: LucideIcon
}

export const primaryRoutes: AppRoute[] = [
  { path: '/', label: 'Home', shortLabel: 'Home', icon: Home },
  { path: '/field-check', label: 'Biometric Field Check', shortLabel: 'Field Check', icon: ScanFace },
  { path: '/surveillance', label: 'ANPR Surveillance', shortLabel: 'ANPR Watch', icon: Camera },
  { path: '/legal-ai', label: 'Legal AI', shortLabel: 'Legal AI', icon: Scale },
  { path: '/assistants', label: 'Assistants', shortLabel: 'Assistants', icon: Bot },
  { path: '/flow', label: 'Flow', shortLabel: 'Flow', icon: Network },
]

export function routeMatches(pathname: string, routePath: string): boolean {
  if (routePath === '/') return pathname === '/'
  return pathname === routePath || pathname.startsWith(`${routePath}/`)
}
