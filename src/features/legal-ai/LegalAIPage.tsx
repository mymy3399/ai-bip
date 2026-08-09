import { useState } from 'react'
import { BookOpen, Check, CheckCircle2, ChevronRight, Copy, FileText, Gavel, Loader2, Printer, Scale, Search, Sparkles, UserCheck, X } from 'lucide-react'

interface Charge {
  title: string
  law: string
  section: string
  support: string
  missing: string
  ask: string
  penalty: string
  source: string
  confidence: number
}

interface SupremeCourtPrecedent {
  caseNo: string
  year: string
  title: string
  summary: string
  similarity: number
  keyFactMatch: string
}

interface BailAssessment {
  score: number
  level: 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK'
  recommendation: string
  criteria: Array<{ factor: string; score: string; status: 'high' | 'medium' | 'low' }>
}

const scenarioPresets = [
  {
    id: 'theft-night',
    name: 'คดีลักทรัพย์ในเวลากลางคืน (Theft at Night)',
    text: 'ผู้เสียหายแจ้งว่าโทรศัพท์มือถือและกระเป๋าสตางค์หายไปจากห้องพักในเคหสถานช่วงเวลา 02.00 น. มีร่องรอยการงัดแงะบานหน้าต่าง ต่อมาสืบทราบว่าผู้ต้องสงสัยนำทรัพย์สินดังกล่าวไปจำนำที่ร้านรับจำนำในวันถัดมา',
  },
  {
    id: 'computer-fraud',
    name: 'คดีฉ้อโกงประชาชนผ่านระบบคอมพิวเตอร์ (Computer Fraud)',
    text: 'ผู้เสียหายหลายรายแจ้งว่าถูกเพจเฟซบุ๊กเปิดหลอกขายสินค้าอิเล็กทรอนิกส์ในราคาถูกกว่าท้องตลาด เมื่อโอนเงินเข้าบัญชีธนาคารแล้ว ผู้ขายบล็อกช่องทางการติดต่อและไม่ส่งมอบสินค้า รวมมูลค่าความเสียหาย 450,000 บาท',
  },
  {
    id: 'robbery-assault',
    name: 'คดีทำร้ายร่างกายชิงทรัพย์ (Robbery with Assault)',
    text: 'ผู้เสียหายเดินในซอยเปลี่ยวเวลา 23.00 น. ถูกคนร้ายสองคนใช้วัตถุคล้ายอาวุธมีดขู่บังคับให้ส่งมอบสร้อยคอทองคำ และมีการใช้อัปยศทำร้ายร่างกายจนเป็นเหตุให้ได้รับบาดเจ็บ มีบาดแผลตามร่างกาย',
  },
]

const chargesDatabase: Charge[] = [
  {
    title: 'ลักทรัพย์ในเวลากลางคืน / ในเคหสถาน',
    law: 'ประมวลกฎหมายอาญา มาตรา 335 (1)(8)',
    section: 'มาตรา 335',
    support: 'มีการนำทรัพย์ของผู้อื่นไปโดยทุจริต เหตุเกิดในเวลากลางคืน และเกิดในเคหสถานที่มีร่องรอยการงัดแงะ',
    missing: 'พยานยืนยันตัวบุคคลขณะเข้ากระทำผิดในสถานที่เกิดเหตุ',
    ask: 'สอบถามกล้องวงจรปิดบริเวณใกล้เคียง และตรวจสอบลายนิ้วมือแฝงที่บานหน้าต่าง',
    penalty: 'จำคุกตั้งแต่ 1 ปี ถึง 5 ปี และปรับตั้งแต่ 20,000 บาท ถึง 100,000 บาท',
    source: 'ประมวลกฎหมายอาญา มาตรา 335 (แก้ไขเพิ่มเติม พ.ศ. 2560)',
    confidence: 94,
  },
  {
    title: 'ฉ้อโกงประชาชน / ความผิดตาม พ.ร.บ.คอมพิวเตอร์',
    law: 'ประมวลกฎหมายอาญา มาตรา 343 ประกอบ พ.ร.บ.คอมพิวเตอร์ฯ มาตรา 14 (1)',
    section: 'มาตรา 343 / พ.ร.บ.คอมฯ',
    support: 'มีการแสดงข้อความอันเป็นเท็จต่อประชาชนทั่วไปผ่านเพจโซเชียลมีเดีย มีผู้เสียหายหลายรายโอนเงินเข้าบัญชี',
    missing: 'เส้นทางการเงิน (Money Trail) จากบัญชีม้าไปยังผู้รับผลประโยชน์แท้จริง',
    ask: 'ขอข้อมูล IP Address, Log File จากผู้ให้บริการ และอายัดบัญชีธนาคารปลายทาง',
    penalty: 'จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ',
    source: 'พ.ร.บ.ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ พ.ศ. 2560',
    confidence: 89,
  },
  {
    title: 'ชิงทรัพย์โดยใช้อาวุธหรือโดยร่วมกันกระทำผิด',
    law: 'ประมวลกฎหมายอาญา มาตรา 339 ประกอบมาตรา 340 ตรี',
    section: 'มาตรา 339',
    support: 'มีการใช้กำลังทำร้ายร่างกายหรือขู่บังคับเพื่อเอาทรัพย์สินไปในทันที และมีผู้ร่วมกระทำความผิดตั้งแต่ 2 คนขึ้นไป',
    missing: 'วัตถุพยานอาวุธมีดที่ใช้ในการก่อเหตุ',
    ask: 'ตรวจชันสูตรบาดแผลจากแพทย์ (ใบรับรองแพทย์) และผลตรวจดีเอ็นเอผู้เสียหาย',
    penalty: 'จำคุกตั้งแต่ 10 ปี ถึง 15 ปี และปรับตั้งแต่ 200,000 บาท ถึง 300,000 บาท',
    source: 'ประมวลกฎหมายอาญา มาตรา 339 ภาค 2 ความผิดเกี่ยวกับทรัพย์',
    confidence: 91,
  },
  {
    title: 'รับของโจร',
    law: 'ประมวลกฎหมายอาญา มาตรา 357',
    section: 'มาตรา 357',
    support: 'พบการครอบครอง รับ หรือช่วยจำหน่ายทรัพย์สินซึ่งได้มาจากความผิดเกี่ยวกับทรัพย์',
    missing: 'หลักฐานยืนยันเจตนารู้หรือควรรู้ว่าทรัพย์นั้นได้มาจากการกระทำความผิด',
    ask: 'สอบถามราคาที่รับซื้อ แหล่งที่มา และหนังสือรับรองการค้าของเก่า (ถ้ามี)',
    penalty: 'จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ',
    source: 'ประมวลกฎหมายอาญา มาตรา 357',
    confidence: 76,
  },
]

