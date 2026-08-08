import { useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  Database,
  Download,
  FileCheck2,
  FileText,
  Fingerprint,
  Globe,
  IdCard,
  Info,
  MapPin,
  Network,
  PhoneCall,
  Printer,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserRound,
  Users,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { candidates } from '../../simulation/candidates'
import { ScreeningNotice } from './ScreeningNotice'

const sampleAssociates = [
  { name: 'นาย วิชัย สมมติ', role: 'ผู้ต้องสงสัยร่วม', relation: 'ผู้ขับขี่พาหนะหลบหนี', risk: 'HIGH', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { name: 'นาย สมชาย สมมติ', role: 'เจ้าของสถานที่ซ่อนตัว', relation: 'ผู้ครอบครองที่พักจำลอง', risk: 'MEDIUM', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
]

const sampleVehicles = [
  { plate: '1กข 8899 กทม.', type: 'รถยนต์นั่งส่วนบุคคล (Sedan)', status: 'ANPR MATCHED 10:42', color: 'สีดำ' },
  { plate: '2ขค 1234 นนทบุรี', type: 'จักรยานยนต์ (Motorcycle)', status: 'REGISTERED ASSOCIATE', color: 'สีแดง' },
]

const timelineEvents = [
  { date: '8 ส.ค. 2569 - 10:42 น.', title: 'พบป้ายทะเบียนและใบหน้าผ่าน ANPR จุดตรวจ 4', status: 'CRITICAL ALERT', detail: 'กล้อง ANPR สแกนพบป้ายทะเบียน 1กข 8899 พร้อมใบหน้าตรงกัน 91%' },
  { date: '15 พ.ค. 2567 - 14:20 น.', title: 'ศาลอาญาอนุมัติหมายจับ คดีร่วมกันลักทรัพย์ยามวิกาล', status: 'WARRANT ISSUED', detail: 'หมายจับเลขที่ ผ.102/2567 ออกโดยศาลอาญา' },
  { date: '10 ม.ค. 2566 - 02:15 น.', title: 'รับแจ้งเหตุลักทรัพย์ในเคหสถาน เขตห้วยขวาง', status: 'INCIDENT LOGGED', detail: 'สน.ห้วยขวาง ลงบันทึกประจำวันคดีลักทรัพย์' },
]

export function FieldCandidateDetailPage() {
  const navigate = useNavigate()
  const { candidateId } = useParams()
  const candidate = candidates.find((item) => item.id === candidateId) ?? candidates[0]
  const [activeTab, setActiveTab] = useState<'overview' | 'network' | 'timeline'>('overview')
  const [actionDone, setActionDone] = useState('')
  const [showFormalModal, setShowFormalModal] = useState(false)

  function handleDispatchBackup() {
    setActionDone('🚨 แจ้งส่งกำลังบำรุง/สายตรวจสนับสนุนเรียบร้อยแล้ว (Dispatch Alert Sent)')
    setTimeout(() => setActionDone(''), 4000)
  }

  function handleExportPDF() {
    window.print()
  }

  return (
    <div className="dossier-page page-enter">
      {/* Top Bar Header Navigation */}
      <div className="dossier-top-bar">
        <button type="button" className="btn-back" onClick={() => navigate('/field-check/results')}>
          <ArrowLeft size={16} /> กลับรายการ Candidate List
        </button>

        <div className="dossier-action-group">
          <button type="button" className="btn-export" onClick={() => { window.print() }}>
            <Printer size={15} /> <span className="action-label-full">พิมพ์รายงานสืบสวน (Full Dossier PDF)</span><span className="action-label-mobile">รายงาน</span>
          </button>
          <button type="button" className="btn-export btn-export-secondary" onClick={() => { window.print() }}>
            <FileText size={15} /> <span className="action-label-full">พิมพ์ใบสรุปย่อสายตรวจ (1-Page Patrol Sheet)</span><span className="action-label-mobile">สรุปสายตรวจ</span>
          </button>
          <button type="button" className="btn-dispatch-danger" onClick={handleDispatchBackup}>
            <PhoneCall size={15} /> <span className="action-label-full">แจ้งสายตรวจสนับสนุน (Dispatch Backup)</span><span className="action-label-mobile">แจ้งสนับสนุน</span>
          </button>
        </div>
      </div>

      {actionDone && (
        <div className="dispatch-alert-banner">
          <ShieldAlert size={18} /> {actionDone}
        </div>
      )}

      {/* Main Dossier Hero Profile Card */}
      <section className="surface-panel dossier-hero-card">
        <div className="hero-portrait-col">
          <div className="portrait-frame">
            <img src={candidate.portraitUrl} alt={candidate.displayName} />
            <span className="frame-corner top-l" />
            <span className="frame-corner top-r" />
            <span className="frame-corner bot-l" />
            <span className="frame-corner bot-r" />
            <div className="portrait-score-badge">
              <CheckCircle2 size={13} /> AFIS Match {candidate.similarity}%
            </div>
          </div>
        </div>

        <div className="hero-info-col">
          <div className="hero-title-row">
            <div>
              <p className="kicker-tag">CANDIDATE DOSSIER / แฟ้มประวัติบุคคลคัดกรอง</p>
              <h2>{candidate.displayName}</h2>
            </div>
            <span className="verification-status-pill">
              <UserCheck size={14} /> รอเจ้าหน้าที่ยืนยันตัวตน (Pending Verification)
            </span>
          </div>

          <div className="hero-identity-grid">
            <div className="id-item">
              <small>เลขประจำตัวประชาชน</small>
              <strong>1372671005123</strong>
            </div>

            <div className="id-item">
              <small>อายุโดยประมาณ</small>
              <strong>{candidate.ageApprox} ปี</strong>
            </div>

            <div className="id-item">
              <small>เพศ / ส่วนสูง / กรุ๊ปเลือด</small>
              <strong>ชาย • 172 ซม. • O</strong>
            </div>

            <div className="id-item">
              <small>ภูมิลำเนาตามข้อมูลจำลอง</small>
              <strong>กรุงเทพมหานคร</strong>
            </div>
          </div>

          {candidate.warrantNotice && (
            <div className="dossier-warrant-banner">
              <ShieldAlert size={20} className="warrant-alert-icon" />
              <div>
                <strong>⚠️ ตรวจพบข้อมูลสอดคล้องกับหมายจับติดตัว (Active Warrant Alert)</strong>
                <p>
                  หมายเลขหมาย: <strong>{candidate.warrantNotice.number}</strong> • ผู้ออกหมาย:{' '}
                  <strong>{candidate.warrantNotice.issuer}</strong> • ฐานความผิด:{' '}
                  <strong>{candidate.warrantNotice.category}</strong> (ลงวันที่ {candidate.warrantNotice.receivedAt})
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Dossier Interactive Navigation Tabs */}
      <div className="dossier-nav-tabs">
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <UserCheck size={16} /> ข้อมูลประวัติและอัตลักษณ์ (Identity & Cross-check)
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'network' ? 'active' : ''}`}
          onClick={() => setActiveTab('network')}
        >
          <Network size={16} /> ผังเครือข่ายความสัมพันธ์ (Link Analysis Graph)
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <Clock size={16} /> ลำดับเหตุการณ์และประวัติคดี (Offense Timeline)
        </button>
      </div>

      {/* TAB 1: OVERVIEW & IDENTITY MATRIX */}
      {activeTab === 'overview' && (
        <div className="dossier-tab-pane">
          <div className="matrix-2col-grid">
            {/* Identity Fields Card */}
            <section className="surface-panel matrix-card">
              <div className="matrix-card-header">
                <h3><IdCard size={18} className="card-heading-icon" /> รายละเอียดอัตลักษณ์และประวัติส่วนบุคคล</h3>
                <span className="section-badge">CIVIL REGISTRATION DATA</span>
              </div>
              <div className="identity-fields-list">
                {candidate.identityFields.map((field) => (
                  <div className="field-row" key={field.label}>
                    <span className="field-key">{field.label}</span>
                    <strong className="field-val">{field.value}</strong>
                  </div>
                ))}
              </div>
            </section>

            {/* Cross-Check Provenance Card */}
            <section className="surface-panel matrix-card">
              <div className="matrix-card-header">
                <h3><Database size={18} className="card-heading-icon" /> ผลการ Cross-Check หลายฐานข้อมูล</h3>
                <span className="section-badge">5 POLICE DATABASES</span>
              </div>
              <div className="cross-check-stack">
                {candidate.crossChecks.map((check) => (
                  <div className="cross-item" key={check.label}>
                    <div className={`check-state-icon state-${check.state}`}>
                      {check.state === 'match' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    </div>
                    <div className="cross-copy">
                      <div className="cross-title-row">
                        <strong>{check.label}</strong>
                        <span className={`cross-badge badge-${check.state}`}>
                          {check.state === 'match' ? 'MATCH FOUND' : 'CLEAN / POSSIBLE'}
                        </span>
                      </div>
                      <p>{check.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* TAB 2: LINK ANALYSIS GRAPH */}
      {activeTab === 'network' && (
        <div className="dossier-tab-pane">
          <section className="surface-panel link-graph-panel">
            <div className="graph-panel-header">
              <div>
                <h3><Network size={20} className="card-heading-icon" /> ผังเชื่อมโยงผู้ร่วมกระทำผิดและยานพาหนะ (Link Analysis Graph)</h3>
                <p>วิเคราะห์ความสัมพันธ์จำลองจากประวัติคดีร่วม ยานพาหนะ และสถานที่สแกนพบ</p>
              </div>
              <span className="graph-status-badge">⚡ ACTIVE LINK NODES (3 CONNECTIONS)</span>
            </div>

            <div className="graph-nodes-grid">
              {/* Subject Central Node */}
              <div className="node-card target-subject-node">
                <span className="node-tag">TARGET SUBJECT</span>
                <img src={candidate.portraitUrl} alt={candidate.displayName} className="node-avatar" />
                <h4>{candidate.displayName}</h4>
                <p className="subject-id-code">ID: 1372671005123</p>
                <div className="subject-match-pill">AFIS MATCH {candidate.similarity}%</div>
              </div>

              {/* Linked Associates Node */}
              <div className="node-card">
                <div className="node-title">
                  <Users size={16} /> ผู้เกี่ยวข้องใกล้ชิด (Linked Associates)
                </div>
                <div className="node-items-list">
                  {sampleAssociates.map((ass, i) => (
                    <div key={i} className="node-item">
                      <img src={ass.img} alt={ass.name} className="mini-avatar" />
                      <div className="node-item-copy">
                        <strong>{ass.name}</strong>
                        <small>{ass.role} • {ass.relation}</small>
                      </div>
                      <span className="risk-pill danger">{ass.risk} RISK</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Vehicles Node */}
              <div className="node-card">
                <div className="node-title">
                  <Car size={16} /> ยานพาหนะที่เชื่อมโยง (Linked Vehicles)
                </div>
                <div className="node-items-list">
                  {sampleVehicles.map((v, i) => (
                    <div key={i} className="node-item">
                      <div className="car-icon-wrap"><Car size={16} /></div>
                      <div className="node-item-copy">
                        <strong>{v.plate} ({v.color})</strong>
                        <small>{v.type}</small>
                      </div>
                      <span className="risk-pill active">{v.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 3: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="dossier-tab-pane">
          <section className="surface-panel timeline-panel">
            <div className="timeline-panel-header">
              <h3><Clock size={20} className="card-heading-icon" /> ลำดับเหตุการณ์และประวัติทางคดี (Offense History Timeline)</h3>
              <p>เรียงลำดับตามวันที่เกิดเหตุ ข้อหา คดีอาญา และสถานะทางกฎหมาย</p>
            </div>
            <div className="timeline-track">
              {timelineEvents.map((ev, i) => (
                <div key={i} className="timeline-event-card">
                  <div className="event-time-col">
                    <span className="time-badge">{ev.date}</span>
                  </div>
                  <div className="event-body-col">
                    <div className="event-title-row">
                      <h4>{ev.title}</h4>
                      <span className="event-status-tag">{ev.status}</span>
                    </div>
                    <p>{ev.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Formal Verification Guidance Box */}
      <section className="formal-verification-guidance-box">
        <div className="guidance-copy">
          <ShieldCheck size={24} className="guidance-icon" />
          <div>
            <strong>กระบวนการยืนยันบุคคลตามกฎหมาย (Formal Verification Guidelines)</strong>
            <p>
              ผลคัดกรองเบื้องต้นนี้ใช้เพื่อการสืบค้นและวางแผนภาคสนาม หากต้องการนำเข้าสำนวนสอบสวนหรือดำเนินคดี
              ต้องเข้าสู่กระบวนการพิมพ์ลายนิ้วมือครบ 10 นิ้วในระบบหลัก AFIS
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-formal-guidance"
          onClick={() => setShowFormalModal(true)}
        >
          <ShieldCheck size={16} /> ดูขั้นตอน Formal Verification (10 นิ้ว)
        </button>
      </section>

      {/* Modal Dialog */}
      {showFormalModal && (
        <div className="modal-backdrop" onClick={() => setShowFormalModal(false)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <ShieldCheck size={20} className="modal-header-icon" />
              <h3>ขั้นตอนการยืนยันบุคคลตามกฎหมาย (Formal Verification)</h3>
            </div>
            <div className="modal-body">
              <p>เมื่อผลคัดกรอง AI ระบุ Candidate High Risk หรือต้องนำเข้าสำนวนสอบสวนทางคดี:</p>
              <ol className="modal-step-list">
                <li>
                  <strong>พิมพ์ลายนิ้วมือ 10 นิ้ว:</strong> บันทึกลายนิ้วมือด้วยอุปกรณ์มาตรฐาน FAP20/30
                </li>
                <li>
                  <strong>ส่งสืบค้น AFIS หลัก:</strong> ส่งข้อมูลเข้าระบบตรวจพิสูจน์อัตลักษณ์ สพฐ.ตร.
                </li>
                <li>
                  <strong>รับใบรายงานผลรับรอง:</strong> ใช้ผลตรวจพิมพ์ลายนิ้วมือฉบับจริงประกอบสำนวนสั่งฟ้อง
                </li>
              </ol>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-modal-close" onClick={() => setShowFormalModal(false)}>
                รับทราบขั้นตอน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

