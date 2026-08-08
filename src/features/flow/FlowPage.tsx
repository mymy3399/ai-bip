import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, Play, Pause, Maximize2, ShieldCheck, Terminal, Cpu, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PipelineStep {
  id: string
  num: string
  title: string
  category: 'field' | 'ai' | 'verification' | 'legal'
  latency: string
  desc: string
  input: string
  output: string
  humanRole: string
}

const pipelineSteps: PipelineStep[] = [
  {
    id: 'field-check',
    num: '01',
    title: 'Biometric & ANPR Field Check',
    category: 'field',
    latency: '340ms',
    desc: 'เจ้าหน้าที่ภาคสนามถ่ายภาพใบหน้า สแกนลายนิ้วมือ FAP20 หรืออ่านป้ายทะเบียน ANPR ผ่านอุปกรณ์พกพา',
    input: 'Live Camera Frame / ANPR License Plate / Fingerprint Sensor Data',
    output: 'Raw Biometric Data Template (Encrypted JSON)',
    humanRole: 'เจ้าหน้าที่ภาคสนามกดยืนยันการส่งข้อมูล',
  },
  {
    id: 'secure-gateway',
    num: '02',
    title: 'Secure Gateway & Encryption',
    category: 'ai',
    latency: '85ms',
    desc: 'ระบบเข้ารหัสข้อมูลจำลอง TLS 1.3 ส่งผ่านท่อสื่อสารปลอดภัยเข้าสู่ระบบประมวลผลกลาง',
    input: 'Encrypted Biometric Data Template',
    output: 'Verified Secure Token Session',
    humanRole: 'ตรวจสอบสถานะการเชื่อมต่อ (Auto-Audited)',
  },
  {
    id: 'cross-check',
    num: '03',
    title: 'Multi-Source Database Cross-Check',
    category: 'ai',
    latency: '420ms',
    desc: 'ประมวลผลเปรียบเทียบข้อมูลพร้อมกันหลายแหล่ง (ทะเบียนราษฎร์, หมายจับ CRIMES, AFIS Index)',
    input: 'Biometric Vector + Identity Parameters',
    output: 'Cross-Match Candidate Score Matrix',
    humanRole: 'กำหนดเกณฑ์ความสอดคล้อง (Similarity Threshold)',
  },
  {
    id: 'ai-ranking',
    num: '04',
    title: 'Biometric AI Ranking & Risk Scoring',
    category: 'ai',
    latency: '150ms',
    desc: 'อัลกอริทึม AI จัดลำดับ Candidate Match พร้อมวิเคราะห์ระดับความเสี่ยง (Risk Tier 1-4)',
    input: 'Cross-Match Candidate Score Matrix',
    output: 'Top-N Candidate Match List (% Similarity)',
    humanRole: 'ตรวจสอบลำดับ Candidate ที่ AI เสนอ',
  },
  {
    id: 'human-verify',
    num: '05',
    title: 'Officer Verification & Decision',
    category: 'verification',
    latency: 'Human-in-the-Loop',
    desc: 'เจ้าหน้าที่ตรวจสอบเปรียบเทียบภาพใบหน้า ตำหนิรูปพรรณ และรายละเอียดหมายจับก่อนสั่งการ',
    input: 'Top-N Candidate Match List',
    output: 'Verified Candidate Identity Dossier',
    humanRole: 'เจ้าหน้าที่กดยืนยันความสอดคล้อง (Human Decision Gatekeeper)',
  },
  {
    id: 'legal-ai',
    num: '06',
    title: 'Legal AI Charge Analysis',
    category: 'legal',
    latency: '680ms',
    desc: 'สกัดองค์ประกอบข้อเท็จจริง เสนอ Candidate Charges พร้อมบทมาตราและจัดทำร่างบันทึกข้อความ',
    input: 'Verified Candidate Dossier + Fact Narrative',
    output: 'Candidate Charges Breakdown + Draft Memo Report',
    humanRole: 'พนักงานสอบสวนตรวจรับร่างและอนุมัติสั่งคดี',
  },
]