const mockPrecedents: SupremeCourtPrecedent[] = [
  {
    caseNo: 'ฎีกาที่ 1245/2565',
    year: '2565',
    title: 'การลักทรัพย์ในเวลากลางคืนและงัดแงะประตูเคหสถาน',
    summary: 'จำเลยเข้าไปในบ้านพักของผู้เสียหายในเวลา 01.30 น. โดยถอดกระจกบานเกล็ด แล้วลักเอากระเป๋าสตางค์ แม้ผู้เสียหายไม่เห็นขณะลัก แต่พบของกลางในครอบครองจำเลยในวันถัดมา ถือเป็นความผิดสำเร็จตามมาตรา 335 (1)(8)',
    similarity: 96,
    keyFactMatch: 'ตรงกับพฤติการณ์: งัดแงะเข้าเคหสถานกลางคืน + พบของกลางในครอบครองวันถัดมา',
  },
  {
    caseNo: 'ฎีกาที่ 4890/2563',
    year: '2563',
    title: 'ข้อแตกต่างระหว่างลักทรัพย์กับรับของโจร',
    summary: 'หากพยานหลักฐานฟังไม่ได้ว่าจำเลยเป็นผู้เข้าไปลักทรัพย์ในเคหสถาน แต่รับซื้อของกลางไว้ในราคาต่ำกว่าท้องตลาดอย่างมาก ย่อมมีความผิดฐานรับของโจรตามมาตรา 357',
    similarity: 88,
    keyFactMatch: 'พฤติการณ์เทียบเคียง: การนำทรัพย์สินไปจำนำหรือขายต่อร้านค้า',
  },
  {
    caseNo: 'ฎีกาที่ 8892/2561',
    year: '2561',
    title: 'องค์ประกอบความผิดฐานชิงทรัพย์และการใช้อาวุธบังคับ',
    summary: 'การใช้อาวุธขู่บังคับให้ส่งทรัพย์สินในทันที แม้ไม่มีบาดแผลสาหัส ก็เป็นความผิดฐานชิงทรัพย์ตามมาตรา 339',
    similarity: 82,
    keyFactMatch: 'พฤติการณ์เทียบเคียง: ข่มขู่เอาทรัพย์ในทันทีในที่เปลี่ยว',
  },
]

const scenarioPrecedents: Record<string, SupremeCourtPrecedent[]> = {
  'theft-night': [mockPrecedents[0], mockPrecedents[1]],
  'computer-fraud': [
    {
      caseNo: 'ฎีกาที่ 1085/2564',
      year: '2564',
      title: 'การหลอกลวงประชาชนผ่านสื่ออิเล็กทรอนิกส์',
      summary: 'การเผยแพร่ข้อความอันเป็นเท็จต่อบุคคลทั่วไปเพื่อให้โอนเงินเข้าบัญชี และมีผู้เสียหายหลายราย เป็นพฤติการณ์ที่อาจเข้าองค์ประกอบฉ้อโกงประชาชนเมื่อพิสูจน์เจตนาและเส้นทางเงินได้',
      similarity: 93,
      keyFactMatch: 'ตรงกับพฤติการณ์: เพจสาธารณะ + ผู้เสียหายหลายราย + โอนเงินแล้วไม่ส่งสินค้า',
    },
    {
      caseNo: 'ฎีกาที่ 4421/2562',
      year: '2562',
      title: 'พยานหลักฐานดิจิทัลและเส้นทางการเงินในคดีฉ้อโกง',
      summary: 'ข้อมูลการสนทนา บันทึกการโอนเงิน และข้อมูลผู้ใช้งานระบบต้องตรวจสอบที่มาและความต่อเนื่อง เพื่อยืนยันว่าผู้ต้องหาเป็นผู้ควบคุมบัญชีหรือระบบที่ใช้ก่อเหตุ',
      similarity: 86,
      keyFactMatch: 'ประเด็นเทียบเคียง: ต้องยืนยัน IP, บัญชีรับโอน และผู้ได้รับประโยชน์แท้จริง',
    },
  ],
  'robbery-assault': [mockPrecedents[2]],
}

