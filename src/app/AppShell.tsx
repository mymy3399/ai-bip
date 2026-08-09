import { useEffect, useState } from 'react'
import { ArrowLeft, LockKeyhole, Moon, ShieldCheck, Sun } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import mark from '../assets/ai-bip-mark.png'
import { DemoBadge } from '../components/DemoBadge'
import { ImageFrame } from '../components/ImageFrame'
import { primaryRoutes, routeMatches } from './routes'
import { dispatchShellAction } from './shellActions'

function getPageTitle(pathname: string): string {
  return primaryRoutes.find((route) => routeMatches(pathname, route.path))?.label ?? 'AI-BIP'
}

function Brand() {
  return (
    <div className="brand-lockup">
      <ImageFrame src={mark} alt="ตราสัญลักษณ์โครงการ AI-BIP" />
      <span>
        <strong>AI-BIP</strong>
        <small>Police AI Platform</small>
      </span>
    </div>
  )
}

function Navigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav className={mobile ? 'mobile-nav' : 'sidebar-nav'} aria-label={mobile ? 'เมนูหลักบนมือถือ' : 'เมนูหลัก'}>
      {primaryRoutes.map((route) => {
        const Icon = route.icon
        return (
          <NavLink
            key={route.path}
            to={route.path}
            end={route.path === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon aria-hidden="true" />
            <span>{route.shortLabel}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('ai-bip-theme') as 'dark' | 'light') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ai-bip-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Brand />
        <Navigation />
        <div className="sidebar-footer">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => dispatchShellAction('toggle-theme', { 'toggle-theme': toggleTheme, 'navigate-back': () => navigate(-1) })}
            aria-label={`สลับเป็นโหมด ${theme === 'dark' ? 'สว่าง (Light Mode)' : 'มืด (Dark Mode)'}`}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <div className="secure-chip">
            <ShieldCheck aria-hidden="true" />
            <span>Secure Demo Mode</span>
            <i aria-label="สถานะปลอดภัย" />
          </div>
          <div className="operator-chip">
            <span className="operator-avatar">ร.ต.อ.</span>
            <span>
              <strong>กิตติ สมมติ</strong>
              <small>สถานีตำรวจจำลอง</small>
            </span>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="mobile-brand"><Brand /></div>
          {pathname !== '/' && (
            <button
              type="button"
              className="topbar-back-btn"
              onClick={() => navigate(-1)}
              aria-label="ย้อนกลับไปหน้าก่อนหน้า"
            >
              <ArrowLeft size={16} />
              <span>ย้อนกลับ</span>
            </button>
          )}
          <div className="topbar-title">
            <LockKeyhole aria-hidden="true" />
            <h1>{getPageTitle(pathname)}</h1>
          </div>
          <div className="topbar-status">
            <button
              type="button"
              className="theme-toggle-btn theme-toggle-btn--header"
              onClick={() => dispatchShellAction('toggle-theme', { 'toggle-theme': toggleTheme, 'navigate-back': () => navigate(-1) })}
              aria-label={`สลับเป็นโหมด ${theme === 'dark' ? 'สว่าง' : 'มืด'}`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <span className="secure-status"><LockKeyhole aria-hidden="true" /> Secure Demo Mode</span>
            <DemoBadge />
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <div className="mobile-demo-status"><DemoBadge /></div>
      <Navigation mobile />
    </div>
  )
}
