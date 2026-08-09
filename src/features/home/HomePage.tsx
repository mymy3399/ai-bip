import { useState } from 'react'
import {
  Activity,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  Globe,
  MapPin,
  Network,
  Scale,
  ScanFace,
  Search,
  ShieldCheck,
  UserRound,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const tacticalMetrics = [
  { label: 'Active Field Operations', value: '24', change: '+3 today', status: 'normal', icon: Activity },
  { label: 'Field Checks Executed', value: '142', change: '98.4% match accuracy', status: 'normal', icon: ScanFace },
  { label: 'Legal AI Queries', value: '89', change: 'Avg response 1.2s', status: 'normal', icon: Scale },
  { label: 'System Health', value: '99.9%', change: 'All nodes active', status: 'normal', icon: Zap },
]

const modules = [
  {
    href: '/field-check',
    icon: ScanFace,
    shortcut: '[1]',
    label: 'Biometric Field Check',
    description: 'คัดกรองใบหน้า กล้องวงจรปิด ลายนิ้วมือ และค้นหาทะเบียนราษฎร์/หมายจับจำลอง',
    action: 'เปิดระบบตรวจภาคสนาม',
    primary: true,
    badge: 'Real-time Camera & ANPR',
    badgeType: 'blue',
  },
  {
    href: '/legal-ai',
    icon: Scale,
    shortcut: '[2]',
    label: 'Legal AI Assistant',
    description: 'วิเคราะห์ข้อเท็จจริง เสนอ Candidate Charges พร้อมประมวลกฎหมายอาญา/วิธีพิจารณาความอาญา',
    action: 'เปิดระบบวิเคราะห์กฎหมาย',
    primary: false,
    badge: 'Thai Penal Code DB',
    badgeType: 'amber',
  },
  {
    href: '/assistants',
    icon: Bot,
    shortcut: '[3]',
    label: 'Police AI Assistants',
    description: 'ผู้ช่วยสืบสวน (Investigator), งานบุคคล (HR) และงานพัสดุจัดซื้อจัดจ้าง (Procurement)',
    action: 'เปิดผู้ช่วย AI',
    primary: false,
    badge: '3 Active Assistants',
    badgeType: 'emerald',
  },
  {
    href: '/flow',
    icon: Network,
    shortcut: '[4]',
    label: 'Operational Flow Pipeline',
    description: 'ภาพรวมกระบวนการสืบสวนและส่งฟ้อง จากจุดเกิดเหตุถึงชั้นอัยการ/ศาล',
    action: 'เปิดผังกระบวนการ',
    primary: false,
    badge: 'Live Node Runner',
    badgeType: 'blue',
  },
]

// Hierarchical Usage Statistics Data
const regionStats = [
  { name: 'บช.น. (กรุงเทพฯ)', checks: 1420, matches: 84, activeUsers: 340, percent: 88 },
  { name: 'ภ.1 (ภาคกลาง)', checks: 980, matches: 52, activeUsers: 210, percent: 65 },
  { name: 'ภ.2 (ภาคตะวันออก)', checks: 740, matches: 38, activeUsers: 180, percent: 50 },
  { name: 'ภ.5 (ภาคเหนือ)', checks: 620, matches: 29, activeUsers: 140, percent: 42 },
  { name: 'ภ.7 (ภาคตะวันตก)', checks: 510, matches: 21, activeUsers: 110, percent: 35 },
]

const provinceStats = [
  { name: 'กรุงเทพมหานคร', region: 'บช.น.', checks: 1420, matches: 84, activeUsers: 340 },
  { name: 'นนทบุรี', region: 'ภ.1', checks: 420, matches: 24, activeUsers: 95 },
  { name: 'สมุทรปราการ', region: 'ภ.1', checks: 380, matches: 18, activeUsers: 80 },
  { name: 'ชลบุรี', region: 'ภ.2', checks: 490, matches: 26, activeUsers: 115 },
  { name: 'เชียงใหม่', region: 'ภ.5', checks: 390, matches: 19, activeUsers: 90 },
]

const stationStats = [
  { name: 'สน.ห้วยขวาง', province: 'กรุงเทพมหานคร', checks: 310, matches: 22, officerCount: 45 },
  { name: 'สน.ทองหล่อ', province: 'กรุงเทพมหานคร', checks: 280, matches: 19, officerCount: 40 },
  { name: 'สน.ลุมพินี', province: 'กรุงเทพมหานคร', checks: 250, matches: 15, officerCount: 38 },
  { name: 'สภ.เมืองนนทบุรี', province: 'นนทบุรี', checks: 240, matches: 14, officerCount: 35 },
  { name: 'สภ.เมืองเชียงใหม่', province: 'เชียงใหม่', checks: 210, matches: 11, officerCount: 30 },
]

const officerStats = [
  { name: 'ร.ต.อ. วรพจน์ แสงทอง', badge: 'POL-6701', station: 'สน.ห้วยขวาง', checks: 48, status: 'Active Field' },
  { name: 'พ.ต.ท. สมศักดิ์ มีสุข', badge: 'POL-5842', station: 'สน.ทองหล่อ', checks: 42, status: 'Active Legal AI' },
  { name: 'ด.ต. วิชัย สายสืบ', badge: 'POL-7109', station: 'สน.ลุมพินี', checks: 39, status: 'Active Field' },
  { name: 'ร.ต.อ. สมชาย ใจดี', badge: 'POL-6820', station: 'สภ.เมืองนนทบุรี', checks: 35, status: 'Active Field' },
]

// System Audit Logs Dataset
const auditLogsData = [
  {
    id: 'LOG-9941',
    time: '20 พ.ค. 2567 10:42:15',
    officer: 'ร.ต.อ. วรพจน์ แสงทอง',
    badge: 'POL-6701',
    station: 'สน.ห้วยขวาง',
    province: 'กรุงเทพมหานคร',
    region: 'บช.น.',
    action: 'Biometric Field Check',
    details: 'สแกนใบหน้าพบ Candidate 1 (Match 91.8%) ตรงกับหมายจับ ศาลอาญา',
    status: 'ACTIVE WARRANT ALERT',
    statusType: 'danger',
    ip: '10.24.105.42 (GPS: 13.7267, 100.5123)',
  },
  {
    id: 'LOG-9940',
    time: '20 พ.ค. 2567 10:38:00',
    officer: 'พ.ต.ท. สมศักดิ์ มีสุข',
    badge: 'POL-5842',
    station: 'สน.ทองหล่อ',
    province: 'กรุงเทพมหานคร',
    region: 'บช.น.',
    action: 'Legal AI Analysis',
    details: 'ส่งคำร้องวิเคราะห์ข้อเท็จจริงคดีลักทรัพย์ยามวิกาล เสนอมาตรา 335',
    status: 'ANALYSIS COMPLETED',
    statusType: 'success',
    ip: '10.24.102.18 (สน.ทองหล่อ Workstation 3)',
  },
  {
    id: 'LOG-9939',
    time: '20 พ.ค. 2567 10:20:45',
    officer: 'ด.ต. วิชัย สายสืบ',
    badge: 'POL-7109',
    station: 'สน.ลุมพินี',
    province: 'กรุงเทพมหานคร',
    region: 'บช.น.',
    action: 'AFIS Fingerprint Search',
    details: 'สแกนลายนิ้วมือ 1 นิ้วภาคสนาม ไม่พบประวัติอาชญากรรม',
    status: 'CLEAN RESULT',
    statusType: 'normal',
    ip: '10.24.108.77 (Mobile FAP20 Reader)',
  },
  {
    id: 'LOG-9938',
    time: '20 พ.ค. 2567 09:55:12',
    officer: 'ร.ต.อ. สมชาย ใจดี',
    badge: 'POL-6820',
    station: 'สภ.เมืองนนทบุรี',
    province: 'นนทบุรี',
    region: 'ภ.1',
    action: 'ANPR License Scan',
    details: 'สแกนป้ายทะเบียน 1กข 8899 กทม. ผ่านจุดตรวจสะพานพระราม 5',
    status: 'ANPR MATCHED',
    statusType: 'amber',
    ip: '10.11.204.12 (CCTV Checkpoint 4)',
  },
  {
    id: 'LOG-9937',
    time: '20 พ.ค. 2567 09:30:00',
    officer: 'พ.ต.ต. ณัฐวุฒิ สุขสวัสดิ์',
    badge: 'POL-5521',
    station: 'สภ.เมืองเชียงใหม่',
    province: 'เชียงใหม่',
    region: 'ภ.5',
    action: 'Link Analysis Graph',
    details: 'เรียกดูผังเชื่อมโยงผู้ร่วมกระทำผิด คดีเครือข่ายลักทรัพย์',
    status: 'DOSSIER ACCESSED',
    statusType: 'normal',
    ip: '10.55.101.9 (สภ.เมืองเชียงใหม่ Terminal)',
  },
]

export function HomePage() {
  const [statLevel, setStatLevel] = useState<'region' | 'province' | 'station' | 'officer'>('region')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('ALL')
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL')

  // Filter audit logs
  const filteredLogs = auditLogsData.filter((log) => {
    const matchesSearch =
      log.officer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRegion = selectedRegionFilter === 'ALL' || log.region === selectedRegionFilter
    const matchesAction = selectedActionFilter === 'ALL' || log.action === selectedActionFilter

    return matchesSearch && matchesRegion && matchesAction
  })

  function handleExportCSV() {
    const headers = ['Log ID', 'Timestamp', 'Officer', 'Badge ID', 'Station', 'Region', 'Action', 'Details', 'IP']
    const rows = filteredLogs.map((l) => [
      l.id,
      l.time,
      `"${l.officer}"`,
      l.badge,
      `"${l.station}"`,
      l.region,
      `"${l.action}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ip}"`,
    ])

    const csvContent = `\uFEFF${[headers.join(','), ...rows.map((r) => r.join(','))].join('\n')}`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="home-page page-enter">
      {/* Intro Header */}
      <section className="home-intro">
        <div>
          <p className="eyebrow">POLICE AI PLATFORM • ENTERPRISE TACTICAL MODE</p>
          <h2>ศูนย์ปฏิบัติการเทคโนโลยีปัญญาประดิษฐ์ (AI-BIP)</h2>
          <p className="intro-copy">
            แพลตฟอร์มสนับสนุนการปฏิบัติงานสืบสวนและการตัดสินใจทางกฎหมาย เชื่อมโยงข้อมูลภาคสนาม ข้อมูลสมมติ การวิเคราะห์ข้อกฎหมาย และระบบผู้ช่วยอัจฉริยะ
          </p>
        </div>
        <div className="home-secure-note">
          <ShieldCheck aria-hidden="true" />
          <span>
            <strong>Secure Operational Node</strong>
            <small>ระบบจำลองการทำงานความปลอดภัยสูง</small>
          </span>
        </div>
      </section>

      {/* Operational Metrics Grid */}
      <section className="metrics-grid" aria-label="สถานะการทำงานเชิงตัวเลข">
        {tacticalMetrics.map(({ label, value, change, icon: Icon }) => (
          <div key={label} className="metric-card">
            <div className="metric-header">
              <span className="metric-label">{label}</span>
              <Icon className="metric-icon" size={18} />
            </div>
            <div className="metric-value">{value}</div>
            <div className="metric-subtext">
              <CheckCircle2 size={13} className="metric-check" /> {change}
            </div>
          </div>
        ))}
      </section>

      {/* Primary Module Launchers */}
      <section className="module-launcher" aria-labelledby="module-heading">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">MODULE LAUNCHER</p>
            <h3 id="module-heading">เลือกโมดูลปฏิบัติการที่ต้องการ</h3>
          </div>
          <span className="module-count">4 โมดูลพร้อมใช้งาน</span>
        </div>
        <div className="module-list">
          {modules.map(({ href, icon: Icon, shortcut, label, description, action, primary, badge, badgeType }) => (
            <Link className={`module-row${primary ? ' primary' : ''}`} to={href} key={href}>
              <span className="module-icon">
                <Icon aria-hidden="true" />
              </span>
              <div className="module-copy">
                <div className="module-title-row">
                  <strong>{label}</strong>
                  <span className="shortcut-badge">{shortcut}</span>
                  <span className={`tactical-badge badge--${badgeType}`}>{badge}</span>
                </div>
                <small>{description}</small>
              </div>
              <span className="module-action">
                {action}
                <ArrowRight aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW SECTION: System Usage Statistics Breakdown (ภาค / จังหวัด / สถานี / บุคคล) */}
      <section className="surface-panel usage-stats-panel">
        <div className="panel-title-bar">
          <div>
            <p className="section-kicker">SYSTEM USAGE ANALYTICS / สถิติการใช้งานระบบ</p>
            <h3>สถิติการใช้งานแยกตาม ภาค • จังหวัด • สถานีตำรวจ • บุคคล</h3>
          </div>

          {/* Level Switcher Tabs */}
          <div className="stat-level-tabs">
            <button
              type="button"
              className={`stat-level-btn ${statLevel === 'region' ? 'active' : ''}`}
              onClick={() => setStatLevel('region')}
            >
              <Globe size={14} /> แยกตามภาค (Region)
            </button>

            <button
              type="button"
              className={`stat-level-btn ${statLevel === 'province' ? 'active' : ''}`}
              onClick={() => setStatLevel('province')}
            >
              <MapPin size={14} /> แยกตามจังหวัด
            </button>

            <button
              type="button"
              className={`stat-level-btn ${statLevel === 'station' ? 'active' : ''}`}
              onClick={() => setStatLevel('station')}
            >
              <Building2 size={14} /> แยกตามสถานีตำรวจ
            </button>

            <button
              type="button"
              className={`stat-level-btn ${statLevel === 'officer' ? 'active' : ''}`}
              onClick={() => setStatLevel('officer')}
            >
              <UserRound size={14} /> สถิติรายบุคคล
            </button>
          </div>
        </div>

        {/* Level 1: Region Breakdown */}
        {statLevel === 'region' && (
          <div className="stats-cards-grid">
            {regionStats.map((item) => (
              <div className="stat-summary-card" key={item.name}>
                <div className="stat-card-header">
                  <strong>{item.name}</strong>
                  <span className="stat-badge">{item.activeUsers} เจ้าหน้าที่</span>
                </div>
                <div className="stat-numbers-row">
                  <div>
                    <small>จำนวนสแกนคัดกรอง</small>
                    <strong>{item.checks.toLocaleString()} รายการ</strong>
                  </div>
                  <div>
                    <small>พบข้อมูลสอดคล้อง</small>
                    <strong className="text-amber">{item.matches} รายการ</strong>
                  </div>
                </div>
                <div className="stat-progress-bar">
                  <div className="fill" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Level 2: Province Breakdown */}
        {statLevel === 'province' && (
          <div className="stats-table-wrapper">
            <table className="stats-data-table">
              <thead>
                <tr>
                  <th>จังหวัด</th>
                  <th>สังกัดกองบัญชาการ</th>
                  <th>การตรวจภาคสนาม</th>
                  <th>พบข้อมูลสอดคล้อง</th>
                  <th>ผู้ใช้งาน Active</th>
                </tr>
              </thead>
              <tbody>
                {provinceStats.map((item) => (
                  <tr key={item.name}>
                    <td>
                      <strong><MapPin size={13} className="text-blue" /> {item.name}</strong>
                    </td>
                    <td>{item.region}</td>
                    <td><strong>{item.checks}</strong> รายการ</td>
                    <td><span className="status-pill status-pill--amber">{item.matches} รายการ</span></td>
                    <td>{item.activeUsers} นาย</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Level 3: Station Breakdown */}
        {statLevel === 'station' && (
          <div className="stats-table-wrapper">
            <table className="stats-data-table">
              <thead>
                <tr>
                  <th>สถานีตำรวจ (สน. / สภ.)</th>
                  <th>จังหวัด</th>
                  <th>จำนวนการตรวจสอบ</th>
                  <th>การเตือนภัย (Alerts)</th>
                  <th>กำลังพลประจำสถานี</th>
                </tr>
              </thead>
              <tbody>
                {stationStats.map((item) => (
                  <tr key={item.name}>
                    <td>
                      <strong><Building2 size={13} className="text-blue" /> {item.name}</strong>
                    </td>
                    <td>{item.province}</td>
                    <td><strong>{item.checks}</strong> รายการ</td>
                    <td><span className="status-pill status-pill--danger">{item.matches} หมายจับ</span></td>
                    <td>{item.officerCount} นาย</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Level 4: Officer Individual Breakdown */}
        {statLevel === 'officer' && (
          <div className="stats-cards-grid">
            {officerStats.map((item) => (
              <div className="officer-stat-card" key={item.badge}>
                <div className="officer-avatar-box">
                  <UserRound size={22} />
                </div>
                <div className="officer-copy">
                  <strong>{item.name}</strong>
                  <small>รหัสยศ: {item.badge} • {item.station}</small>
                  <div className="officer-metrics">
                    <span>สืบค้นภาคสนาม: <strong>{item.checks} ครั้ง</strong></span>
                    <span className="officer-status-tag">{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* NEW SECTION: Audit Log Search & Activity Inspector (ระบบค้นหา Log ผู้ใช้งาน) */}
      <section className="surface-panel audit-log-panel">
        <div className="panel-title-bar">
          <div>
            <p className="section-kicker">AUDIT LOG INSPECTOR / ตรวจสอบประวัติการใช้งานระบบ</p>
            <h3>ระบบสืบค้น Log กิจกรรม และผู้ใช้งานเรียลไทม์</h3>
          </div>
          <button type="button" className="btn-export-csv" onClick={handleExportCSV}>
            <Download size={15} /> ส่งออกข้อมูล Audit Log (CSV)
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="log-filter-toolbar">
          <div className="search-input-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อเจ้าหน้าที่, รหัสยศ, สถานีตำรวจ, กิจกรรม, หรือ IP..."
            />
          </div>

          <div className="filter-selects-group">
            <div className="select-wrapper">
              <Filter size={14} />
              <select
                value={selectedRegionFilter}
                onChange={(e) => setSelectedRegionFilter(e.target.value)}
                aria-label="กรองตามภาค"
              >
                <option value="ALL">ภาคทั้งหมด (ทุก บช.)</option>
                <option value="บช.น.">บช.น. (กรุงเทพฯ)</option>
                <option value="ภ.1">ภ.1 (ภาคกลาง)</option>
                <option value="ภ.5">ภ.5 (ภาคเหนือ)</option>
              </select>
            </div>

            <div className="select-wrapper">
              <Activity size={14} />
              <select
                value={selectedActionFilter}
                onChange={(e) => setSelectedActionFilter(e.target.value)}
                aria-label="กรองตามกิจกรรม"
              >
                <option value="ALL">กิจกรรมทั้งหมด</option>
                <option value="Biometric Field Check">Biometric Field Check</option>
                <option value="Legal AI Analysis">Legal AI Analysis</option>
                <option value="AFIS Fingerprint Search">AFIS Fingerprint Search</option>
                <option value="ANPR License Scan">ANPR License Scan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filtered Log Table */}
        <div className="log-table-wrapper">
          <table className="audit-log-table">
            <thead>
              <tr>
                <th>รหัส & เวลาบันทึก</th>
                <th>เจ้าหน้าที่ผู้ใช้งาน (User Profile)</th>
                <th>สังกัด & สถานีตำรวจ</th>
                <th>ประเภทกิจกรรม</th>
                <th>รายละเอียด / ผลการทำงาน</th>
                <th>อุปกรณ์ & พิกัด</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className="log-id">{log.id}</span>
                      <small className="log-time"><Clock size={11} /> {log.time}</small>
                    </td>

                    <td>
                      <strong>{log.officer}</strong>
                      <small className="badge-code">Badge: {log.badge}</small>
                    </td>

                    <td>
                      <strong>{log.station}</strong>
                      <small className="region-code">{log.province} ({log.region})</small>
                    </td>

                    <td>
                      <span className="action-tag">{log.action}</span>
                    </td>

                    <td>
                      <p className="log-detail-copy">{log.details}</p>
                      <span className={`log-status-badge status--${log.statusType}`}>
                        {log.status}
                      </span>
                    </td>

                    <td>
                      <small className="device-ip">{log.ip}</small>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    ไม่พบประวัติ Log ที่ตรงกับคำค้นหา "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Disclosure Footer */}
      <p className="home-disclosure">
        <FileText size={14} style={{ display: 'inline', marginRight: 6 }} />
        ข้อมูลทั้งหมดเป็นข้อมูลจำลองเพื่อการพัฒนาและทดสอบระบบปฏิบัติการของเจ้าหน้าที่ตำรวจเท่านั้น (DEMO MODE)
      </p>
    </div>
  )
}
