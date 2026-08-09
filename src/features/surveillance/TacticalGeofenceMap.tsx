import { useState } from 'react'
import {
  Car,
  CheckCircle2,
  Compass,
  Lock,
  Navigation,
  Radio,
} from 'lucide-react'

interface PatrolUnit {
  id: string
  name: string
  code: string
  distance: string
  eta: string
  status: 'available' | 'dispatching' | 'intercepting'
  lat: number
  lng: number
}

const mockPatrolUnits: PatrolUnit[] = [
  { id: 'p1', name: 'จักรยานยนต์สายตรวจ 101', code: 'PATROL-101', distance: '1.2 กม.', eta: '3 นาที', status: 'available', lat: 35, lng: 42 },
  { id: 'p2', name: 'รถยนต์สายตรวจ 204', code: 'PATROL-204', distance: '2.8 กม.', eta: '6 นาที', status: 'available', lat: 60, lng: 70 },
  { id: 'p3', name: 'หน่วยสืบสวนเคลื่อนที่เร็ว 105', code: 'RAPID-105', distance: '4.1 กม.', eta: '9 นาที', status: 'available', lat: 25, lng: 75 },
]

export function TacticalGeofenceMap({
  targetPlate = '1กข 9988',
  targetLocation = 'ถนนวิภาวดีรังสิต ขาออก (CAM-04)',
}: {
  targetPlate?: string
  targetLocation?: string
}) {
  const [geofenceLocked, setGeofenceLocked] = useState(false)
  const [showEscapeRadius, setShowEscapeRadius] = useState(true)
  const [dispatchedUnits, setDispatchedUnits] = useState<string[]>([])
  const [activeNotification, setActiveNotification] = useState<string | null>(null)
  const [selectedRadius] = useState<'5m' | '10m' | '15m'>('5m')

  function handleDispatchUnit(unit: PatrolUnit) {
    if (dispatchedUnits.includes(unit.id)) return
    setDispatchedUnits((prev) => [...prev, unit.id])
    setActiveNotification(`ส่งวิทยุสั่งการถึง ${unit.name} (${unit.code}) ให้มุ่งหน้าไปยังพิกัดสกัดจับแล้ว (ETA: ${unit.eta})`)
    setTimeout(() => setActiveNotification(null), 5000)
  }

  function handleToggleGeofence() {
    setGeofenceLocked((prev) => !prev)
    if (!geofenceLocked) {
      setActiveNotification(`สั่งการล็อกพื้นที่ Geofence Lock รัศมี ${selectedRadius === '5m' ? '3.5 กม.' : selectedRadius === '10m' ? '7.0 กม.' : '12 กม.'} รอบจุดสแกนแล้ว`)
    } else {
      setActiveNotification('ปลดล็อกพื้นที่ Geofence Lock เรียบร้อยแล้ว')
    }
    setTimeout(() => setActiveNotification(null), 5000)
  }

  return (
    <div className="tactical-geofence-map-container">
      {/* Map Control Bar */}
      <div className="map-control-bar">
        <div className="map-title-wrap">
          <Compass className="map-icon spin-subtle" size={18} />
          <span>แผนที่พิกัดปิดล้อมเรียลไทม์ (Tactical Geofence Intercept Grid)</span>
        </div>

        <div className="map-action-btns">
          <button
            type="button"
            className={`map-tool-btn ${showEscapeRadius ? 'active' : ''}`}
            onClick={() => setShowEscapeRadius((prev) => !prev)}
          >
            <Navigation size={14} />
            <span>รัศมีหลบหนี ({selectedRadius})</span>
          </button>

          <button
            type="button"
            className={`map-tool-btn danger ${geofenceLocked ? 'active-lock' : ''}`}
            onClick={handleToggleGeofence}
          >
            <Lock size={14} />
            <span>{geofenceLocked ? '🔒 GEOFENCE LOCKED' : 'สั่งการ Geofence Lock'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {activeNotification && (
        <div className="geofence-toast-banner">
          <CheckCircle2 size={16} />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Interactive Visual Map Container */}
      <div className={`map-canvas-viewport ${geofenceLocked ? 'geofence-active' : ''}`}>
        {/* Tactical Radar Grid Lines */}
        <div className="radar-grid-background" />
        <div className="radar-sweep-beam" />

        {/* Predictive Escape Radius Rings */}
        {showEscapeRadius && (
          <div className="escape-rings-layer">
            <div className={`escape-ring ring-5m ${selectedRadius === '5m' ? 'focused' : ''}`}>
              <span className="ring-label">5 นาที (3.5 กม.)</span>
            </div>
            <div className={`escape-ring ring-10m ${selectedRadius === '10m' ? 'focused' : ''}`}>
              <span className="ring-label">10 นาที (7.0 กม.)</span>
            </div>
            <div className={`escape-ring ring-15m ${selectedRadius === '15m' ? 'focused' : ''}`}>
              <span className="ring-label">15 นาที (12.0 กม.)</span>
            </div>
          </div>
        )}

        {/* Target Vehicle Marker */}
        <div className="map-marker target-marker" style={{ top: '48%', left: '46%' }}>
          <div className="marker-pulse-aura" />
          <div className="marker-icon-box danger">
            <Car size={16} />
          </div>
          <div className="marker-label-tooltip">
            <strong>🔴 TARGET: {targetPlate}</strong>
            <small>{targetLocation}</small>
          </div>
        </div>

        {/* Patrol Unit Markers */}
        {mockPatrolUnits.map((unit) => {
          const isDispatched = dispatchedUnits.includes(unit.id)
          return (
            <div
              key={unit.id}
              className={`map-marker patrol-marker ${isDispatched ? 'dispatched' : ''}`}
              style={{ top: `${unit.lat}%`, left: `${unit.lng}%` }}
              onClick={() => handleDispatchUnit(unit)}
            >
              <div className="marker-icon-box patrol">
                <Radio size={14} />
              </div>
              <div className="marker-label-tooltip">
                <strong>{unit.code} ({unit.name})</strong>
                <small>ห่าง {unit.distance} • ETA {unit.eta}</small>
                {isDispatched && <span className="dispatch-tag">กำลังมุ่งหน้า</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Patrol Dispatch Toolbar & Status */}
      <div className="patrol-dispatch-panel">
        <div className="panel-subhead">
          <Radio size={15} />
          <span>หน่วยปฏิบัติการสายตรวจในรัศมีใกล้ที่สุด (3 หน่วย)</span>
        </div>

        <div className="patrol-cards-grid">
          {mockPatrolUnits.map((unit) => {
            const isDispatched = dispatchedUnits.includes(unit.id)
            return (
              <div key={unit.id} className={`patrol-unit-card ${isDispatched ? 'dispatched' : ''}`}>
                <div className="unit-main-info">
                  <strong>{unit.name}</strong>
                  <small>{unit.code} • ห่าง {unit.distance}</small>
                </div>
                <div className="unit-eta-badge">ETA {unit.eta}</div>
                <button
                  type="button"
                  className={`btn-unit-dispatch ${isDispatched ? 'sent' : ''}`}
                  onClick={() => handleDispatchUnit(unit)}
                  disabled={isDispatched}
                >
                  {isDispatched ? (
                    <>
                      <CheckCircle2 size={13} /> กำลังมุ่งหน้า
                    </>
                  ) : (
                    <>
                      <Radio size={13} /> ส่งสัญญาณวิทยุ
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
