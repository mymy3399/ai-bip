import { useEffect, useState } from 'react'
import { ArrowRight, Camera, Check, Clock, Fingerprint, IdCard, MapPin, Network, RefreshCw, Scan, Search, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ImageFrame } from '../../components/ImageFrame'
import { simulationService } from '../../simulation/SimulationService'
import type { FieldSearchInput, SearchResult, SearchScenario } from '../../simulation/types'
import { BiometricFaceViewfinder } from './BiometricFaceViewfinder'
import { BiometricFingerprintViewfinder } from './BiometricFingerprintViewfinder'
import { ScreeningNotice } from './ScreeningNotice'

export function FieldCheckPage() {
  const navigate = useNavigate()
  const [methods, setMethods] = useState<string[]>(['fingerprint'])
  const [fullName, setFullName] = useState('นาย กิตติ สมมติ')
  const [citizenId, setCitizenId] = useState('1372671005123')
  const [cardPreview, setCardPreview] = useState<string | null>(null)
  const [cardReadMessage, setCardReadMessage] = useState('')
  const [cardCaptureState, setCardCaptureState] = useState<'idle' | 'capturing' | 'ready' | 'extracting' | 'complete'>('idle')

  function toggleMethod(id: string) {
    setMethods((current) =>
      current.includes(id) ? (current.length === 1 ? current : current.filter((m) => m !== id)) : [...current, id]
    )
  }

  function handleStartSearch() {
    const input: FieldSearchInput = {
      fullName: methods.includes('idCard') && fullName.trim() ? fullName.trim() : undefined,
      citizenId: methods.includes('idCard') && citizenId.trim() ? citizenId.trim() : undefined,
      fingerprint: methods.includes('fingerprint'),
      face: methods.includes('face'),
    }
    const knownSearch = input.fullName?.includes('กิตติ') || input.fullName?.includes('ธนกฤต') || input.fullName?.includes('พีรภัทร') ||
      input.citizenId === '1372671005123' || input.citizenId === '3100598721441' || input.citizenId === '5120499812773'
    const scenario: SearchScenario = input.citizenId === '1372671005123'
      ? 'exact-id'
      : input.fullName?.includes('กิตติ')
        ? 'warrant'
        : (input.fullName || input.citizenId) && !knownSearch
          ? 'no-result'
        : 'multiple'
    const multiModal = [input.fingerprint, input.face, Boolean(input.fullName || input.citizenId)].filter(Boolean).length > 1

    simulationService.search(input, scenario, { multiModal }).then((result: SearchResult) => {
      sessionStorage.setItem('ai-bip-field-result', JSON.stringify(result))
      navigate('/field-check/results')
    }).catch(() => {
      sessionStorage.removeItem('ai-bip-field-result')
    })
  }

  function handleCardImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setCardCaptureState('capturing')
    setCardReadMessage('กำลังถ่ายภาพและตรวจสอบหน้าบัตร...')
    const reader = new FileReader()
    reader.onload = () => {
      setCardPreview(reader.result as string)
      window.setTimeout(() => {
        setCardCaptureState('ready')
        setCardReadMessage('ถ่ายภาพสำเร็จ — พร้อมสกัดข้อความ')
      }, 700)
    }
    reader.readAsDataURL(file)
  }

  function handleExtractCardText() {
    // This project is a browser-only simulation. Keep the OCR step local and
    // explicit so real card images are never sent to an external service.
    setCardCaptureState('extracting')
    setCardReadMessage('กำลังสกัดข้อความจากบัตร...')
    window.setTimeout(() => {
      setFullName('นาย กิตติ สมมติ')
      setCitizenId('1372671005123')
      setCardCaptureState('complete')
      setCardReadMessage('สกัดข้อมูลสำเร็จ — ตรวจสอบข้อมูลก่อนค้นหา')
    }, 900)
  }

  function handleReset() {
    setMethods(['fingerprint'])
    setFullName('')
    setCitizenId('')
  }

  return (
    <div className="field-check-view page-enter">
      {/* Main 2-Column Field Check Workspace matching reference image */}
      <div className="field-workspace-grid">
        {/* LEFT PANEL: การตรวจสอบบุคคล */}
        <section className="surface-panel field-left-panel">
          <div className="panel-header-title">
            <h3>การตรวจสอบบุคคล</h3>
          </div>

          <div className="method-selector-section">
            <span className="selector-label">เลือกวิธีการตรวจสอบ</span>
            <div className="method-tab-buttons">
              <button
                type="button"
                className={`method-tab-btn ${methods.includes('fingerprint') ? 'selected' : ''}`}
                onClick={() => toggleMethod('fingerprint')}
              >
                <Fingerprint size={18} />
                <span>Fingerprint</span>
                {methods.includes('fingerprint') && <Check size={14} className="tab-check" />}
              </button>

              <button
                type="button"
                className={`method-tab-btn ${methods.includes('face') ? 'selected' : ''}`}
                onClick={() => toggleMethod('face')}
              >
                <Camera size={18} />
                <span>Face</span>
                {methods.includes('face') && <Check size={14} className="tab-check" />}
              </button>

              <button
                type="button"
                className={`method-tab-btn ${methods.includes('idCard') ? 'selected' : ''}`}
                onClick={() => toggleMethod('idCard')}
              >
                <IdCard size={18} />
                <span>ID Card</span>
                <span className="sr-only">ชื่อ-นามสกุล / เลขประชาชน</span>
                {methods.includes('idCard') && <Check size={14} className="tab-check" />}
              </button>
            </div>
          </div>

          {/* Text Inputs Stack for Name or Citizen ID search */}
          {methods.includes('idCard') && (
            <div className="field-inputs-stack">
              <div className="id-card-input-panel">
                <div className="id-card-panel-heading">
                  <div>
                    <strong>ข้อมูลจากบัตรประชาชน</strong>
                    <small>กรอกชื่อ หรือเลขประชาชน หรือใช้ทั้งสองอย่างร่วมกัน</small>
                  </div>
                  <span className="id-card-demo-tag">LOCAL DEMO</span>
                </div>

                <div className="id-card-fields">
                  <label className="field-input-label">
                    ชื่อ-นามสกุล
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="เช่น นาย กิตติ สมมติ"
                    />
                  </label>
                  <label className="field-input-label">
                    เลขประชาชน 13 หลัก
                    <input
                      inputMode="numeric"
                      maxLength={13}
                      value={citizenId}
                      onChange={(event) => setCitizenId(event.target.value.replace(/\D/g, ''))}
                      placeholder="เช่น 1372671005123"
                    />
                  </label>
                </div>

                <div className={`id-card-capture ${cardCaptureState === 'capturing' || cardCaptureState === 'extracting' ? 'is-scanning' : ''}`}>
                  <input id="id-card-image" type="file" accept="image/*" capture="environment" onChange={handleCardImage} />
                  {cardPreview ? (
                    <ImageFrame src={cardPreview} alt="ตัวอย่างภาพบัตรประชาชนที่เลือก" />
                  ) : (
                    <div className={`id-card-mock ${cardCaptureState === 'capturing' || cardCaptureState === 'extracting' ? 'is-scanning' : ''}`} aria-label="หน้าบัตรประชาชนจำลอง">
                      <div className="id-card-mock-chip" />
                      <strong>บัตรประชาชน</strong>
                      <small>THAI ID CARD</small>
                      <span>นาย กิตติ สมมติ</span>
                      <em>1-3726-71005-12-3</em>
                    </div>
                  )}
                  <div className="id-card-capture-copy">
                    <strong>ถ่ายภาพบัตรประชาชน</strong>
                    <small>{cardReadMessage || 'จัดวางหน้าบัตรให้เห็นข้อมูลครบถ้วน'}</small>
                  </div>
                  <label htmlFor="id-card-image" className={`id-card-upload-btn ${cardCaptureState === 'capturing' ? 'is-busy' : ''}`}>
                    {cardCaptureState === 'capturing' ? <RefreshCw size={15} className="spin-icon" /> : <Camera size={15} />}
                    {cardCaptureState === 'capturing' ? 'กำลังถ่าย...' : 'ถ่ายภาพ'}
                  </label>
                  <button type="button" className={`id-card-extract-btn ${cardCaptureState === 'extracting' ? 'is-busy' : ''}`} onClick={handleExtractCardText} disabled={cardCaptureState === 'capturing' || cardCaptureState === 'extracting'}>
                    {cardCaptureState === 'extracting' ? <RefreshCw size={15} className="spin-icon" /> : <Scan size={15} />}
                    {cardCaptureState === 'extracting' ? 'กำลังอ่าน...' : cardCaptureState === 'complete' ? 'อ่านแล้ว' : 'สกัดข้อความ'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Active Scanner Visual Box */}
          {(methods.includes('fingerprint') || methods.includes('face')) && (
            <div className="biometric-scan-stack">
              {methods.includes('fingerprint') && (
                <div className="scanner-card-box">
                  <span className="scanner-title">สแกนลายนิ้วมือ (AFIS)</span>
                  <BiometricFingerprintViewfinder />
                </div>
              )}
              {methods.includes('face') && (
                <div className="scanner-card-box">
                  <span className="scanner-title">สแกนใบหน้า (Face AI)</span>
                  <BiometricFaceViewfinder />
                </div>
              )}
            </div>
          )}

          {/* Audit Metadata Panel (ข้อมูลการตรวจสอบ) */}
          <div className="audit-data-section">
            <span className="audit-title">ข้อมูลการตรวจสอบ</span>
            <div className="audit-list">
              <div className="audit-row">
                <span className="audit-label">
                  <UserRound size={14} /> รหัสการตรวจสอบ
                </span>
                <strong className="audit-val">BFC-670520-102436</strong>
              </div>
              <div className="audit-row">
                <span className="audit-label">
                  <MapPin size={14} /> สถานที่ตรวจสอบ
                </span>
                <strong className="audit-val">ถ.สุขุมวิท เขตคลองเตย กรุงเทพมหานคร</strong>
              </div>
              <div className="audit-row">
                <span className="audit-label">
                  <Network size={14} /> พิกัด
                </span>
                <strong className="audit-val">13.7267, 100.5123</strong>
              </div>
              <div className="audit-row">
                <span className="audit-label">
                  <UserRound size={14} /> ผู้ตรวจสอบ
                </span>
                <strong className="audit-val">ร.ต.อ. วรพจน์ แสงทอง</strong>
              </div>
              <div className="audit-row">
                <span className="audit-label">
                  <Clock size={14} /> เวลาเริ่มต้น
                </span>
                <strong className="audit-val">20 พ.ค. 2567 10:24:12</strong>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="panel-bottom-actions">
            <button type="button" className="btn-cancel" onClick={handleReset}>
              ยกเลิกการตรวจสอบ
            </button>
            <button type="button" className="btn-submit" onClick={handleStartSearch}>
              บันทึกและค้นหา <Search size={16} />
            </button>
          </div>
        </section>
      </div>

      <ScreeningNotice />
    </div>
  )
}

export function FieldCapturePage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0)
  const phases = ['Live Capture', 'Biometric Quality Check', 'Cross-Database Search', 'AI Candidate Ranking']

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhase((current) => {
        if (current >= 3) {
          window.clearInterval(timer)
          return current
        }
        return current + 1
      })
    }, 500)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="capture-page">
      <div className="capture-card">
        <span className="eyebrow">FIELD SCREENING IN PROGRESS</span>
        <h2>กำลังตรวจสอบอัตลักษณ์และประวัติ</h2>
        <div className="progress-track">
          <span style={{ width: `${((phase + 1) / phases.length) * 100}%` }} />
        </div>
        <div className="capture-steps">
          {phases.map((item, index) => (
            <div className={index <= phase ? 'is-done' : ''} key={item}>
              <span>{index < phase ? '✓' : index + 1}</span>
              {item}
            </div>
          ))}
        </div>
        <div className="capture-orb">
          <Fingerprint size={74} />
        </div>
        <p>{phase < 3 ? 'ระบบจำลองกำลังประมวลผลอัตลักษณ์เรียลไทม์' : 'ประมวลผล Candidate Ranking สำเร็จ'}</p>
        {phase >= 3 && (
          <button className="primary-button" type="button" onClick={() => navigate('/field-check/results')}>
            ดูรายการ Candidate Match <ArrowRight size={18} />
          </button>
        )}
      </div>
    </section>
  )
}

export function useFieldResult(): SearchResult | null {
  const raw = sessionStorage.getItem('ai-bip-field-result')
  return raw ? (JSON.parse(raw) as SearchResult) : null
}