const scenarioBailAssessments: Record<string, BailAssessment> = {
  'theft-night': {
    score: 78,
    level: 'HIGH RISK',
    recommendation: 'ควรพิจารณาคัดค้านหรือกำหนดเงื่อนไขเข้ม เนื่องจากเป็นคดีเหตุฉกรรจ์ เกิดในเคหสถาน และยังต้องคุ้มครองพยานหลักฐานในที่เกิดเหตุ',
    criteria: [
      { factor: '1. ความหนักเบาแห่งข้อหาและอัตราโทษ', score: 'สูง (จำคุก 1-5 ปี)', status: 'high' },
      { factor: '2. พยานหลักฐานความเชื่อมโยงผู้ต้องหา', score: 'พบทรัพย์ในครอบครอง', status: 'high' },
      { factor: '3. โอกาสหลบหนีหรือยุ่งเหยิงกับพยาน', score: 'ต้องติดตามที่อยู่และของกลาง', status: 'medium' },
      { factor: '4. ภัยต่อผู้เสียหายและสถานที่เกิดเหตุ', score: 'มีความเสี่ยงต่อพยานหลักฐาน', status: 'high' },
      { factor: '5. ประวัติการประกันตัว', score: 'รอตรวจสอบประวัติ', status: 'low' },
    ],
  },
  'computer-fraud': {
    score: 64,
    level: 'MEDIUM RISK',
    recommendation: 'ควรกำหนดเงื่อนไขห้ามติดต่อผู้เสียหายและห้ามยุ่งเหยิงกับบัญชีหรือข้อมูลดิจิทัล พร้อมติดตามเส้นทางเงินก่อนพิจารณาเพิ่มเติม',
    criteria: [
      { factor: '1. ความหนักเบาแห่งข้อหาและความเสียหาย', score: 'ปานกลางถึงสูง (เสียหายหลายราย)', status: 'medium' },
      { factor: '2. พยานหลักฐานดิจิทัล', score: 'พบเพจและบัญชีรับโอน', status: 'medium' },
      { factor: '3. โอกาสหลบหนี', score: 'ต้องตรวจสอบที่อยู่และทรัพย์สิน', status: 'medium' },
      { factor: '4. โอกาสยุ่งเหยิงกับพยานหลักฐาน', score: 'เสี่ยงลบข้อมูลหรือย้ายเงิน', status: 'high' },
      { factor: '5. ประวัติการประกันตัว', score: 'รอตรวจสอบประวัติ', status: 'low' },
    ],
  },
  'robbery-assault': {
    score: 86,
    level: 'HIGH RISK',
    recommendation: 'ควรพิจารณาคัดค้านการประกันตัวหรือกำหนดหลักประกันและเงื่อนไขเข้ม เนื่องจากมีการใช้อาวุธ ร่วมกันก่อเหตุ และมีผู้เสียหายได้รับบาดเจ็บ',
    criteria: [
      { factor: '1. ความหนักเบาแห่งข้อหาและอัตราโทษ', score: 'สูง (มีอาวุธและร่วมกันก่อเหตุ)', status: 'high' },
      { factor: '2. พยานหลักฐานความเชื่อมโยงผู้ต้องหา', score: 'มีคำให้การและบาดแผลผู้เสียหาย', status: 'high' },
      { factor: '3. โอกาสหลบหนี', score: 'มีเหตุให้ติดตามผู้ร่วมกระทำผิด', status: 'medium' },
      { factor: '4. ภัยต่อผู้เสียหายและพยาน', score: 'เสี่ยงข่มขู่หรือแก้แค้น', status: 'high' },
      { factor: '5. ประวัติการประกันตัว', score: 'รอตรวจสอบประวัติ', status: 'low' },
    ],
  },
}

interface FactMatrixItem {
  label: string
  status: string
  state: 'match' | 'pending'
}

