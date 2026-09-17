export type PseoService = Readonly<{
  kind: 'service';
  slug: string;
  name: string;
  title: string;
  description: string;
  intent: string;
  buyer: string;
  context: string;
  workflow: readonly string[];
  deliverables: readonly string[];
  evidence: readonly string[];
  readiness: string;
  agencySlug: string;
  agencyName: string;
  agencyThaiName: string;
  agencyStatus: 'incubating' | 'target' | 'locked';
  agencyStage: string;
}>;

export const pseoService: PseoService = {
  "kind": "service",
  "slug": "security-readiness-assessment",
  "name": "Security readiness assessment",
  "title": "Security Readiness Assessment สำหรับระบบที่ต้องลดความเสี่ยง",
  "description": "ทบทวนระบบหนึ่งขอบเขต จัดลำดับความเสี่ยง และส่ง remediation map ที่ตรวจซ้ำได้",
  "intent": "ต้องการรู้ว่าความเสี่ยงของระบบดิจิทัลหรือ cyber-physical อยู่ตรงไหนและควรแก้อะไรก่อน",
  "buyer": "CISO, CIO และเจ้าของระบบสำคัญ",
  "context": "เริ่มจาก authorized scope และหลักฐานที่ตรวจได้ ไม่ใช่ managed security, 24/7 response หรือการทดสอบระบบโดยไม่มี permission",
  "workflow": [
    "ยืนยัน asset, authorization และขอบเขตการตรวจ",
    "รวบรวม control, evidence และ known exception",
    "จัดลำดับ impact, likelihood และ remediation owner",
    "ส่ง remediation map พร้อมวิธีทบทวนซ้ำ"
  ],
  "deliverables": [
    "scope และ authorization record",
    "risk/control/evidence map",
    "prioritized remediation backlog",
    "readout สำหรับ CISO/CIO และ review checklist"
  ],
  "evidence": [
    "ไม่เปิดเผย threat data หรือ system details บน public website",
    "ไม่อ้าง certification, penetration test หรือ 24/7 monitoring",
    "ผลการประเมินจริงต้องมาจาก authorized environment และผู้มีคุณสมบัติเหมาะสม"
  ],
  "readiness": "ต้องมี security lead, system owner, written authorization และวิธีจัดการข้อมูลลับก่อนเริ่มงาน",
  "agencySlug": "cyber-security",
  "agencyName": "Cyber & Security",
  "agencyThaiName": "ความมั่นคงปลอดภัย",
  "agencyStatus": "target",
  "agencyStage": "P1"
};
