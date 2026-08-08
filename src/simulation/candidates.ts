import type { Candidate } from './types'
import candidate1 from '../assets/candidate-1.png'
import candidate2 from '../assets/candidate-2.png'
import candidate3 from '../assets/candidate-3.png'

const sharedSources = [
  { label: 'ชื่อสอดคล้อง', state: 'match' as const, detail: 'ชื่อจาก input ตรงกับรายการจำลอง' },
  { label: 'เลขประจำตัวสอดคล้อง', state: 'possible' as const, detail: 'พบข้อมูลในรูปแบบข้อมูลสมมติ' },
  { label: 'ใบหน้ามีความคล้ายสูง', state: 'match' as const, detail: 'ค่าความคล้ายใช้เพื่อจัดลำดับ Candidate' },
]

export const candidates: Candidate[] = [
  {
    id: 'candidate-1',
    synthetic: true,
    displayName: 'นาย กิตติ สมมติ (นายกฤตเมธ ปัญจพัฒน์)',
    portraitUrl: candidate1,
    ageApprox: 34,
    similarity: 91,
    warrantNotice: {
      number: 'ผ.102/2567',
      category: 'ร่วมกันลักทรัพย์ในเคหสถาน',
      issuer: 'ศาลอาญา',
      status: ' active warrant',
      receivedAt: '12 พ.ย. 2565',
    },
    identityFields: [
      { label: 'เพศ', value: 'ชาย' },
      { label: 'ส่วนสูง', value: '172 ซม.' },
      { label: 'กรุ๊ปเลือด', value: 'O' },
      { label: 'เลขประจำตัวจำลอง', value: '1372671005123' },
      { label: 'จังหวัดตามข้อมูลจำลอง', value: 'กรุงเทพมหานคร' },
    ],
    crossChecks: sharedSources,
    caseGroups: [
      { label: 'คดีทรัพย์', status: 'พบหมายจับติดตัว ศาลอาญา' },
      { label: 'สถานะข้อมูล', status: 'รอเจ้าหน้าที่ยืนยันตัวตน' },
    ],
  },
  {
    id: 'candidate-2',
    synthetic: true,
    displayName: 'นาย ธนกฤต ศรีวัฒน์',
    portraitUrl: candidate2,
    ageApprox: 28,
    similarity: 84,
    identityFields: [
      { label: 'เพศ', value: 'ชาย' },
      { label: 'ส่วนสูง', value: '170 ซม.' },
      { label: 'กรุ๊ปเลือด', value: 'B' },
      { label: 'เลขประจำตัวจำลอง', value: '3100598721441' },
      { label: 'จังหวัดตามข้อมูลจำลอง', value: 'นนทบุรี' },
    ],
    crossChecks: [
      { label: 'ชื่อสอดคล้อง', state: 'possible', detail: 'พบชื่อใกล้เคียงหลายรายการ' },
      { label: 'เลขประจำตัวสอดคล้อง', state: 'unknown', detail: 'ไม่ได้ส่งเลขประจำตัวเข้าค้นหา' },
      { label: 'ใบหน้ามีความคล้าย', state: 'possible', detail: 'ใช้ประกอบการจัดลำดับเท่านั้น' },
    ],
    caseGroups: [{ label: 'ประวัติคดีอาญา', status: 'พบข้อมูลบางส่วนอยู่ระหว่างตรวจสอบ' }],
  },
  {
    id: 'candidate-3',
    synthetic: true,
    displayName: 'นาย พีรภัทร อนันต์ชัย',
    portraitUrl: candidate3,
    ageApprox: 30,
    similarity: 76,
    identityFields: [
      { label: 'เพศ', value: 'ชาย' },
      { label: 'ส่วนสูง', value: '168 ซม.' },
      { label: 'กรุ๊ปเลือด', value: 'A' },
      { label: 'เลขประจำตัวจำลอง', value: '5120499812773' },
      { label: 'จังหวัดตามข้อมูลจำลอง', value: 'ปทุมธานี' },
    ],
    crossChecks: [
      { label: 'ชื่อสอดคล้อง', state: 'possible', detail: 'ชื่อมีความใกล้เคียง' },
      { label: 'เลขประจำตัวสอดคล้อง', state: 'unknown', detail: 'ไม่ได้ส่งเลขประจำตัวเข้าค้นหา' },
      { label: 'ใบหน้ามีความคล้าย', state: 'possible', detail: 'ใช้ประกอบการจัดลำดับเท่านั้น' },
    ],
    caseGroups: [{ label: 'ยังไม่พบกลุ่มคดีในข้อมูลจำลอง', status: 'ไม่พบประวัติคดีอาญา' }],
  },
]
