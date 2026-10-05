export const POLICY_VERSION = 'contact-2026-10-05-v1';
// Approved by the owner on 2026-10-05; provider/legal setup is a separate release gate.
export const RETENTION_DAYS = { closed: 365, open: 730 } as const;
export const projectTypes = { website: '웹사이트', webapp: '웹앱 · SaaS', mobile: '모바일 앱', other: '기타 · 상담 후 결정' } as const;
export const budgets = { undecided: '아직 미정', under10: '1,000만 원 미만', from10to30: '1,000만–3,000만 원', over30: '3,000만 원 이상' } as const;
export const schedules = { undecided: '상담 후 결정', month: '1개월 이내', quarter: '1–3개월', later: '3개월 이후' } as const;
export const statuses = { new: '새 문의', reviewing: '검토 중', contacted: '연락 완료', closed: '처리 종료' } as const;
export type Status = keyof typeof statuses;
export interface ContactInput {
  projectType: keyof typeof projectTypes;
  name: string;
  company: string;
  email: string;
  phone: string;
  budget: keyof typeof budgets;
  schedule: keyof typeof schedules;
  description: string;
  consent: boolean;
  optionalConsent: boolean;
  policyVersion: string;
}
export type FieldErrors = Partial<Record<keyof ContactInput, string>>;
const owns = (choices: object, value: string) => Object.hasOwn(choices, value);

/** Shared UX validation; the server always runs this again. No client timestamps are trusted. */
export function validateContact(raw: unknown): { data: ContactInput; errors: FieldErrors } {
  const value = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
  const str = (key: string) => typeof value[key] === 'string' ? value[key].trim().normalize('NFC') : '';
  const data: ContactInput = {
    projectType: str('projectType') as ContactInput['projectType'],
    name: str('name'), company: str('company'), email: str('email'), phone: str('phone'),
    budget: str('budget') as ContactInput['budget'], schedule: str('schedule') as ContactInput['schedule'],
    description: str('description'), consent: value.consent === true,
    optionalConsent: value.optionalConsent === true, policyVersion: str('policyVersion'),
  };
  const errors: FieldErrors = {};
  if (!owns(projectTypes, data.projectType)) errors.projectType = '프로젝트 유형을 선택해주세요.';
  if (data.name.length < 2 || data.name.length > 50 || /[\p{Cc}]/u.test(data.name)) errors.name = '이름은 2–50자로 입력해주세요.';
  if (data.company.length > 100 || /[\p{Cc}]/u.test(data.company)) errors.company = '회사·팀 이름은 100자 이내로 입력해주세요.';
  if (data.email.length > 254 || !/^[^\s@\p{Cc}]+@[^\s@\p{Cc}]+\.[^\s@\p{Cc}]+$/u.test(data.email)) errors.email = '연락받을 이메일 주소를 확인해주세요.';
  if (data.phone && !/^[+\d][\d ()+.-]{6,29}$/.test(data.phone)) errors.phone = '연락처는 숫자와 +, -, 괄호로 7–30자 이내로 입력해주세요.';
  if (!owns(budgets, data.budget)) errors.budget = '예산 범위를 선택해주세요. 미정도 괜찮습니다.';
  if (!owns(schedules, data.schedule)) errors.schedule = '희망 일정을 선택해주세요. 상담 후 결정도 괜찮습니다.';
  if (data.description.length < 20 || data.description.length > 5000 || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(data.description)) errors.description = '프로젝트 내용을 20–5,000자로 입력해주세요.';
  if (!data.consent) errors.consent = '필수 개인정보 수집·이용에 동의해주세요.';
  if ((data.company || data.phone) && !data.optionalConsent) errors.optionalConsent = '회사·연락처를 지우거나 선택정보 수집·이용에 동의해주세요.';
  if (data.policyVersion !== POLICY_VERSION) errors.policyVersion = '안내 내용이 변경되었습니다. 입력 내용을 따로 보관한 뒤 페이지를 새로고침해주세요.';
  return { data, errors };
}
