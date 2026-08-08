import { useEffect, useRef, useState } from 'react'
import { Bot, Check, Copy, Download, FileText, MessageSquare, RefreshCw, Send, ShieldCheck, Sparkles, Trash2, User } from 'lucide-react'

interface AssistantDef {
  id: string
  shortTitle: string
  title: string
  desc: string
  icon: string
  color: string
  badge: string
  prompts: string[]
  sampleAnswer: string
}

const assistants: AssistantDef[] = [
  {
    id: 'investigator',
    shortTitle: 'สืบสวน',
    title: 'Investigator AI Assistant (ผู้ช่วยงานสืบสวน)',
    desc: 'ช่วยวิเคราะห์พฤติการณ์ รวบรวมพยานหลักฐาน วางประเด็นสอบปากคำ และเตรียมคำถามสืบสวน',
    icon: '🧭',
    color: 'blue',
    badge: 'Criminal Case Protocol',
    prompts: [
      'สรุปประเด็นหลักที่ควรสอบปากคำพยานแวดล้อม',
      'จัดลำดับพยานหลักฐานทางนิติวิทยาศาสตร์ในคดีชิงทรัพย์',
      'ยกร่างแนวคำถามสอบปากคำผู้ต้องสงสัยคดีฉ้อโกง',
    ],
    sampleAnswer: `จากการวิเคราะห์พฤติการณ์คดี ขอเสนอแนวทางดำเนินการสำหรับพนักงานสอบสวนดังนี้:

1. **ประเด็นการสอบปากคำพยาน:**
   - สอบถามลำดับเวลา (Timeline) ก่อน-หลัง เกิดเหตุอย่างละเอียด
   - ตรวจสอบความสัมพันธ์ระหว่างพยาน ผู้เสียหาย และผู้ต้องสงสัย

2. **พยานหลักฐานนิติวิทยาศาสตร์ที่ควรรวบรวม:**
   - ลายนิ้วมือแฝง และคราบ DNA บริเวณจุดงัดแงะบานหน้าต่าง
   - ภาพบันทึกจากกล้องวงจรปิด (CCTV Footages) ทั้งก่อนและหลังเวลาเกิดเหตุ 1 ชั่วโมง

3. **กฎหมายที่เกี่ยวข้อง:**
   - ประมวลกฎหมายอาญา มาตรา 335 (1)(8)
   - ประมวลกฎหมายวิธีพิจารณาความอาญา มาตรา 131`,
  },
  {
    id: 'personnel',
    shortTitle: 'กำลังพล',
    title: 'Personnel / HR Assistant (ผู้ช่วยงานกำลังพล)',
    desc: 'สืบค้นระเบียบ สิทธิประโยชน์ สวัสดิการ การขอย้าย และหลักเกณฑ์แต่งตั้งเลื่อนตำแหน่ง',
    icon: '👥',
    color: 'green',
    badge: 'Police HR Regulations',
    prompts: [
      'ตรวจสอบสิทธิการลาพักผ่อนประจำปีและการลาป่วย',
      'หลักเกณฑ์การแต่งตั้งเลื่อนตำแหน่งข้าราชการตำรวจ',
      'ขั้นตอนการขอรับเงินสวัสดิการช่วยเหลือการศึกษาบุตร',
    ],
    sampleAnswer: `สรุปหลักเกณฑ์ด้านกำลังพลและสวัสดิการข้าราชการตำรวจ:

1. **สิทธิการลาประจำปี:**
   - ข้าราชการตำรวจมีสิทธิลาพักผ่อนประจำปีได้ 10 วันทำการ (สามารถสะสมได้ตามระเบียบ)
   - การลาป่วยเกิน 3 วันทำการ ต้องมีใบรับรองแพทย์จากโรงพยาบาลตำรวจ หรือสถานพยาบาลของรัฐ

2. **เกณฑ์การประเมินผลการปฏิบัติงาน:**
   - อ้างอิง ก.ตร. ว่าด้วยการประเมินผลการปฏิบัติราชการ พ.ศ. 2566
   - คะแนนการประเมินแบ่งเป็น 2 รอบต่อปีงบประมาณ`,
  },
  {
    id: 'procurement',
    shortTitle: 'พัสดุ',
    title: 'Procurement Assistant (ผู้ช่วยงานพัสดุและจัดซื้อจัดจ้าง)',
    desc: 'สืบค้นระเบียบพัสดุ TOR การกำหนดราคากลาง การตรวจรับ และการบริหารสัญญาตาม พ.ร.บ. จัดซื้อจัดจ้าง',
    icon: '📋',
    color: 'amber',
    badge: 'Procurement Act 2560',
    prompts: [
      'ยกร่างขอบเขตของงาน (TOR) สำหรับจัดซื้ออุปกรณ์คอมพิวเตอร์',
      'ขั้นตอนการกำหนดราคากลางพัสดุตามระเบียบกระทรวงการคลัง',
      'หลักเกณฑ์การตรวจรับการจัดซื้อจัดจ้างวิธีคัดเลือก',
    ],
    sampleAnswer: `สรุปขั้นตอนและข้อกำหนดตาม พ.ร.บ. การจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560:

1. **การจัดทำร่างขอบเขตของงาน (TOR):**
   - ต้องกำหนดคุณลักษณะเฉพาะที่เปิดกว้าง ไม่เป็นการล๊อคสเปก
   - มีการรับฟังความคิดเห็นจากผู้ประกอบการกรณีวงเงินเกิน 500,000 บาท

2. **แหล่งที่มาของราคากลาง:**
   - ราคาที่ได้มาจากพาณิชย์ หรือราคามาตรฐานสำนักงบประมาณ
   - สืบราคาจากผู้มีอาชีพอย่างน้อย 3 ราย`,
  },
]