const scenarioFactMatrices: Record<string, FactMatrixItem[]> = {
  'theft-night': [
    { label: 'ทรัพย์ของผู้อื่นถูกนำไป', status: 'พบข้อมูลในพฤติการณ์', state: 'match' },
    { label: 'เกิดในเวลากลางคืน', status: 'ระบุเวลา 02.00 น. ชัดเจน', state: 'match' },
    { label: 'เกิดในเคหสถานและมีร่องรอยงัดแงะ', status: 'สอดคล้องกับข้อเท็จจริง', state: 'match' },
    { label: 'พยานยืนยันตัวบุคคล', status: 'ควรสอบสวนเพิ่ม', state: 'pending' },
  ],
  'computer-fraud': [
    { label: 'แสดงข้อความอันเป็นเท็จต่อประชาชน', status: 'พบข้อมูลในพฤติการณ์', state: 'match' },
    { label: 'มีผู้เสียหายหลายราย', status: 'สอดคล้องกับข้อเท็จจริง', state: 'match' },
    { label: 'มีเส้นทางการโอนเงิน', status: 'ระบุความเสียหาย 450,000 บาท', state: 'match' },
    { label: 'IP Address / Log File / ผู้รับผลประโยชน์', status: 'ต้องขอข้อมูลเพิ่มเติม', state: 'pending' },
  ],
  'robbery-assault': [
    { label: 'ใช้กำลังหรือขู่เข็ญเอาทรัพย์ทันที', status: 'พบข้อมูลในพฤติการณ์', state: 'match' },
    { label: 'มีผู้ร่วมกระทำผิดตั้งแต่ 2 คน', status: 'ระบุผู้ก่อเหตุ 2 คน', state: 'match' },
    { label: 'มีอาวุธและผู้เสียหายได้รับบาดเจ็บ', status: 'สอดคล้องกับข้อเท็จจริง', state: 'match' },
    { label: 'วัตถุพยานอาวุธและผลแพทย์', status: 'ต้องตรวจสอบเพิ่มเติม', state: 'pending' },
  ],
}

const statuteLibrary = [
  { section: 'มาตรา 288', category: 'ความผิดต่อชีวิต', title: 'ฆ่าผู้อื่น', penalty: 'ประหารชีวิต จำคุกตลอดชีวิต หรือจำคุกตั้งแต่ 15 ปี ถึง 20 ปี', details: 'ผู้ใดฆ่าผู้อื่น ต้องระวางโทษประหารชีวิต จำคุกตลอดชีวิต หรือจำคุกตั้งแต่สิบห้าปีถึงยี่สิบปี' },
  { section: 'มาตรา 334', category: 'ความผิดเกี่ยวกับทรัพย์', title: 'ลักทรัพย์', penalty: 'จำคุกไม่เกิน 3 ปี และปรับไม่เกิน 60,000 บาท', details: 'ผู้ใดเอาทรัพย์ของผู้อื่น หรือที่ผู้อื่นเป็นเจ้าของรวมอยู่ด้วยไปโดยทุจริต ผู้นั้นกระทำความผิดฐานลักทรัพย์' },
  { section: 'มาตรา 335', category: 'ความผิดเกี่ยวกับทรัพย์', title: 'ลักทรัพย์เหตุฉกรรจ์ (กลางคืน/เคหสถาน)', penalty: 'จำคุกตั้งแต่ 1 ปี ถึง 5 ปี และปรับตั้งแต่ 20,000 ถึง 100,000 บาท', details: 'ผู้ใดลักทรัพย์ในเวลากลางคืน หรือในเคหสถาน สถานที่ราชการ หรือโดยงัดแงะทำลายสิ่งกีดกั้น' },
  { section: 'มาตรา 341', category: 'ความผิดเกี่ยวกับทรัพย์', title: 'ฉ้อโกง', penalty: 'จำคุกไม่เกิน 3 ปี หรือปรับไม่เกิน 60,000 บาท', details: 'ผู้ใดทุจริต หลอกลวงผู้อื่นด้วยการแสดงข้อความอันเป็นเท็จ หรือปกปิดข้อความจริงซึ่งควรบอกให้แจ้ง' },
  { section: 'มาตรา 352', category: 'ความผิดเกี่ยวกับทรัพย์', title: 'ยักยอกทรัพย์', penalty: 'จำคุกไม่เกิน 3 ปี หรือปรับไม่เกิน 60,000 บาท', details: 'ผู้ใดครอบครองทรัพย์ซึ่งเป็นของผู้อื่น แล้วเบียดบังเอาทรัพย์นั้นเป็นของตนหรือบุคคลที่สามโดยทุจริต' },
  { section: 'มาตรา 339', category: 'ความผิดเกี่ยวกับทรัพย์', title: 'ชิงทรัพย์', penalty: 'จำคุกตั้งแต่ 5 ปี ถึง 10 ปี และปรับตั้งแต่ 100,000 ถึง 200,000 บาท', details: 'ผู้ใดลักทรัพย์โดยใช้กำลังประทุษร้าย หรือขู่เข็ญว่าจะใช้กำลังประทุษร้ายในทันใดนั้น เพื่อให้ความสะดวกแก่การลักทรัพย์' },
  { section: 'มาตรา 343', category: 'ความผิดเกี่ยวกับทรัพย์', title: 'ฉ้อโกงประชาชน', penalty: 'จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ', details: 'ผู้ใดกระทำความผิดฐานฉ้อโกงโดยแสดงข้อความอันเป็นเท็จต่อประชาชน หรือปกปิดข้อความจริงซึ่งควรบอกให้แจ้งแก่ประชาชน' },
]

const relatedStatuteSections: Record<string, string[]> = {
  'theft-night': ['มาตรา 335', 'มาตรา 334', 'มาตรา 357'],
  'computer-fraud': ['มาตรา 343', 'มาตรา 341'],
  'robbery-assault': ['มาตรา 339', 'มาตรา 340'],
}