export function FlowPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % pipelineSteps.length)
      }, 2500)
    }
    return () => clearInterval(timer)
  }, [isPlaying])

  const step = pipelineSteps[activeStep]

  return (
    <section className="flow-page">
      <div className="page-intro">
        <div>
          <p className="section-kicker">OPERATIONAL FLOW / PIPELINE ARCHITECTURE</p>
          <h2>AI-BIP Operational Workflow Canvas</h2>
          <p>ภาพรวมผังการทำงานระบบปัญญาประดิษฐ์และ Human-in-the-Loop ตั้งแต่ภาคสนามถึงชั้นอัยการ</p>
        </div>
        <div className="flow-header-actions">
          <button
            type="button"
            className={`secondary-button ${isPlaying ? 'active' : ''}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'หยุดการจำลอง (Pause Pipeline)' : 'เล่นผังจำลอง (Run Simulation)'}
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/flow/presentation')}
          >
            <Maximize2 size={16} /> Presentation Mode
          </button>
        </div>
      </div>

      <div className="flow-note">
        <ShieldCheck size={17} /> ทุกขั้นตอนในผังการทำงานคงหลักการ <strong>Human-in-the-Loop</strong> เจ้าหน้าที่เป็นผู้ตรวจสอบและอนุมัติทุกขั้นตอน
      </div>

      {/* Workflow Horizontal Node Runner */}
      <div className="flow-board">
        {pipelineSteps.map((s, idx) => (
          <div key={s.id} className="flow-node-wrap">
            <button
              type="button"
              className={`flow-node ${activeStep === idx ? 'active' : ''}`}
              onClick={() => {
                setActiveStep(idx)
                setIsPlaying(false)
              }}
            >
              <div className="node-num">{s.num}</div>
              <div className="node-title">{s.title}</div>
              <span className={`node-cat cat--${s.category}`}>{s.category.toUpperCase()}</span>
            </button>
            {idx < pipelineSteps.length - 1 && <ArrowRight className="flow-arrow" size={18} />}
          </div>
        ))}
      </div>

      {/* Node Inspector Breakdown */}
      <div className="flow-detail">
        <div className="inspector-header">
          <div className="inspector-title">
            <span className="eyebrow">NODE INSPECTOR • STEP {step.num}</span>
            <h3>{step.title}</h3>
          </div>
          <span className="latency-badge">
            <Cpu size={14} /> LATENCY: {step.latency}
          </span>
        </div>

        <p className="inspector-desc">{step.desc}</p>

        <div className="inspector-grid">
          <div className="inspector-card">
            <div className="card-label">
              <Terminal size={14} /> INPUT PARAMETERS:
            </div>
            <code>{step.input}</code>
          </div>

          <div className="inspector-card">
            <div className="card-label">
              <CheckCircle2 size={14} /> OUTPUT PROCESSED:
            </div>
            <code>{step.output}</code>
          </div>

          <div className="inspector-card human-card">
            <div className="card-label">
              <UserCheck size={14} /> HUMAN-IN-THE-LOOP ROLE:
            </div>
            <strong>{step.humanRole}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PresentationPage() {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const next = () => setActive((i) => (i + 1) % pipelineSteps.length)
  const prev = () => setActive((i) => (i - 1 + pipelineSteps.length) % pipelineSteps.length)

  const step = pipelineSteps[active]

  return (
    <div
      className="presentation-page"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next()
        if (e.key === 'ArrowLeft') prev()
        if (e.key === 'Escape') navigate('/flow')
      }}
    >
      <div className="presentation-top">
        <span>AI-BIP OPERATIONAL FLOW • PRESENTATION SLIDE</span>
        <span>กดลูกศร 🠄 🠆 หรือคลิกเพื่อเปลี่ยนสไลด์</span>
      </div>

      <div className="presentation-center">
        <span className="presentation-index">
          STEP {step.num} / {pipelineSteps.length}
        </span>
        <h1>{step.title}</h1>
        <p>{step.desc}</p>
        <div className="presentation-meta">
          <span>
            <strong>INPUT:</strong> {step.input}
          </span>
          <span>
            <strong>OUTPUT:</strong> {step.output}
          </span>
          <span>
            <strong>HUMAN ROLE:</strong> {step.humanRole}
          </span>
        </div>
      </div>

      <div className="presentation-controls">
        <button type="button" onClick={prev}>
          ← สไลด์ก่อนหน้า
        </button>
        <button type="button" onClick={next}>
          สไลด์ถัดไป →
        </button>
      </div>

      <button type="button" className="presentation-close" onClick={() => navigate('/flow')}>
        ปิด Presentation (Esc)
      </button>
    </div>
  )
}

