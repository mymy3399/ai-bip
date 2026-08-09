import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  AlertOctagon,
  AlertTriangle,
  Camera,
  Car,
  CheckCircle2,
  ClipboardList,
  Compass,
  FilePlus2,
  Eye,
  MapPin,
  PhoneCall,
  RefreshCw,
  Search,
  ScanLine,
  ShieldAlert,
  Zap,
} from 'lucide-react'
import anprCctvVehicle from '../../assets/anpr-cctv-vehicle.png'
import { TacticalGeofenceMap } from './TacticalGeofenceMap'
import { ImageFrame } from '../../components/ImageFrame'

interface ANPRDetection {
  id: string
  plateNumber: string
  province: string
  vehicleModel: string
  color: string
  location: string
  timestamp: string
  status: 'critical' | 'warning' | 'normal'
  warrantCategory: string
  ownerName: string
  confidence: number
}

interface WatchlistRecord {
  id: string
  plateNumber: string
  province: string
  category: 'หมายจับ' | 'รถหาย' | 'เฝ้าระวังอื่น ๆ'
  note: string
  createdAt: string
}

const mockDetections: ANPRDetection[] = [
  {
    id: 'ANPR-2026-001',
    plateNumber: '1กข 9988',
    province: 'กรุงเทพมหานคร',
    vehicleModel: 'Toyota Camry (สีดำ)',
    color: 'ดำ',
    location: 'กล้อง CAM-04 (ถนนวิภาวดีรังสิต ขาออก)',
    timestamp: '11:28:45',
    status: 'critical',
    warrantCategory: 'หมายจับข้อหาร่วมกันฉ้อโกงประชาชน & ยาเสพติด',
    ownerName: 'นายสรพงษ์ สมมติ',
    confidence: 98.4,
  },
  {
    id: 'ANPR-2026-002',
    plateNumber: '3ขค 4567',
    province: 'นนทบุรี',
    vehicleModel: 'Honda Civic (สีขาว)',
    color: 'ขาว',
    location: 'กล้อง CAM-09 (แยกอโศก-สุขุมวิท)',
    timestamp: '11:24:12',
    status: 'warning',
    warrantCategory: 'ขาดต่อภาษีเกิน 3 ปี / ต้องสงสัยสวมทะเบียน',
    ownerName: 'นางสาววิภาดา พรหมดี',
    confidence: 94.1,
  },
  {
    id: 'ANPR-2026-003',
    plateNumber: '8กง 1234',
    province: 'ปทุมธานี',
    vehicleModel: 'Isuzu D-Max (สีเทา)',
    color: 'เทา',
    location: 'กล้อง CAM-12 (ด่านดอนเมือง โทลล์เวย์)',
    timestamp: '11:18:05',
    status: 'critical',
    warrantCategory: 'ยานพาหนะหลบหนีการจับกุม (บก.น.2)',
    ownerName: 'นายณรงค์ฤทธิ์ ชัยชนะ',
    confidence: 99.1,
  },
  {
    id: 'ANPR-2026-004',
    plateNumber: '5งจ 7890',
    province: 'ชลบุรี',
    vehicleModel: 'BMW 320d (สีดำ)',
    color: 'ดำ',
    location: 'กล้อง CAM-02 (มอเตอร์เวย์ สาย 7 ขาเข้า)',
    timestamp: '11:05:30',
    status: 'normal',
    warrantCategory: 'ไม่พบประวัติหมายจับ',
    ownerName: 'นายกิตติศักดิ์ บุญมี',
    confidence: 96.8,
  },
]

const initialWatchlist: WatchlistRecord[] = [
  { id: 'WL-001', plateNumber: '1กข 9988', province: 'กรุงเทพมหานคร', category: 'หมายจับ', note: 'ต้องติดตามและแจ้งสกัดจับ', createdAt: '08 ส.ค. 2569 11:20' },
  { id: 'WL-002', plateNumber: '8กง 1234', province: 'ปทุมธานี', category: 'รถหาย', note: 'แจ้งหายจาก สภ.ดอนเมือง', createdAt: '08 ส.ค. 2569 10:45' },
]