export function AssistantsPage() {
  const [active, setActive] = useState<AssistantDef>(assistants[0])
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const responseTimer = useRef<number | null>(null)

  function cancelPendingResponse() {
    if (responseTimer.current !== null) {
      window.clearTimeout(responseTimer.current)
      responseTimer.current = null
    }
    setIsTyping(false)
  }

  useEffect(() => () => cancelPendingResponse(), [])

  function ask(query: string) {
    if (!query.trim() || isTyping) return
    const userMsg = { sender: 'user' as const, text: query, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    responseTimer.current = window.setTimeout(() => {
      responseTimer.current = null
      const assistantMsg = {
        sender: 'assistant' as const,
        text: active.sampleAnswer,
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, assistantMsg])
      setIsTyping(false)
    }, 1000)
  }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2500)
  }

  function clearHistory() {
    cancelPendingResponse()
    setMessages([])
  }

  return (
    <section className="assistants-page">
      <div className="page-intro">
        <div>
          <p className="section-kicker">AI WORKSPACE / SPECIALIZED POLICE ASSISTANTS</p>
          <h2>ผู้ช่วย AI งานตำรวจ</h2>
          <p>เลือกผู้ช่วยตามภารกิจ สอบถามด้วยภาษาธรรมชาติ พร้อมอ้างอิงระเบียบและแนวทางปฏิบัติงาน</p>
        </div>
        <span className="status-pill status-pill--blue">
          <ShieldCheck size={15} /> CITATION-FIRST PROTOCOL
        </span>
      </div>

      <div className="assistant-layout">
        {/* Left Sidebar Assistant Selector */}
        <aside className="assistant-list">
          <div className="sidebar-title">เลือกผู้ช่วย</div>
          {assistants.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`assistant-selector-btn ${active.id === item.id ? 'active' : ''}`}
              title={item.title}
              onClick={() => {
                cancelPendingResponse()
                setActive(item)
                setMessages([])
              }}
            >
              <span className={`assistant-icon assistant-icon--${item.color}`}>{item.icon}</span>
              <span>
                <strong>{item.shortTitle}</strong>
                <small>{item.desc}</small>
              </span>
            </button>
          ))}
        </aside>

        {/* Right Chat Panel Workspace */}
        <div className="chat-panel">
          <div className="chat-header">
            <div className="header-left">
              <span className={`assistant-icon assistant-icon--${active.color}`}>{active.icon}</span>
              <div>
                <h3>{active.title}</h3>
                <p>{active.badge} • ตอบพร้อมอ้างอิงระเบียบและข้อกฎหมาย</p>
              </div>
            </div>
            {messages.length > 0 && (
              <button type="button" className="clear-btn" onClick={clearHistory}>
                <Trash2 size={15} /> ล้างประวัติสนทนา
              </button>
            )}
          </div>

          <div className="chat-body">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <div className="empty-icon"><Bot size={36} /></div>
                <h3>เริ่มต้นสนทนากับ {active.title}</h3>
                <p>เลือกคำถามตัวอย่างเพื่อเริ่มต้นวิเคราะห์ข้อมูลอย่างรวดเร็ว:</p>
                <div className="prompt-chips">
                  {active.prompts.map((p, idx) => (
                    <button key={idx} type="button" onClick={() => ask(p)}>
                      <Sparkles size={14} /> {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`message-bubble message-bubble--${m.sender}`}>
                  <div className="bubble-header">
                    <span className="sender-tag">
                      {m.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
                      {m.sender === 'user' ? 'พนักงานสอบสวน' : active.title}
                    </span>
                    <span className="message-time">{m.time}</span>
                  </div>
                  <div className="bubble-text">{m.text}</div>

                  {m.sender === 'assistant' && (
                    <div className="bubble-actions">
                      <button
                        type="button"
                        className="copy-bubble-btn"
                        onClick={() => handleCopy(m.text, i)}
                      >
                        {copiedIdx === i ? <Check size={13} /> : <Copy size={13} />}
                        {copiedIdx === i ? 'คัดลอกแล้ว' : 'คัดลอกข้อความ'}
                      </button>
                      <div className="citation-chip">
                        <FileText size={13} /> อ้างอิงระเบียบ ตร. และประมวลกฎหมายจำลอง
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {isTyping && (
              <div className="message-bubble message-bubble--assistant typing-bubble">
                <span className="spinner" /> กำลังประมวลผลคำตอบและสืบค้นระเบียบข้อกฎหมาย...
              </div>
            )}
          </div>

          <form
            className="chat-composer"
            onSubmit={(e) => {
              e.preventDefault()
              ask(input)
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`สอบถาม ${active.title}...`}
              aria-label="คำถาม"
            />
            <button type="submit" disabled={!input.trim() || isTyping} aria-label="ส่งคำถาม">
              <Send size={16} /> ส่งคำถาม
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
