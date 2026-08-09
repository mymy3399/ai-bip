import { useRef, useState } from 'react'
import { Camera, Check, FileUp, RefreshCw, Upload } from 'lucide-react'
import candidate1 from '../../assets/candidate-1.png'
import { advanceScanProgress } from './biometricScan'
import { ImageFrame } from '../../components/ImageFrame'

interface BiometricFaceViewfinderProps {
  onCaptureComplete?: () => void
}

export function BiometricFaceViewfinder({ onCaptureComplete }: BiometricFaceViewfinderProps) {
  const [activeMode, setActiveMode] = useState<'camera' | 'upload'>('camera')
  const [isCapturing, setIsCapturing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isComplete, setIsComplete] = useState(true)
  const [capturedImage, setCapturedImage] = useState<string>(candidate1)
  const [progress, setProgress] = useState(100)
  const [flashEffect, setFlashEffect] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleTriggerLiveCapture() {
    if (isCapturing || isUploading) return
    setIsCapturing(true)
    setIsComplete(false)
    setProgress(10)

    // Camera Shutter Snap Flash Animation
    setTimeout(() => {
      setFlashEffect(true)
      setTimeout(() => setFlashEffect(false), 250)
    }, 400)

    let p = 10
    const interval = setInterval(() => {
      p = advanceScanProgress(p, 8)
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setIsCapturing(false)
        setIsComplete(true)
        if (onCaptureComplete) onCaptureComplete()
      }
      setProgress(p)
    }, 120)
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setIsComplete(false)
    setProgress(15)

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageUrl = event.target.result as string
        setCapturedImage(imageUrl)
      }
    }
    reader.readAsDataURL(file)

    let p = 15
    const interval = setInterval(() => {
      p = advanceScanProgress(p, 10)
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setIsUploading(false)
        setIsComplete(true)
        if (onCaptureComplete) onCaptureComplete()
      }
      setProgress(p)
    }, 130)
  }

  return (
    <div className="futuristic-face-container">
      {/* Top Selector Mode Tabs (Live Camera vs Upload File) */}
      <div className="face-mode-selector-bar">
        <button
          type="button"
          className={`face-mode-btn ${activeMode === 'camera' ? 'active' : ''}`}
          onClick={() => setActiveMode('camera')}
        >
          <Camera size={16} />
          <span className="face-mode-label"><strong>ถ่ายภาพ</strong><small>Live Camera</small></span>
        </button>

        <button
          type="button"
          className={`face-mode-btn ${activeMode === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveMode('upload')}
        >
          <Upload size={16} />
          <span className="face-mode-label"><strong>อัปโหลด</strong><small>Upload Image</small></span>
        </button>
      </div>

      {/* Main Viewfinder Grid Workspace */}
      <div className="face-workspace-grid">
        {/* Left Viewfinder Camera/Image Screen */}
        <div className={`face-scanner-viewport ${isCapturing || isUploading ? 'scanning-active' : ''}`}>
          {/* Shutter Snap Flash */}
          {flashEffect && <div className="shutter-flash-overlay" />}

          {/* Glare and HUD Reticle */}
          <div className="glass-glare-effect" />
          <div className="hud-corner top-left" />
          <div className="hud-corner top-right" />
          <div className="hud-corner bottom-left" />
          <div className="hud-corner bottom-right" />

          {/* Top HUD Header */}
          <div className="hud-header-badge">
            <span className={`live-dot ${isCapturing ? 'scanning-pulse' : ''}`} />
            {activeMode === 'camera' ? 'CCTV REAL-TIME STREAM 1080P' : 'FILE IMAGE ANALYZER'}
          </div>

          {/* Image Display */}
          <ImageFrame src={capturedImage} alt="ภาพคัดกรองใบหน้า" className="face-viewfinder-img" />

          {/* AI Face Detection Bounding Box with Corner Brackets & Landmarks */}
          {(isCapturing || isComplete) && (
            <div className="ai-face-bounding-box">
              <span className="box-corner top-l" />
              <span className="box-corner top-r" />
              <span className="box-corner bot-l" />
              <span className="box-corner bot-r" />

              {/* Facial Landmark Points */}
              <div className="facial-point eye-left" />
              <div className="facial-point eye-right" />
              <div className="facial-point nose" />
              <div className="facial-point mouth-left" />
              <div className="facial-point mouth-right" />

              <div className="bounding-box-badge">FACE DETECTED 94.2%</div>
            </div>
          )}

          {/* Sweeping Cyan Scanning Radar Overlay */}
          {(isCapturing || isUploading) && (
            <div className="face-laser-scan-line">
              <div className="laser-glow-aura" />
            </div>
          )}

          <div className="hud-bottom-badge">
            AI MODEL: <strong>DEEP-FACE V4.2</strong> (512-D VECTOR)
          </div>
        </div>

        {/* Right Action & Processing Panel */}
        <div className="face-control-panel">
          {activeMode === 'camera' ? (
            <div className="camera-controls-box">
              <div className="headline-text">
                <strong>{isCapturing ? 'กำลังจับภาพลายนิ้วหน้า AI...' : isComplete ? 'ถ่ายภาพและวิเคราะห์ใบหน้าสำเร็จ' : 'พร้อมถ่ายภาพสด'}</strong>
                <small>ถ่ายภาพสดผ่านกล้องภาคสนามเพื่อค้นหาในฐานข้อมูลทะเบียนราษฎร์และหมายจับ</small>
              </div>

              <button
                type="button"
                className={`btn-face-action btn-camera-capture ${isCapturing ? 'capturing' : ''}`}
                onClick={handleTriggerLiveCapture}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" /> กำลังถ่ายภาพและประมวลผล ({progress}%)
                  </>
                ) : (
                  <>
                    <Camera size={18} /> กดเพื่อถ่ายภาพสด (Capture Photo Now)
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="upload-controls-box">
              <div className="headline-text">
                <strong>{isUploading ? 'กำลังประมวลผลไฟล์ภาพ...' : isComplete ? 'อัปโหลดภาพสำเร็จ' : 'เลือกไฟล์ภาพเพื่อสแกน'}</strong>
                <small>รองรับไฟล์ภาพนามสกุล .JPG, .PNG, .WEBP สำหรับเปรียบเทียบใบหน้า</small>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              <button
                type="button"
                className={`btn-face-action btn-upload-trigger ${isUploading ? 'uploading' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" /> กำลังวิเคราะห์ไฟล์ภาพ ({progress}%)
                  </>
                ) : (
                  <>
                    <FileUp size={18} /> คลิกเพื่อเลือกไฟล์อัปโหลดภาพ (Browse Photo File)
                  </>
                )}
              </button>
            </div>
          )}

          {/* Live Progress Bar */}
          {(isCapturing || isUploading || progress > 0) && (
            <div className="progress-bar-wrap">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-percent">{progress}%</span>
            </div>
          )}

          {/* AI Facial Feature Extraction Checklist */}
          <div className="scan-checklist">
            <div className={`check-item ${progress >= 30 ? 'done' : 'pending'}`}>
              <Check size={14} /> <span>ตรวจจับพิกัดใบหน้า (Face Bounding Box)</span>
            </div>
            <div className={`check-item ${progress >= 70 ? 'done' : 'pending'}`}>
              <Check size={14} /> <span>สกัดเวกเตอร์ใบหน้า 512-D Facial Vector</span>
            </div>
            <div className={`check-item ${progress >= 100 ? 'done' : 'pending'}`}>
              {progress >= 100 ? <Check size={14} /> : <RefreshCw size={13} className="spin-icon" />}
              <span>เปรียบเทียบข้อมูลกับฐานข้อมูลทะเบียนราษฎร์</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