function getScenarioCharges(scenarioId: string): Charge[] {
  if (scenarioId === 'theft-night') return [chargesDatabase[0], chargesDatabase[3]]
  if (scenarioId === 'computer-fraud') return [chargesDatabase[1]]
  if (scenarioId === 'robbery-assault') return [chargesDatabase[2]]
  return []
}

function getScenarioFactMatrix(scenarioId: string): FactMatrixItem[] {
  if (scenarioId === 'theft-night') return scenarioFactMatrices['theft-night']
  if (scenarioId === 'computer-fraud') return scenarioFactMatrices['computer-fraud']
  if (scenarioId === 'robbery-assault') return scenarioFactMatrices['robbery-assault']
  return []
}

function getScenarioPrecedents(scenarioId: string): SupremeCourtPrecedent[] {
  if (scenarioId === 'theft-night') return scenarioPrecedents['theft-night']
  if (scenarioId === 'computer-fraud') return scenarioPrecedents['computer-fraud']
  if (scenarioId === 'robbery-assault') return scenarioPrecedents['robbery-assault']
  return mockPrecedents
}

function getScenarioBail(scenarioId: string): BailAssessment {
  if (scenarioId === 'computer-fraud') return scenarioBailAssessments['computer-fraud']
  if (scenarioId === 'robbery-assault') return scenarioBailAssessments['robbery-assault']
  return scenarioBailAssessments['theft-night']
}

function getRelatedSections(scenarioId: string): string[] {
  if (scenarioId === 'theft-night') return relatedStatuteSections['theft-night']
  if (scenarioId === 'computer-fraud') return relatedStatuteSections['computer-fraud']
  if (scenarioId === 'robbery-assault') return relatedStatuteSections['robbery-assault']
  return []
}