export function ANPRSurveillancePage() {
  const [selectedDetection, setSelectedDetection] = useState<ANPRDetection | null>(mockDetections[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'warning'>('all')
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [activeViewMode, setActiveViewMode] = useState<'cctv' | 'geofence_map'>('cctv')
  const [activeAnprTool, setActiveAnprTool] = useState<'monitor' | 'watchlist' | 'transport'>('monitor')
  const [watchlist, setWatchlist] = useState<WatchlistRecord[]>(initialWatchlist)
  const [watchlistPlate, setWatchlistPlate] = useState('')
  const [watchlistProvince, setWatchlistProvince] = useState('กรุงเทพมหานคร')
  const [watchlistCategory, setWatchlistCategory] = useState<WatchlistRecord['category']>('หมายจับ')
  const [watchlistNote, setWatchlistNote] = useState('')
  const [watchlistMessage, setWatchlistMessage] = useState<string | null>(null)
  const [transportPlate, setTransportPlate] = useState('')
  const [transportImage, setTransportImage] = useState<string | null>(null)
  const [transportResult, setTransportResult] = useState<ANPRDetection | null>(null)
  const [isTransportChecking, setIsTransportChecking] = useState(false)

  const filteredDetections = mockDetections.filter((item) => {
    const matchesSearch =
      item.plateNumber.includes(searchQuery) ||
      item.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.includes(searchQuery) ||
      item.ownerName.includes(searchQuery)

    if (filterStatus === 'critical') return matchesSearch && item.status === 'critical'
    if (filterStatus === 'warning') return matchesSearch && item.status === 'warning'
    return matchesSearch
  })

  useEffect(() => {
    setSelectedDetection((current) => {
      if (current && filteredDetections.some((item) => item.id === current.id)) return current
      return filteredDetections[0] ?? null
    })
  }, [filterStatus, searchQuery])

  function handleTriggerScan() {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
    }, 1200)
  }

  function handleDispatchIntercept(detection: ANPRDetection) {
    setDispatchAlert(`วิทยุแจ้งสกัดจับรถยนต์ทะเบียน ${detection.plateNumber} (${detection.province}) ไปยังศูนย์วิทยุผ่านฟ้าเรียบร้อยแล้ว`)
    setTimeout(() => {
      setDispatchAlert(null)
    }, 6000)
  }

  function handleAddWatchlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!watchlistPlate.trim()) return

    const record: WatchlistRecord = {
      id: `WL-${String(watchlist.length + 1).padStart(3, '0')}`,
      plateNumber: watchlistPlate.trim(),
      province: watchlistProvince,
      category: watchlistCategory,
      note: watchlistNote.trim() || 'บันทึกจากเจ้าหน้าที่',
      createdAt: '08 ส.ค. 2569 12:00',
    }
    setWatchlist((current) => [record, ...current])
    setWatchlistPlate('')
    setWatchlistNote('')
    setWatchlistMessage(`บันทึกทะเบียน ${record.plateNumber} เข้ารายการ${record.category}แล้ว`)
    window.setTimeout(() => setWatchlistMessage(null), 4500)
  }

  function handleTransportImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setTransportImage(URL.createObjectURL(file))
    setTransportResult(null)
  }

  function handleTransportCheck() {
    const normalizedPlate = transportPlate.trim()
    if (!normalizedPlate && !transportImage) return
    setIsTransportChecking(true)
    window.setTimeout(() => {
      const matched = mockDetections.find((item) => item.plateNumber === normalizedPlate) ?? mockDetections[0]
      setTransportResult(matched)
      setIsTransportChecking(false)
    }, 1000)
  }

  return (
    <div className="anpr-page-container">
      {/* Top Header */}
      <div className="anpr-header-bar">
        <div>
          <span className="anpr-kicker">AUTOMATIC NUMBER PLATE RECOGNITION (ANPR)</span>
          <h2>ศูนย์เฝ้าระวังและตรวจจับทะเบียนรถยนต์ต้องสงสัย Real-time</h2>
        </div>
        <div className="header-status-badge">
          <span className="pulse-dot" /> LIVE CCTV STREAM ACTIVE (24 CAMERAS)
        </div>
      </div>

      {/* Primary ANPR workspace tabs */}
      <div className="anpr-tool-menu" role="tablist" aria-label="เมนูศูนย์ ANPR">
        <button type="button" role="tab" className={`anpr-tab-btn anpr-utility-tab-btn ${activeAnprTool === 'monitor' ? 'active' : ''}`} onClick={() => setActiveAnprTool('monitor')}>
          <Eye size={16} /> <span>เฝ้าระวัง Real-time</span>
        </button>
        <button type="button" role="tab" className={`anpr-tab-btn anpr-utility-tab-btn ${activeAnprTool === 'watchlist' ? 'active' : ''}`} onClick={() => setActiveAnprTool('watchlist')}>
          <ClipboardList size={16} /> <span>ทะเบียนเฝ้าระวัง</span>
        </button>
        <button type="button" role="tab" className={`anpr-tab-btn anpr-utility-tab-btn ${activeAnprTool === 'transport' ? 'active' : ''}`} onClick={() => setActiveAnprTool('transport')}>
          <ScanLine size={16} /> <span>ตรวจข้อมูลกรมขนส่ง</span>
        </button>
      </div>

      {activeAnprTool === 'watchlist' && (
        <section className="surface-panel anpr-tool-panel">
          <div className="anpr-tool-panel-heading">
            <div>
              <span className="anpr-kicker">WATCHLIST MANAGEMENT</span>
              <h3>บันทึกเลขทะเบียนเฝ้าระวัง</h3>
              <p>เพิ่มทะเบียนหมายจับ รถหาย หรือเหตุเฝ้าระวังอื่น เพื่อให้ระบบแจ้งเตือนเมื่อพบจากกล้อง ANPR</p>
            </div>
            <FilePlus2 size={26} className="anpr-tool-icon" />
          </div>
          <form className="watchlist-form" onSubmit={handleAddWatchlist}>
            <label>เลขทะเบียน<input value={watchlistPlate} onChange={(event) => setWatchlistPlate(event.target.value)} placeholder="เช่น 1กข 9988" required /></label>
            <label>จังหวัด<select value={watchlistProvince} onChange={(event) => setWatchlistProvince(event.target.value)}><option>กรุงเทพมหานคร</option><option>นนทบุรี</option><option>ปทุมธานี</option><option>ชลบุรี</option></select></label>
            <label>ประเภท<select value={watchlistCategory} onChange={(event) => setWatchlistCategory(event.target.value as WatchlistRecord['category'])}><option>หมายจับ</option><option>รถหาย</option><option>เฝ้าระวังอื่น ๆ</option></select></label>
            <label className="watchlist-note-field">รายละเอียด<input value={watchlistNote} onChange={(event) => setWatchlistNote(event.target.value)} placeholder="หมายเหตุหรือหน่วยงานเจ้าของเรื่อง" /></label>
            <button type="submit" className="btn-primary anpr-save-btn"><FilePlus2 size={16} /> บันทึกทะเบียน</button>
          </form>
          {watchlistMessage && <div className="anpr-inline-success"><CheckCircle2 size={16} /> {watchlistMessage}</div>}
          <div className="watchlist-list">
            <div className="watchlist-list-header"><strong>รายการที่บันทึกไว้</strong><span>{watchlist.length} รายการ</span></div>
            {watchlist.map((record) => (
              <div className="watchlist-row" key={record.id}>
                <div><strong>{record.plateNumber}</strong><small>{record.province} • {record.note}</small></div>
                <span className={`watchlist-category ${record.category === 'หมายจับ' ? 'danger' : record.category === 'รถหาย' ? 'warning' : ''}`}>{record.category}</span>
                <small className="watchlist-date">{record.createdAt}</small>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeAnprTool === 'transport' && (
        <section className="surface-panel anpr-tool-panel">
          <div className="anpr-tool-panel-heading">
            <div>
              <span className="anpr-kicker">TRANSPORT REGISTRY CHECK</span>
              <h3>ตรวจสอบข้อมูลทะเบียนกับกรมการขนส่ง</h3>
              <p>ถ่ายภาพหรืออัปโหลดภาพป้ายทะเบียน หรือกรอกเลขทะเบียนเพื่อตรวจสอบข้อมูลรถและผู้ครอบครอง</p>
            </div>
            <ScanLine size={26} className="anpr-tool-icon" />
          </div>
          <div className="transport-check-grid">
            <div className="transport-input-panel">
              <label>กรอกเลขทะเบียน<input value={transportPlate} onChange={(event) => { setTransportPlate(event.target.value); setTransportResult(null) }} placeholder="เช่น 1กข 9988" /></label>
              <div className="transport-or"><span>หรือ</span></div>
              <label className="transport-upload-box">
                <Camera size={22} />
                <strong>{transportImage ? 'เปลี่ยนภาพป้ายทะเบียน' : 'ถ่ายภาพ / อัปโหลดป้ายทะเบียน'}</strong>
                <small>ระบบจะสกัดเลขทะเบียนจากภาพเพื่อค้นหา</small>
                <input type="file" accept="image/*" capture="environment" onChange={handleTransportImage} />
              </label>
              {transportImage && <ImageFrame src={transportImage} alt="ภาพป้ายทะเบียนที่เลือก" className="transport-image-preview" />}
              <button type="button" className="btn-primary transport-check-btn" disabled={isTransportChecking || (!transportPlate.trim() && !transportImage)} onClick={handleTransportCheck}>
                <Search size={16} /> {isTransportChecking ? 'กำลังตรวจสอบ...' : 'ตรวจสอบข้อมูลทะเบียน'}
              </button>
            </div>
            <div className="transport-result-panel">
              {!transportResult ? (
                <div className="transport-empty-state"><ScanLine size={32} /><strong>ยังไม่มีผลตรวจสอบ</strong><span>กรอกเลขทะเบียนหรือเพิ่มภาพป้ายทะเบียนเพื่อเริ่มค้นหา</span></div>
              ) : (
                <div className="transport-result-card">
                  <div className="transport-result-header"><CheckCircle2 size={18} /><strong>พบข้อมูลทะเบียนในฐานข้อมูลกรมการขนส่ง</strong></div>
                  <div className="transport-plate-result"><Car size={20} /><strong>{transportResult.plateNumber}</strong><span>{transportResult.province}</span></div>
                  <dl>
                    <div><dt>ผู้ครอบครอง</dt><dd>{transportResult.ownerName}</dd></div>
                    <div><dt>รุ่น / สีรถ</dt><dd>{transportResult.vehicleModel}</dd></div>
                    <div><dt>สถานะจากระบบเฝ้าระวัง</dt><dd>{transportResult.warrantCategory}</dd></div>
                    <div><dt>เวลาตรวจสอบ</dt><dd>08 ส.ค. 2569 12:00 น.</dd></div>
                  </dl>
                  <small className="transport-disclaimer">ผลลัพธ์นี้เป็นข้อมูลจำลองสำหรับการพัฒนา การเชื่อมต่อกรมการขนส่งจริงต้องผ่าน API ที่ได้รับอนุญาต</small>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {activeAnprTool === 'monitor' && (
        <>
          {/* Secondary tabs for the Real-time monitoring workspace */}
          <div className="anpr-view-mode-tabs anpr-subtabs" role="tablist" aria-label="โหมดเฝ้าระวัง Real-time">
            <button
              type="button"
              role="tab"
              id="anpr-cctv-tab"
              aria-selected={activeViewMode === 'cctv'}
              aria-controls="anpr-cctv-panel"
              className={`anpr-tab-btn ${activeViewMode === 'cctv' ? 'active' : ''}`}
              onClick={() => setActiveViewMode('cctv')}
            >
              <Camera size={16} /> <span>ภาพสดกล้องวงจรปิด ANPR Stream</span>
            </button>
            <button
              type="button"
              role="tab"
              id="anpr-geofence-tab"
              aria-selected={activeViewMode === 'geofence_map'}
              aria-controls="anpr-geofence-panel"
              className={`anpr-tab-btn ${activeViewMode === 'geofence_map' ? 'active' : ''}`}
              onClick={() => setActiveViewMode('geofence_map')}
            >
              <Compass size={16} /> <span>แผนที่ปิดล้อมเรียลไทม์ & สั่งการสายตรวจ (Geofence Map)</span>
            </button>
          </div>

      {/* Top KPI Metrics Cards */}
      <div className="anpr-kpi-grid">
        <div className="kpi-card">
          <Camera className="kpi-icon blue" size={22} />
          <div>
            <small>กล้อง ANPR ที่เปิดใช้งาน</small>
            <strong>24 จุดตรวจ</strong>
          </div>
        </div>

        <div className="kpi-card">
          <Zap className="kpi-icon cyan" size={22} />
          <div>
            <small>รถยนต์ที่สแกนวันนี้</small>
            <strong>14,280 คัน</strong>
          </div>
        </div>

        <div className="kpi-card">
          <AlertOctagon className="kpi-icon danger" size={22} />
          <div>
            <small>ตรวจพบยานพาหนะต้องสงสัย</small>
            <strong className="danger-text">18 คัน</strong>
          </div>
        </div>

        <div className="kpi-card">
          <ShieldAlert className="kpi-icon amber" size={22} />
          <div>
            <small>การแจ้งสกัดจับสำเร็จ</small>
            <strong>12 ครั้ง</strong>
          </div>
        </div>
      </div>

      {dispatchAlert && (
        <div className="dispatch-success-banner">
          <CheckCircle2 size={20} />
          <span>{dispatchAlert}</span>
        </div>
      )}

      {/* Main Workspace Grid */}
      <div className="anpr-workspace-grid">
        {/* Left Card: CCTV Stream OR Geofence Map */}
        {selectedDetection === null ? (
          <section id={activeViewMode === 'geofence_map' ? 'anpr-geofence-panel' : 'anpr-cctv-panel'} role="tabpanel" aria-labelledby={activeViewMode === 'geofence_map' ? 'anpr-geofence-tab' : 'anpr-cctv-tab'} className="surface-panel geofence-map-card">
            <div className="empty-state">ไม่พบยานพาหนะตามเงื่อนไขการค้นหา</div>
          </section>
        ) : activeViewMode === 'geofence_map' ? (
          <section id="anpr-geofence-panel" role="tabpanel" aria-labelledby="anpr-geofence-tab" className="surface-panel geofence-map-card">
            <TacticalGeofenceMap
              targetPlate={selectedDetection.plateNumber}
              targetLocation={selectedDetection.location}
            />
          </section>
        ) : (
          <section id="anpr-cctv-panel" role="tabpanel" aria-labelledby="anpr-cctv-tab" className="surface-panel video-feed-card">
            <div className="feed-header">
              <div>
                <h3><Camera size={18} /> {selectedDetection.location}</h3>
                <small>พิกัด GPS: 13.8051° N, 100.5562° E • ความเร็ว 84 km/h</small>
              </div>
              <button type="button" className="btn-refresh-feed" onClick={handleTriggerScan} disabled={isScanning}>
                <RefreshCw size={14} className={isScanning ? 'spin-icon' : ''} /> รีเฟรชสัญญาณกล้อง
              </button>
            </div>

          <div className="video-viewport">
            <div className="camera-scan-overlay">
              <span className="cam-label">CAM 04 • LIVE 1080P HD</span>
              <span className="timestamp-label">{selectedDetection.timestamp}</span>

              {/* Bounding Box for License Plate */}
              <div className="license-plate-bounding-box">
                <span className="corner top-l" />
                <span className="corner top-r" />
                <span className="corner bot-l" />
                <span className="corner bot-r" />
                <div className="plate-ocr-tag">
                  ANPR OCR: <strong>{selectedDetection.plateNumber}</strong> ({selectedDetection.confidence}%)
                </div>
              </div>

              {/* Scan Laser */}
              <div className="video-scan-laser" />
            </div>

            <ImageFrame src={anprCctvVehicle} alt="ภาพรถยนต์จากกล้องวงจรปิด ANPR" className="cctv-feed-img" />
          </div>

          {/* Vehicle Metadata Box */}
          <div className="vehicle-meta-box">
            <div className="meta-main-info">
              <div className="plate-badge-large">
                <Car size={20} />
                <span>{selectedDetection.plateNumber}</span>
                <small>{selectedDetection.province}</small>
              </div>

              <div className="meta-details">
                <h4>{selectedDetection.vehicleModel}</h4>
                <p>ผู้ครอบครองตามทะเบียน: <strong>{selectedDetection.ownerName}</strong></p>
                <p className="warrant-detail-text">
                  <AlertTriangle size={14} /> {selectedDetection.warrantCategory}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn-dispatch-intercept"
              onClick={() => handleDispatchIntercept(selectedDetection)}
            >
              <PhoneCall size={16} /> 🚨 สั่งการสกัดจับยานพาหนะทันที (Dispatch Intercept)
            </button>
          </div>
        </section>
      )}

        {/* Right Log Feed Table Card */}
        <section className="surface-panel log-feed-card">
          <div className="log-header-row">
            <h3><Eye size={18} /> รายการตรวจพบยานพาหนะ Real-time Feed</h3>
            <div className="log-filters">
              <button
                type="button"
                className={`filter-chip ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                ทั้งหมด
              </button>
              <button
                type="button"
                className={`filter-chip danger ${filterStatus === 'critical' ? 'active' : ''}`}
                onClick={() => setFilterStatus('critical')}
              >
                หมายจับ (Critical)
              </button>
              <button
                type="button"
                className={`filter-chip warning ${filterStatus === 'warning' ? 'active' : ''}`}
                onClick={() => setFilterStatus('warning')}
              >
                เฝ้าระวัง (Warning)
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="anpr-search-bar">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="ค้นหาตามเลขทะเบียน, ยี่ห้อรถ, สถานที่ หรือชื่อผู้ครอบครอง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Detections List */}
          <div className="detections-list">
            {filteredDetections.map((det) => (
              <div
                key={det.id}
                className={`detection-item-card ${selectedDetection?.id === det.id ? 'selected' : ''}`}
                onClick={() => setSelectedDetection(det)}
              >
                <div className="item-plate-col">
                  <span className="plate-pill">{det.plateNumber}</span>
                  <small>{det.province}</small>
                </div>

                <div className="item-info-col">
                  <div className="item-title-line">
                    <strong>{det.vehicleModel}</strong>
                    <span className={`status-pill ${det.status}`}>
                      {det.status === 'critical' ? '🔴 WATCHLIST HIT' : det.status === 'warning' ? '🟠 เฝ้าระวัง' : '🟢 ปกติ'}
                    </span>
                  </div>
                  <p><MapPin size={12} /> {det.location}</p>
                  <small className="time-text">สแกนเมื่อ: {det.timestamp} • ความแม่นยำ {det.confidence}%</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
        </>
      )}
    </div>
  )
}
