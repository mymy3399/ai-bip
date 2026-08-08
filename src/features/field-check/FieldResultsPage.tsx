import { useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Database,
  FileCheck2,
  FileText,
  Globe,
  HelpCircle,
  IdCard,
  Info,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserRound,
  X,
  ZoomIn,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import candidate1 from '../../assets/candidate-1.png'
import candidate2 from '../../assets/candidate-2.png'
import candidate3 from '../../assets/candidate-3.png'

const mockCandidatesList = [
  {
    id: 'candidate-1',
    title: 'Candidate 1',
    name: 'นาย กิตติ สมมติ',
    citizenId: '1372671005123',
    similarity: 91,
    img: candidate1,
    age: 34,
    gender: 'ชาย',
    hasWarrant: true,
    sources: [
      { name: 'ระบบหมายจับ สำนักงานตำรวจแห่งชาติ', icon: Shield, status: 'warrant', text: 'พบข้อมูลที่อาจเกี่ยวข้อง' },
      { name: 'ฐานข้อมูลบุคคลต้องห้าม/เฝ้าระวัง', icon: IdCard, status: 'clean', text: 'ไม่พบข้อมูล' },
      { name: 'ฐานข้อมูลคดีอาญา', icon: Database, status: 'partial', text: 'พบข้อมูลบางส่วน' },
      { name: 'ข้อมูลหนังสือเดินทาง', icon: Globe, status: 'clean', text: 'ไม่พบข้อมูล' },
      { name: 'ฐานข้อมูลยานพาหนะ', icon: FileText, status: 'clean', text: 'ไม่พบข้อมูล' },
    ],
  },
  {
    id: 'candidate-2',
    title: 'Candidate 2',
    name: 'นาย ธนกฤต ศรีวัฒน์',
    citizenId: '3100598721441',
    similarity: 84,
    img: candidate2,
    age: 28,
    gender: 'ชาย',
    hasWarrant: false,
    sources: [
      { name: 'ระบบหมายจับ สำนักงานตำรวจแห่งชาติ', icon: Shield, status: 'clean', text: 'ไม่พบข้อมูล' },
      { name: 'ฐานข้อมูลบุคคลต้องห้าม/เฝ้าระวัง', icon: IdCard, status: 'clean', text: 'ไม่พบข้อมูล' },
      { name: 'ฐานข้อมูลคดีอาญา', icon: Database, status: 'clean', text: 'ไม่พบข้อมูล' },
      { name: 'ข้อมูลหนังสือเดินทาง', icon: Globe, status: 'clean', text: 'ไม่พบข้อมูล' },
      { name: 'ฐานข้อมูลยานพาหนะ', icon: FileText, status: 'clean', text: 'ไม่พบข้อมูล' },
    ],
  },
  {
    id: 'candidate-3',
    title: 'Candidate 3',
    name: 'นาย พีรภัทร อนันต์ชัย',
    citizenId: '5120499812773',
    similarity: 76,
    img: candidate3,
    age: 30,
    gender: 'ชาย',
    hasWarrant: false,
    sources: [
      { name: 'ระบบหมายจับ สำนักงานตำรวจแห่งชาติ', icon: Shield, status: 'clean', text: 'ไม่พบข้อมูล' },
      { name: 'ฐานข้อมูลบุคคลต้องห้าม/เฝ้าระวัง', icon: IdCard, status: 'clean', text: 'ไม่พบข้อมูล' },
      { name: 'ฐานข้อมูลคดีอาญา', icon: Database, status: 'clean', text: 'ไม่พบข้อมูล' },
      { name: 'ข้อมูลหนังสือเดินทาง', icon: Globe, status: 'clean', text: 'ไม่พบข้อมูล' },
      { name: 'ฐานข้อมูลยานพาหนะ', icon: FileText, status: 'clean', text: 'ไม่พบข้อมูล' },
    ],
  },
]

function getVisibleCandidates() {
  const rawResult = sessionStorage.getItem('ai-bip-field-result')
  if (!rawResult) return mockCandidatesList

  try {
    const result = JSON.parse(rawResult) as { candidates?: Array<{ id: string }> }
    const resultIds = new Set(result.candidates?.map((candidate) => candidate.id))
    const filtered = mockCandidatesList.filter((candidate) => resultIds.has(candidate.id))
    return filtered.length > 0 ? filtered : mockCandidatesList
  } catch {
    return mockCandidatesList
  }
}

function getSearchMethodLabel() {
  const rawResult = sessionStorage.getItem('ai-bip-field-result')
  if (!rawResult) return 'Face + Name Screening'

  try {
    const result = JSON.parse(rawResult) as { searchMethods?: string[] }
    return result.searchMethods?.length ? result.searchMethods.join(' + ') : 'Field Screening'
  } catch {
    return 'Field Screening'
  }
}

function getSearchNameLabel() {
  const rawResult = sessionStorage.getItem('ai-bip-field-result')
  if (!rawResult) return 'ไม่ได้ใช้ชื่อค้นหา'

  try {
    const result = JSON.parse(rawResult) as {
      searchMethods?: string[]
      searchQuery?: { fullName?: string; citizenId?: string }
    }
    if (!result.searchMethods?.includes('ID Card')) return 'ไม่ได้ใช้ชื่อค้นหา'
    return result.searchQuery?.fullName || (result.searchQuery?.citizenId ? 'ค้นด้วยเลขประชาชน' : 'ไม่ได้ใช้ชื่อค้นหา')
  } catch {
    return 'ไม่ได้ใช้ชื่อค้นหา'
  }
}

function isOneToOneSearch() {
  const rawResult = sessionStorage.getItem('ai-bip-field-result')
  if (!rawResult) return false

  try {
    const result = JSON.parse(rawResult) as { searchMethods?: string[] }
    return result.searchMethods?.length === 1 && result.searchMethods[0] === 'ID Card'
  } catch {
    return false
  }
}

export function FieldResultsPage() {
  const navigate = useNavigate()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [showFormalModal, setShowFormalModal] = useState(false)
  const [showCandidateModal, setShowCandidateModal] = useState(false)
  const [imageModal, setImageModal] = useState<{ src: string; alt: string } | null>(null)

  const candidateList = getVisibleCandidates()
  const selectedCandidate = candidateList[selectedIdx] ?? candidateList[0]
  const searchMethodLabel = getSearchMethodLabel()
  const searchNameLabel = getSearchNameLabel()
  const oneToOneSearch = isOneToOneSearch()

  return (
    <div className="candidate-list-page page-enter">
      {/* Top Execution Search Context Bar */}
      <div className="search-context-bar">
        <div className="context-item">
          <Camera size={16} className="context-icon" />
          <div>
            <small>ประเภทการตรวจ</small>
            <strong>{searchMethodLabel}</strong>
          </div>
        </div>

        <div className="context-item">
          <UserRound size={16} className="context-icon" />
          <div>
            <small>ชื่อที่ใช้ค้นหา</small>
            <strong>{searchNameLabel}</strong>
          </div>
        </div>

        <div className="context-item">
          <Calendar size={16} className="context-icon" />
          <div>
            <small>วันที่และเวลา</small>
            <strong>28 พ.ค. 2567 10:24</strong>
          </div>
        </div>

        <div className="context-item">
          <UserCheck size={16} className="context-icon" />
          <div>
            <small>ผู้ตรวจสอบ</small>
            <strong>ร.ต.อ. สมชาย ใจดี</strong>
          </div>
        </div>

        <div className="context-item">
          <CreditCard size={16} className="context-icon" />
          <div>
            <small>รหัสการตรวจ</small>
            <strong>FC-670528-1024-001</strong>
          </div>
        </div>
      </div>

      {/* Main Candidate List Workspace (2 Columns) */}
      <div className="candidate-list-workspace">
        {/* LEFT COLUMN: Candidate List Stack */}
        <section className="surface-panel candidate-left-panel">
          <div className="candidate-list-header">
            <h3>Candidate List <HelpCircle size={14} /></h3>
            <small>
              {oneToOneSearch ? 'ผลการตรวจสอบข้อมูลตรงกัน (1:1)' : 'ผลการเปรียบเทียบใบหน้า (เรียงตามความใกล้เคียง)'}
            </small>
          </div>

          <div className="candidate-cards-list">
            {candidateList.map((item, idx) => (
              <div
                key={item.id}
                className={`candidate-list-card ${selectedIdx === idx ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedIdx(idx)
                  setShowCandidateModal(true)
                }}
                role="button"
                tabIndex={0}
              >
                <div className="card-checkbox">
                  {selectedIdx === idx ? (
                    <span className="checkbox-box checked">✓</span>
                  ) : (
                    <span className="checkbox-box" />
                  )}
                </div>

                <button
                  type="button"
                  className="candidate-image-button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setSelectedIdx(idx)
                    setImageModal({ src: item.img, alt: item.name })
                  }}
                  aria-label={`ขยายรูป ${item.title}`}
                >
                  <img src={item.img} alt={item.title} className="card-thumbnail" />
                  <ZoomIn size={14} />
                </button>

                <div className="card-details">
                  <h4>{item.name}</h4>
                  <small className="candidate-citizen-id">เลขประชาชน: {item.citizenId}</small>
                  {!oneToOneSearch && (
                    <div className="similarity-wrap">
                      <small>ความใกล้เคียง</small>
                      <strong>{item.similarity}%</strong>
                    </div>
                  )}
                  <span className="view-link">
                    <FileText size={12} /> ดูรายละเอียด <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="btn-search-again" onClick={() => navigate('/field-check')}>
            <RefreshCw size={15} /> ค้นหาอีกครั้ง
          </button>
        </section>

        {/* RIGHT COLUMN: Selected Candidate Inspection Panel */}
        {showCandidateModal && <div className="candidate-mobile-backdrop" onClick={() => setShowCandidateModal(false)} />}
        <section className={`surface-panel candidate-right-panel ${showCandidateModal ? 'is-open' : ''}`}>
          <button type="button" className="candidate-modal-close" onClick={() => setShowCandidateModal(false)} aria-label="ปิดรายละเอียด Candidate">
            <X size={18} />
          </button>
          <div className="candidate-detail-header">
            <h3>รายละเอียด {selectedCandidate.title}</h3>
            <span className="pending-verification-pill">
              <UserCheck size={14} /> รอดำเนินการตรวจสอบโดยเจ้าหน้าที่
            </span>
          </div>

          <div className="candidate-identity-section">
            <button
              type="button"
              className="large-portrait-button"
              onClick={() => setImageModal({ src: selectedCandidate.img, alt: selectedCandidate.name })}
              aria-label={`ขยายรูป ${selectedCandidate.name}`}
            >
              <img src={selectedCandidate.img} alt={selectedCandidate.name} className="large-portrait" />
              <span><ZoomIn size={15} /> ขยายรูป</span>
            </button>

            <div className="identity-copy">
              <h2>{selectedCandidate.name}</h2>
              <div className="citizen-id-detail">เลขประชาชน: {selectedCandidate.citizenId}</div>

              <div className="demographics-row">
                <span>
                  <UserRound size={14} /> เพศ: {selectedCandidate.gender}
                </span>
                <span className="divider">|</span>
                <span>
                  <Calendar size={14} /> อายุโดยประมาณ: {selectedCandidate.age} ปี
                </span>
              </div>

              {selectedCandidate.hasWarrant ? (
                <div className="warrant-alert-banner">
                  <ShieldAlert size={18} />
                  <strong>พบข้อมูลที่อาจเกี่ยวข้องกับหมายจับ</strong>
                </div>
              ) : (
                <div className="clean-alert-banner">
                  <CheckCircle2 size={18} />
                  <span>ไม่พบประวัติหมายจับติดตัว</span>
                </div>
              )}
            </div>
          </div>

          {/* Source Provenance Breakdown Table */}
          <div className="source-breakdown-section">
            <h4>ผลการตรวจสอบตามแหล่งข้อมูล</h4>

            <div className="source-table">
              <div className="table-header-row">
                <span>แหล่งข้อมูล</span>
                <span>ผลการพบข้อมูล</span>
                <span>ความใกล้เคียง</span>
              </div>

              {selectedCandidate.sources.map((src, i) => {
                const Icon = src.icon
                return (
                  <div className="table-data-row" key={i}>
                    <span className="source-name">
                      <Icon size={15} className="source-icon" /> {src.name}
                    </span>
                    <span className={`source-status status-${src.status}`}>
                      {src.status === 'warrant' ? (
                        <>
                          <ShieldAlert size={14} /> {src.text}
                        </>
                      ) : src.status === 'partial' ? (
                        <>
                          <Clock size={14} /> {src.text}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} /> {src.text}
                        </>
                      )}
                    </span>
                    <span className="source-similarity">—</span>
                  </div>
                )
              })}
            </div>

            <small className="table-footnote">
              หมายเหตุ: ผลการตรวจสอบจากแต่ละแหล่งข้อมูล อาจมีความล่าช้าในการอัปเดต
            </small>
          </div>

          {/* Action Buttons Row */}
          <div className="candidate-action-buttons">
            <button
              type="button"
              className="btn-open-detail"
              onClick={() => navigate(`/field-check/candidate/${selectedCandidate.id}`)}
            >
              <FileText size={16} /> เปิดรายละเอียดเพื่อตรวจสอบ
            </button>

            <button
              type="button"
              className="btn-formal-verification"
              onClick={() => setShowFormalModal(true)}
            >
              <ShieldCheck size={16} /> ดูขั้นตอน Formal Verification
            </button>
          </div>
        </section>
      </div>

      {/* Bottom Full-Width Disclaimer Notice */}
      <div className="bottom-disclaimer-banner">
        <Info size={16} />
        <span>ข้อมูลนี้เป็นผลคัดกรองเบื้องต้น ไม่ใช่การยืนยันตัวบุคคลหรือสถานะทางคดี</span>
      </div>

      {/* Formal Verification Modal Dialog */}
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

      {imageModal && (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="ภาพ Candidate ขนาดใหญ่" onClick={() => setImageModal(null)}>
          <button type="button" className="image-lightbox-close" onClick={() => setImageModal(null)} aria-label="ปิดภาพขนาดใหญ่">
            <X size={22} />
          </button>
          <img src={imageModal.src} alt={imageModal.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </div>
  )
}