export function LegalAIPage() {
  const [activeSubTab, setActiveSubTab] = useState<'analyzer' | 'precedents' | 'bail_risk' | 'library'>('analyzer')
  const [facts, setFacts] = useState(scenarioPresets[0].text)
  const [selectedScenarioId, setSelectedScenarioId] = useState(scenarioPresets[0].id)
  const [activeChargeIdx, setActiveChargeIdx] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(true)
  const [showMemoModal, setShowMemoModal] = useState(false)
  const [memoType, setMemoType] = useState<'memo' | 'warrant_request' | 'indictment'>('memo')
  const [copied, setCopied] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')

  const currentCharges = getScenarioCharges(selectedScenarioId)
  const currentFactMatrix = getScenarioFactMatrix(selectedScenarioId)
  const activePrecedents = getScenarioPrecedents(selectedScenarioId)
  const activeBail = getScenarioBail(selectedScenarioId)
  const activeScenario = scenarioPresets.find((scenario) => scenario.id === selectedScenarioId) ?? scenarioPresets[0]
  const relatedSections = getRelatedSections(selectedScenarioId)
  const activeCharge = currentCharges.at(activeChargeIdx) ?? currentCharges.at(0) ?? chargesDatabase[0]

  function applyPreset(presetText: string, scenarioId: string) {
    setFacts(presetText)
    setSelectedScenarioId(scenarioId)
    setActiveChargeIdx(0)
    setHasAnalyzed(false)
  }

  function handleAnalyzeFacts() {
    if (isAnalyzing || !facts.trim()) return
    setIsAnalyzing(true)
    setHasAnalyzed(false)
    setActiveChargeIdx(0)
    window.setTimeout(() => {
      setIsAnalyzing(false)
      setHasAnalyzed(true)
    }, 1800)
  }

  function handleCopyMemo() {
    const memoText = `คำร้อง/สำนวนการวิเคราะห์ทางกฎหมาย (AI-BIP Legal Document)
--------------------------------------------------
ประเภทเอกสาร: ${memoType === 'memo' ? 'บันทึกข้อความสรุปคดี' : memoType === 'warrant_request' ? 'คำร้องขอออกหมายจับ' : 'ร่างสำนวนฟ้อง'}
พฤติการณ์คดี:
${facts}

ฐานความผิด (Candidate Charge):
- ${activeCharge.title}
- บทกฎหมาย: ${activeCharge.law}
- อัตราโทษ: ${activeCharge.penalty}

ข้อเท็จจริงสนับสนุน: ${activeCharge.support}
ประเด็นที่ต้องสอบสวนเพิ่มเติม: ${activeCharge.ask}
อ้างอิง: ${activeCharge.source}`

    navigator.clipboard.writeText(memoText).catch(() => undefined)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const orderedStatutes = [...statuteLibrary].sort((a, b) => {
    const aIndex = relatedSections.indexOf(a.section)
    const bIndex = relatedSections.indexOf(b.section)
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
  })

  const filteredStatutes = orderedStatutes.filter(
    (item) =>
      item.section.includes(searchFilter) ||
      item.title.includes(searchFilter) ||
      item.category.includes(searchFilter)
  )

  return (
    <section className="legal-page">
      <div className="page-intro">
        <div>
          <p className="section-kicker">งานสอบสวน / LEGAL REASONING & CHARGE ANALYSIS</p>
          <h2>Legal AI Assistant</h2>
          <p>ระบบสกัดพฤติการณ์คดี เสนอแนวทางสืบสวน ค้นหาแนวคำพิพากษาศาลฎีกา และจัดทำแบบประเมินความเสี่ยงการประกันตัว</p>
        </div>
        <span className="status-pill status-pill--blue">
          <Sparkles size={15} /> THAI PENAL CODE DB ACTIVE
        </span>
      </div>

      <div className="legal-disclaimer">
        <BookOpen size={18} />
        <span>
          <strong>ข้อสังเกตสำหรับพนักงานสอบสวน:</strong> ข้อเสนอจาก AI ใช้เพื่อสนับสนุนการวิเคราะห์และตรวจสอบประเด็น พนักงานสอบสวนต้องใช้วิจารณญาณทางกฎหมายประกอบการสั่งคดีเสมอ
        </span>
      </div>

      {/* Main Sub Navigation Tabs */}
      <div className="legal-tabs">
        <button
          type="button"
          className={`legal-tab ${activeSubTab === 'analyzer' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('analyzer')}
          aria-label="วิเคราะห์พฤติการณ์และฐานความผิด (Fact Analyzer)"
        >
          <Scale size={16} /> <span className="legal-tab-copy"><strong>วิเคราะห์คดี</strong><small>Fact Analyzer</small></span>
        </button>

        <button
          type="button"
          className={`legal-tab ${activeSubTab === 'precedents' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('precedents')}
          aria-label="คลังแนวคำพิพากษาศาลฎีกา (Supreme Court Precedents)"
        >
          <Gavel size={16} /> <span className="legal-tab-copy"><strong>แนวคำพิพากษา</strong><small>Supreme Court</small></span>
        </button>

        <button
          type="button"
          className={`legal-tab ${activeSubTab === 'bail_risk' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('bail_risk')}
          aria-label="ประเมินความเสี่ยงการประกันตัว (Bail Risk Assessment)"
        >
          <UserCheck size={16} /> <span className="legal-tab-copy"><strong>ประเมินประกันตัว</strong><small>Bail Risk</small></span>
        </button>

        <button
          type="button"
          className={`legal-tab ${activeSubTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('library')}
          aria-label="คลังประมวลกฎหมายอาญา (Statute Reference)"
        >
          <BookOpen size={16} /> <span className="legal-tab-copy"><strong>คลังกฎหมายอาญา</strong><small>Statute Reference</small></span>
        </button>
      </div>

      {/* SUB TAB 1: FACT ANALYZER */}
      {activeSubTab === 'analyzer' && (
        <>
          <div className="legal-layout">
            {/* Left Input Box & Presets */}
            <div className="legal-input-card">
              <div className="panel-heading">
                <div>
                  <h3>01. ป้อนพฤติการณ์คดี</h3>
                  <p>พิมพ์ภาษาธรรมชาติหรือเลือกตัวอย่างพฤติการณ์คดี</p>
                </div>
                <span className="step-label">FACT INPUT</span>
              </div>

              <div className="preset-row">
                <label className="input-label">ตัวอย่างพฤติการณ์คดี (Presets):</label>
                <div className="preset-chips">
                  {scenarioPresets.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="preset-chip"
                      onClick={() => applyPreset(p.text, p.id)}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={facts}
                onChange={(event) => setFacts(event.target.value)}
                rows={8}
                aria-label="พฤติการณ์คดี"
                placeholder="อธิบายพฤติการณ์คดี เวลา สถานที่ การกระทำของผู้ต้องสงสัย และความเสียหาย..."
              />

              <div className="fact-analyzer-action">
                <button type="button" className="primary-button analyze-facts-button" onClick={handleAnalyzeFacts} disabled={isAnalyzing || !facts.trim()}>
                  {isAnalyzing ? <Loader2 size={18} className="spin-icon" /> : <Search size={18} />}
                  {isAnalyzing ? 'กำลังค้นและวิเคราะห์องค์ประกอบความผิด...' : 'วิเคราะห์พฤติการณ์คดี'}
                </button>
                {isAnalyzing && (
                  <div className="analysis-progress" role="status" aria-live="polite">
                    <span className="analysis-progress-track"><span /></span>
                    <small>กำลังเทียบข้อเท็จจริงกับฐานความผิดและคลังแนวคำพิพากษา</small>
                  </div>
                )}
              </div>

              <div className="fact-matrix">
                <h4>องค์ประกอบความผิดที่ตรวจพบ (Fact Matrix)</h4>
                {!hasAnalyzed && !isAnalyzing ? (
                  <div className="fact-matrix-placeholder"><Search size={18} /><span>กด “วิเคราะห์พฤติการณ์คดี” เพื่อสร้าง Fact Matrix ตามคดีที่เลือก</span></div>
                ) : isAnalyzing ? (
                  <div className="fact-matrix-placeholder is-loading"><Loader2 size={18} className="spin-icon" /><span>กำลังสกัดองค์ประกอบความผิด...</span></div>
                ) : currentFactMatrix.map((item) => (
                  <div key={item.label} className="fact-row">
                    <CheckCircle2 size={16} className="fact-check" />
                    <span className="fact-label">{item.label}</span>
                    <strong className={`fact-status ${item.state}`}>{item.status}</strong>
                  </div>
                ))}
              </div>

              <div className="memo-action-buttons">
                <button
                  type="button"
                  className="primary-button primary-button--wide"
                  onClick={() => {
                    setMemoType('memo')
                    setShowMemoModal(true)
                  }}
                >
                  <FileText size={17} /> ร่างบันทึกข้อความสรุปคดี
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setMemoType('warrant_request')
                    setShowMemoModal(true)
                  }}
                >
                  <Gavel size={16} /> ร่างคำร้องขอออกหมายจับ
                </button>
              </div>
            </div>

            {/* Right Candidate Charges Result */}
            <div className="charges-card">
              <div className="charges-heading">
                <div>
                  <span className="eyebrow">TOP-N CHARGE RANKING</span>
                  <h3>Candidate Charges</h3>
                </div>
                <span className="count-badge">{currentCharges.length} candidates</span>
              </div>

              <div className="charge-tabs">
                {!hasAnalyzed && !isAnalyzing ? (
                  <div className="charge-empty-state"><Search size={20} /><span>ผลวิเคราะห์จะแสดงที่นี่หลังจากกดปุ่มวิเคราะห์</span></div>
                ) : isAnalyzing ? (
                  <div className="charge-empty-state is-loading"><Loader2 size={20} className="spin-icon" /><span>กำลังจัดอันดับฐานความผิด...</span></div>
                ) : currentCharges.map((item, index) => (
                  <button
                    key={item.title}
                    className={`charge-tab-btn ${activeChargeIdx === index ? 'active' : ''}`}
                    onClick={() => setActiveChargeIdx(index)}
                  >
                    <span className="charge-rank-num">#{index + 1}</span>
                    <span className="charge-title-text">{item.title}</span>
                    <span className="confidence-pill">{item.confidence}% MATCH</span>
                    <ChevronRight size={15} />
                  </button>
                ))}
              </div>

              {hasAnalyzed && !isAnalyzing && <div className="charge-detail">
                <div className="charge-header">
                  <h3>{activeCharge.title}</h3>
                  <span className="law-badge">{activeCharge.law}</span>
                </div>

                <div className="charge-section">
                  <h4>ข้อเท็จจริงที่สนับสนุน</h4>
                  <p>{activeCharge.support}</p>
                </div>

                <div className="charge-section">
                  <h4>ข้อเท็จจริงที่ยังขาด</h4>
                  <p>{activeCharge.missing}</p>
                </div>

                <div className="charge-section">
                  <h4>ประเด็นที่ควรสอบเพิ่ม</h4>
                  <p>{activeCharge.ask}</p>
                </div>

                <div className="penalty-box">
                  <span>อัตราโทษตามบทบัญญัติกฎหมาย:</span>
                  <strong>{activeCharge.penalty}</strong>
                </div>

                <div className="citation-row">
                  <FileText size={16} />
                  <span>
                    {activeCharge.source}
                    <small>อ้างอิงประมวลกฎหมายอาญาฉบับใช้บังคับ</small>
                  </span>
                  <a
                    href="https://www.ratchakitcha.soc.go.th/DATA/PDF/2560/A/032/51.PDF"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="ราชกิจจานุเบกษา"
                  >
                    เปิด citation (ราชกิจจานุเบกษา)
                  </a>
                </div>
              </div>}
            </div>
          </div>

          {/* Report Generator Modal */}
          {showMemoModal && (
            <div className="modal-backdrop">
              <div className="memo-modal">
                <div className="modal-header">
                  <h3>
                    <FileText size={18} />
                    {memoType === 'memo' ? 'บันทึกข้อความสรุปคดีและข้อกฎหมาย' : memoType === 'warrant_request' ? 'คำร้องขออนุมัติออกหมายจับ (ศาลอาญา)' : 'ร่างสำนวนการสอบสวนและข้อหาร้องฟ้อง'}
                  </h3>
                  <button type="button" className="close-btn" onClick={() => setShowMemoModal(false)}>
                    <X size={18} />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="memo-document">
                    <div className="memo-title">
                      {memoType === 'memo' ? 'บันทึกข้อความสรุปพฤติการณ์และข้อกฎหมาย' : memoType === 'warrant_request' ? 'คำร้องขออนุมัติออกหมายจับต่อศาล' : 'ร่างเอกสารสำนวนสอบสวนและแจ้งข้อกล่าวหา'}
                    </div>
                    <div className="memo-meta">
                      <span>สถานีตำรวจจำลอง • โครงการ AI-BIP</span>
                      <span>วันที่: {new Date().toLocaleDateString('th-TH')}</span>
                    </div>
                    <hr />
                    <div className="memo-section">
                      <strong>1. พฤติการณ์แห่งคดีโดยสรุป:</strong>
                      <p>{facts}</p>
                    </div>
                    <div className="memo-section">
                      <strong>2. การวิเคราะห์ฐานความผิดและบทกฎหมาย:</strong>
                      <p>ฐานความผิดหลัก: {activeCharge.title}</p>
                      <p>บทมาตรา: {activeCharge.law}</p>
                      <p>อัตราโทษสูงสุด: {activeCharge.penalty}</p>
                    </div>
                    <div className="memo-section">
                      <strong>3. เหตุแห่งการออกหมายจับ / ประเด็นหลักฐานเพิ่มเติม:</strong>
                      <p>{activeCharge.ask}</p>
                      <p>เหตุตาม ป.วิ.อาญา มาตรา 66: มีเหตุอันควรเชื่อว่าจะหลบหนี หรือไปยุ่งเหยิงกับพยานหลักฐาน</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="secondary-button" onClick={handleCopyMemo}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'คัดลอกข้อความแล้ว!' : 'คัดลอกข้อความ (Copy)'}
                  </button>
                  <button type="button" className="primary-button" onClick={() => window.print()}>
                    <Printer size={16} /> พิมพ์เอกสารฉบับทางการ (PDF Print)
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* SUB TAB 2: SUPREME COURT PRECEDENTS */}
      {activeSubTab === 'precedents' && (
        <div className="precedents-section">
          <div className="precedents-header">
            <h3><Gavel size={20} /> แนวคำพิพากษาศาลฎีกาที่เทียบเคียงพฤติการณ์คดี</h3>
            <p>วิเคราะห์ข้อเท็จจริงในคดีเปรียบเทียบกับคำพิพากษาศาลฎีกาในอดีตด้วย AI Semantic Search</p>
          </div>

          <div className="precedents-grid">
            {activePrecedents.map((precedent) => (
              <div key={precedent.caseNo} className="precedent-card">
                <div className="precedent-top-bar">
                  <span className="case-no-pill">{precedent.caseNo}</span>
                  <span className="similarity-badge">{precedent.similarity}% SIMILARITY</span>
                </div>
                <h4>{precedent.title}</h4>
                <p className="precedent-summary">{precedent.summary}</p>
                <div className="fact-match-box">
                  <CheckCircle2 size={15} className="match-icon" />
                  <span>{precedent.keyFactMatch}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: BAIL RISK ASSESSMENT MATRIX */}
      {activeSubTab === 'bail_risk' && (
        <div className="bail-risk-section">
          <div className="bail-risk-header">
            <h3><UserCheck size={20} /> แบบประเมินความเสี่ยงในการพิจารณาให้ประกันตัว (Bail Risk Scoring Matrix)</h3>
            <p>คำนวณระดับความเสี่ยงการหลบหนีหรือไปยุ่งเหยิงกับพยานหลักฐานตาม ป.วิ.อาญา มาตรา 108/1</p>
          </div>

          <div className="bail-score-container">
            {/* Risk Gauge Box */}
            <div className="risk-gauge-box">
              <span className="gauge-title">ระดับความเสี่ยงการหลบหนี (Flight Risk Score)</span>
              <div className={`score-number-display ${activeBail.level === 'HIGH RISK' ? 'danger' : 'amber'}`}>{activeBail.score} / 100</div>
              <span className={`risk-level-tag ${activeBail.level === 'HIGH RISK' ? 'danger' : 'amber'}`}>
                {activeBail.level === 'HIGH RISK' ? '🔴' : '🟠'} {activeBail.level} (ความเสี่ยง{activeBail.level === 'HIGH RISK' ? 'สูง' : 'ปานกลาง'})
              </span>
              <p className="risk-recommendation">
                <strong>ความเห็นประกอบการพิจารณา:</strong> {activeBail.recommendation}
              </p>
            </div>

            {/* Risk Criteria Checklist */}
            <div className="risk-criteria-card">
              <h4>เกณฑ์การประเมินความเสี่ยง 5 ด้าน (5-Factor Assessment)</h4>
              <div className="criteria-list">
                {activeBail.criteria.map((crit) => (
                  <div key={crit.factor} className="criteria-row">
                    <span className="factor-name">{crit.factor}</span>
                    <span className={`factor-score ${crit.status}`}>{crit.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 4: STATUTE LIBRARY */}
      {activeSubTab === 'library' && (
        <div className="statute-library-section">
          <div className="library-case-context">
            <BookOpen size={17} />
            <span>มาตราที่เกี่ยวข้องกับคดี: <strong>{activeScenario.name}</strong></span>
            <small>รายการที่เกี่ยวข้องจะแสดงก่อน แต่ยังค้นหากฎหมายทั้งหมดได้</small>
          </div>
          <div className="library-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="ค้นหามาตรา, ชื่อฐานความผิด หรือหมวดหมู่อย่างรวดเร็ว..."
              />
            </div>
            <span className="library-count">พบ {filteredStatutes.length} รายการ</span>
          </div>

          <div className="statute-grid">
            {filteredStatutes.map((st) => (
              <div key={st.section} className="statute-card">
                <div className="statute-header">
                  <span className="section-pill">{st.section}</span>
                  <span className="category-pill">{st.category}</span>
                </div>
                <h4>{st.title}</h4>
                <p className="statute-details">{st.details}</p>
                <div className="statute-penalty">
                  <small>อัตราโทษ:</small>
                  <strong>{st.penalty}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
