import { useState } from 'react'
import { Check, Fingerprint, RefreshCw } from 'lucide-react'
import { advanceScanProgress, minutiaeForProgress } from './biometricScan'

interface BiometricFingerprintViewfinderProps {
  onScanComplete?: () => void
}

export function BiometricFingerprintViewfinder({ onScanComplete }: BiometricFingerprintViewfinderProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [liveProgress, setLiveProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [minutiaePoints, setMinutiaePoints] = useState(0)

  function handleTriggerScan() {
    if (isScanning) return
    setIsScanning(true)
    setIsComplete(false)
    setLiveProgress(5)
    setMinutiaePoints(4)

    let current = 5
    const interval = setInterval(() => {
      current = advanceScanProgress(current, 6)
      if (current >= 100) {
        current = 100
        clearInterval(interval)
        setIsScanning(false)
        setIsComplete(true)
        setMinutiaePoints(64)
        if (onScanComplete) onScanComplete()
      } else {
        setMinutiaePoints(minutiaeForProgress(current))
      }
      setLiveProgress(current)
    }, 140)
  }

  const revealHeight = (liveProgress / 100) * 220

  return (
    <div className="futuristic-fingerprint-container">
      {/* High-Tech Viewfinder Screen */}
      <div className={`futuristic-scanner-viewport ${isScanning ? 'active-scanning' : ''}`}>
        {/* Glass Glare Overlay */}
        <div className="glass-glare-effect" />

        {/* HUD Tactical Reticle Corner Brackets */}
        <div className="hud-corner top-left" />
        <div className="hud-corner top-right" />
        <div className="hud-corner bottom-left" />
        <div className="hud-corner bottom-right" />

        {/* Top Header Badge inside Scanner Screen */}
        <div className="hud-header-badge">
          <span className={`live-dot ${isScanning ? 'scanning-pulse' : ''}`} />
          {isScanning ? 'SCANNING AFIS FAP-20...' : isComplete ? 'AFIS MATCH READY' : 'STANDBY SENSOR'}
        </div>

        {/* High-Detail Vector Fingerprint Ridge & Minutiae Art */}
        <svg viewBox="0 0 200 220" className="fingerprint-vector-svg" aria-label="AFIS Fingerprint Scanner Visual">
          <defs>
            {/* Neon Glow Filters */}
            <filter id="cyanNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient for Fingerprint Ridges */}
            <linearGradient id="ridgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isComplete ? 'var(--success)' : 'var(--tactical-blue)'} />
              <stop offset="50%" stopColor="var(--blue-600)" />
              <stop offset="100%" stopColor={isComplete ? 'var(--success)' : 'var(--tactical-blue)'} />
            </linearGradient>

            {/* Radar Scan Grid Pattern */}
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.8" />
            </pattern>
            <clipPath id="fingerprintReveal">
              <rect x="0" y="0" width="200" height={revealHeight} />
            </clipPath>
          </defs>

          {/* Background Grid */}
          <rect width="200" height="220" fill="url(#gridPattern)" />

          {/* Concentric Radar Circles */}
          <circle cx="100" cy="110" r="40" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="110" r="70" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="5 5" />
          <circle className="fingerprint-pulse-ring" cx="100" cy="110" r="95" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1" />

          {/* Detailed Fingerprint Ridge Loop Architecture */}
          {liveProgress > 0 && (
          <g className="fingerprint-ridges" clipPath="url(#fingerprintReveal)" filter="url(#cyanNeonGlow)" stroke="url(#ridgeGradient)" strokeWidth="2.2" strokeLinecap="round" fill="none">
            <path d="M 100 85 C 92 85, 88 92, 88 102 C 88 115, 95 125, 100 135 C 105 125, 112 115, 112 102 C 112 92, 108 85, 100 85 Z" opacity="0.9" />
            <path d="M 100 75 C 84 75, 78 86, 78 102 C 78 122, 90 138, 100 150 C 110 138, 122 122, 122 102 C 122 86, 116 75, 100 75 Z" opacity="0.85" />
            <path d="M 100 65 C 76 65, 68 80, 68 102 C 68 128, 85 148, 100 162 C 115 148, 132 128, 132 102 C 132 80, 124 65, 100 65 Z" opacity="0.8" />
            <path d="M 100 55 C 68 55, 58 74, 58 102 C 58 135, 80 158, 100 174 C 120 158, 142 135, 142 102 C 142 74, 132 55, 100 55 Z" opacity="0.75" />
            <path d="M 100 45 C 60 45, 48 68, 48 102 C 48 142, 75 168, 100 186 C 125 168, 152 142, 152 102 C 152 68, 140 45, 100 45 Z" opacity="0.7" />
            <path d="M 100 35 C 52 35, 38 62, 38 102 C 38 148, 70 178, 100 198 C 130 178, 162 148, 162 102 C 162 62, 148 35, 100 35 Z" opacity="0.6" />

            <path d="M 45 130 C 55 145, 75 170, 92 188" opacity="0.75" />
            <path d="M 155 130 C 145 145, 125 170, 108 188" opacity="0.75" />
          </g>
          )}

          {/* AFIS Minutiae Feature Nodes (Bifurcations & Endings) */}
          {(isScanning || isComplete || minutiaePoints > 0) && (
            <g filter="url(#nodeGlow)">
              <circle className="fingerprint-core" cx="100" cy="100" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="100" y1="100" x2="135" y2="85" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />
              <rect x="135" y="78" width="55" height="14" rx="3" fill="#060b17" stroke="#38bdf8" strokeWidth="1" />
              <text x="140" y="88" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">PT-01:CORE</text>

              {minutiaePoints > 15 && (
                <>
                  <circle cx="78" cy="115" r="4.5" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="78" y1="115" x2="45" y2="95" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />
                  <rect x="12" y="88" width="52" height="14" rx="3" fill="#060b17" stroke="#fbbf24" strokeWidth="1" />
                  <text x="16" y="98" fill="#fbbf24" fontSize="8" fontWeight="bold" fontFamily="monospace">PT-02:BIFUR</text>
                </>
              )}

              {minutiaePoints > 35 && (
                <circle cx="122" cy="120" r="4.5" fill="#34d399" stroke="#ffffff" strokeWidth="1.5" />
              )}
              {minutiaePoints > 50 && (
                <circle cx="100" cy="65" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
              )}
            </g>
          )}
        </svg>

        {/* Dynamic Sweeping Cyan Laser Scanning Line */}
        {(isScanning || liveProgress > 0) && (
          <div className={`futuristic-laser-line ${isScanning ? 'fast-laser' : ''}`}>
            <div className="laser-glow-aura" />
          </div>
        )}

        {/* Bottom HUD Minutiae Badge inside Scanner Frame */}
        <div className="hud-bottom-badge">
          MINUTIAE: <strong>{minutiaePoints} POINTS</strong> {isComplete && '(98.6%)'}
        </div>
      </div>

      {/* Scanner Status and Quality Column */}
      <div className="scanner-status-col">
        <div className="scanner-headline-row">
          <strong>
            {isScanning
              ? 'กำลังสแกนวิเคราะห์ลายนิ้วมือ AFIS...'
              : isComplete
              ? 'สแกนลายนิ้วมือสำเร็จ (AFIS Matched)'
              : 'พร้อมสำหรับการสแกนลายนิ้วมือ'}
          </strong>
          {isComplete && <span className="quality-pill">คุณภาพ 98%</span>}
        </div>
        <small className="scanner-subtext">
          {isScanning
            ? 'กรุณาวางนิ้วมือบนกระจกสแกน อุปกรณ์กำลังตรวจจับจุด Minutiae'
            : isComplete
            ? 'สกัดจุด Minutiae 64 Points เรียบร้อย พร้อมเปรียบเทียบกับฐานข้อมูลตำรวจ'
            : 'กดปุ่ม "เริ่มสแกนลายนิ้วมือ" เพื่อจำลองการสแกนด้วยเครื่อง FAP20'}
        </small>

        {/* Interactive Start Scan Action Button */}
        <div className="scanner-action-btn-row">
          <button
            type="button"
            className={`btn-trigger-fingerprint-scan ${isScanning ? 'scanning' : isComplete ? 'complete' : ''}`}
            onClick={handleTriggerScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <RefreshCw size={16} className="spin-icon" /> กำลังสแกนแอนิเมชันเรียลไทม์ ({liveProgress}%)
              </>
            ) : isComplete ? (
              <>
                <RefreshCw size={16} /> สแกนลายนิ้วมือใหม่อีกครั้ง
              </>
            ) : (
              <>
                <Fingerprint size={18} /> เริ่มสแกนลายนิ้วมือ (Start Biometric Scan)
              </>
            )}
          </button>
        </div>

        {/* Live Progress Bar */}
        {(isScanning || liveProgress > 0) && (
          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${liveProgress}%` }} />
            </div>
            <span className="progress-percent">{liveProgress}%</span>
          </div>
        )}

        {/* Status Checklist */}
        <div className="scan-checklist">
          <div className={`check-item ${liveProgress >= 20 ? 'done' : 'pending'}`}>
            <Check size={14} /> <span>ตรวจจับลายนิ้วมือความละเอียดสูง (FAP20 Sensor)</span>
          </div>
          <div className={`check-item ${liveProgress >= 70 ? 'done' : 'pending'}`}>
            <Check size={14} /> <span>สกัดจุดคุณลักษณะ Minutiae ({minutiaePoints} Points)</span>
          </div>
          <div className={`check-item ${isComplete ? 'done' : 'pending'}`}>
            {isComplete ? <Check size={14} /> : <RefreshCw size={13} className="spin-icon" />}
            <span>เปรียบเทียบข้อมูลกับระบบ AFIS ตำรวจ</span>
          </div>
        </div>
      </div>
    </div>
  )
}
