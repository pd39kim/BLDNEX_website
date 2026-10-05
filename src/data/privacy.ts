import { site } from './site';
import { POLICY_VERSION } from '../../shared/contact';

/**
 * 개인정보처리방침 운영값.
 *
 * 소유자가 확인한 운영값을 보존합니다. 폼 보관 기준도 승인되었습니다.
 * 공급자 설정·국외 이전·개정 시행일 검토는 별도이며, 이를 마칠 때까지
 * pending/noindex와 접수 비활성 상태를 유지합니다.
 */
export const privacyConfig = {
  /** 확정: 사업주 본인이 개인정보 보호책임자입니다. */
  officerName: '김상규',
  /** 확정: 열람·정정·삭제 청구 접수처로 표기되는 사업장 주소. */
  businessAddress: '경기도 여주시 산북면 송현길 31-12',
  /** 확정: 문의 처리 종료 후 1년. */
  retentionPeriod: '문의 처리가 끝난 날로부터 1년 동안',
  /** 확정: Cloudflare Pages로 배포합니다. */
  hostingProvider: 'Cloudflare, Inc. (Cloudflare Pages)',
  /** 확정: 2026-10-06 시행. */
  effectiveDate: '2026년 10월 6일',
};

// The existing email-policy operating values remain intact. The form amendment needs separate review.
export const formPolicyReviewed = import.meta.env.PUBLIC_CONTACT_POLICY_VERSION === POLICY_VERSION;
export const privacyPending = !formPolicyReviewed || Object.values(privacyConfig).some((value) => value === '');

/** 화면에 표시할 값. 비어 있으면 미확인 상태임을 명시합니다. */
export const resolve = (value: string) => value || '[확인 필요]';

export type PrivacySection = {
  id: string;
  number: string;
  title: string;
  blocks: Array<
    | { type: 'text'; value: string }
    | { type: 'list'; items: string[] }
    | { type: 'table'; head: string[]; rows: string[][] }
  >;
};

export const privacySections: PrivacySection[] = [
  {
    id: 'purpose',
    number: '01',
    title: '수집·이용 목적과 항목',
    blocks: [
      {
        type: 'text',
        value:
          '프로젝트 문의 폼은 접수·검토 및 답변을 위해 아래 정보를 수집하도록 준비하고 있습니다. 운영 설정과 방침 검토가 완료되기 전에는 온라인 접수를 받지 않습니다. 회원가입이나 고객용 문의 조회 기능은 제공하지 않습니다.',
      },
      {
        type: 'text',
        value:
          `프로젝트 문의는 이메일(${site.email})로 받습니다. 이용자가 보낸 이메일에 포함된 정보는 문의 접수와 응대, 협업 조건 협의를 위해서만 이용합니다.`,
      },
      {
        type: 'table',
        head: ['구분', '항목', '수집 방법'],
        rows: [
          ['이메일 문의', '이용자가 자발적으로 기재한 정보(이메일 주소, 이름 또는 회사·팀 이름, 문의 내용, 첨부 자료)', '이용자의 이메일 발송'],
          ['문의 폼 필수정보', '이름, 이메일, 프로젝트 유형·예산·일정·내용, 동의 버전과 일시', '동의 후 문의 폼 제출'],
          ['문의 폼 선택정보', '회사·팀 이름, 연락처', '별도 선택 동의 후 문의 폼 제출'],
          ['보안·운영', '보안 확인 토큰, IP·이메일을 시간 단위로 변환한 요청 제한 값, 관리자 계정·작업·일시', '스팸 방지, 접근 인증 및 처리 기록'],
        ],
      },
      {
        type: 'text',
        value:
          '이메일에 주민등록번호, 계좌번호, 신용카드 정보 등 민감정보나 고유식별정보를 포함해 보내지 않도록 요청드립니다. 해당 정보가 포함된 경우 응대에 필요한 범위를 넘어 보관하지 않고 파기합니다.',
      },
    ],
  },
  {
    id: 'automatic',
    number: '02',
    title: '브라우저 저장소와 보안 서비스',
    blocks: [
      {
        type: 'text',
        value:
          '광고·방문 분석 도구는 사용하지 않습니다. 문의 입력 내용은 화면의 메모리에만 유지하며 localStorage·sessionStorage에 따로 저장하지 않습니다. 새로고침하거나 화면을 닫으면 입력 중인 내용이 사라집니다.',
      },
      {
        type: 'text',
        value: '온라인 접수가 활성화된 문의 페이지에서는 Cloudflare Turnstile이 자동 제출을 방지하기 위해 브라우저·네트워크 신호를 처리합니다. 관리자 영역은 Cloudflare Access의 인증 쿠키를 이용합니다. 공급자의 실제 보안 설정과 처리 범위는 접수 공개 전 확인 대상입니다.',
      },
      {
        type: 'text',
        value:
          '이메일 주소 복사 기능은 이용자의 브라우저 안에서만 동작하며, 복사 동작이나 그 내용을 외부로 전송하거나 기록하지 않습니다.',
      },
    ],
  },
  {
    id: 'third-party',
    number: '03',
    title: '제3자 제공과 국외 이전',
    blocks: [
      {
        type: 'text',
        value:
          '문의 정보를 판매하거나 광고 목적으로 이용하지 않습니다. 웹폰트는 자체 호스팅합니다. 호스팅·문의 저장·보안·메일 알림에는 아래 외부 서비스를 사용하는 구성이며, 위탁·국외 이전에 관한 세부 고지는 공급자 계정과 계약 조건을 확인한 뒤 확정합니다. 아래 미확정 항목이 남아 있는 동안 온라인 접수는 비활성 상태로 유지합니다.',
      },
      {
        type: 'table',
        head: ['서비스', '처리 항목', '목적', '운영 확인 사항'],
        rows: [
          [resolve(privacyConfig.hostingProvider), '접속 정보 및 요청 데이터', '웹사이트 호스팅', '처리 국가·보관 기간 및 계약 조건 확인'],
          ['Cloudflare D1 · Functions · Workers (준비)', '문의 입력 내용·동의 및 처리 기록', '문의 저장·관리·파기', '실제 DB 위치·백업 기간·이전 근거 확인'],
          ['Cloudflare Turnstile · Access (준비)', '보안 확인 신호, 관리자 계정·인증 정보', '스팸 차단·접근 인증', '수집 범위·보안 쿠키·보관 기간 확인'],
          ['Resend (준비)', '수신 관리자 주소, 접수번호·유형·시각·관리자 링크', '운영자 알림', '발송 계약 주체·국가·보관 기간·연락처 확인'],
          ['Google LLC (Gmail)', '이메일 문의에 포함된 정보 또는 최소 접수 알림', '메일 수신·응대', '계정 유형·처리 국가·보관 설정 확인'],
        ],
      },
      {
        type: 'text',
        value:
          '문의 폼의 알림 메일에는 문의자의 이름·이메일·연락처·상세 내용을 복사하지 않습니다. 관리자가 인증된 화면에서 확인합니다. 이메일로 직접 문의하면 작성한 이메일 내용이 메일 서비스에서 처리됩니다. 전송 시점·방법·국가·보유 기간·거부 방법 등 필요한 국외 이전 고지는 실제 설정에 맞게 확정해야 합니다.',
      },
    ],
  },
  {
    id: 'retention',
    number: '04',
    title: '보유 기간과 파기',
    blocks: [
      {
        type: 'text',
        value: `문의 이메일은 ${resolve(privacyConfig.retentionPeriod)} 보관한 뒤 파기합니다. 계약이 체결된 경우에는 계약 이행과 관련 법령에 따른 보존 기간을 따릅니다.`,
      },
      {
        type: 'text',
        value: '문의 폼 정보는 처리 종료 후 365일, 미종결 문의는 접수 후 최대 730일 동안 보관합니다. 회사·연락처 등 선택정보에도 같은 기간을 적용합니다. 요청 제한용 변환 값은 최대 24시간 단위로 만료되고, 내용 없는 관리자 처리 기록은 365일 뒤 삭제하도록 구성합니다.',
      },
      {
        type: 'text',
        value:
          '관계 법령에 따라 보존 의무가 있는 기록은 해당 기간 동안 분리하여 보관합니다. 전자상거래 등에서의 소비자보호에 관한 법률에 따른 계약·대금결제 기록 5년, 소비자 불만·분쟁 처리 기록 3년이 이에 해당할 수 있습니다.',
      },
      {
        type: 'text',
        value:
          '문의 데이터의 보관 기간이 지나면 예약 작업으로 데이터베이스의 원문과 대기 알림을 삭제합니다. 이미 발송된 메일, 이메일 상담 기록, 공급자의 백업·복구 사본은 별도 관리 대상이며 데이터베이스 삭제만으로 함께 제거되지는 않습니다. 백업 보관 기간과 복원 후 재삭제 절차는 공개 전 운영 지침으로 확정합니다.',
      },
    ],
  },
  {
    id: 'rights',
    number: '05',
    title: '정보주체의 권리와 행사 방법',
    blocks: [
      {
        type: 'text',
        value: '이용자는 언제든지 자신의 개인정보에 대해 다음 권리를 행사할 수 있습니다.',
      },
      {
        type: 'list',
        items: [
          '개인정보 열람 요구',
          '오류가 있을 경우 정정 요구',
          '삭제 요구',
          '처리 정지 요구',
        ],
      },
      {
        type: 'text',
        value: `권리 행사는 아래 개인정보 보호책임자의 이메일로 요청하실 수 있으며, 요청을 확인한 뒤 지체 없이 조치하고 결과를 알려드립니다. 법정대리인이나 위임받은 자를 통해서도 요청할 수 있습니다.`,
      },
      {
        type: 'text',
        value:
          '열람·정정·삭제 요구는 개인정보 보호법 제35조 제4항, 제36조 제1항, 제37조 제2항에 따라 제한될 수 있습니다.',
      },
    ],
  },
  {
    id: 'security',
    number: '06',
    title: '안전성 확보 조치',
    blocks: [
      {
        type: 'list',
        items: [
          '웹사이트 전 구간 HTTPS 암호화 전송',
          '문의 원문은 데이터베이스에 저장하고 관리자 인증을 통과한 요청에만 제공하도록 구성',
          '서버 입력 검증·중복 제출 방지·요청 제한·스팸 검증 적용',
          '관리자 계정 및 이메일 계정의 접근 권한 최소화, 2단계 인증은 운영 설정 시 확인',
          '개인정보 취급자를 업무상 필요한 최소 인원으로 제한',
          '처리 목적이 끝난 정보의 지체 없는 파기',
        ],
      },
    ],
  },
  {
    id: 'officer',
    number: '07',
    title: '개인정보 보호책임자와 열람 청구 접수처',
    blocks: [
      {
        type: 'table',
        head: ['구분', '내용'],
        rows: [
          ['개인정보 보호책임자', resolve(privacyConfig.officerName)],
          ['소속', `${site.legalName} (${site.name})`],
          ['이메일', site.email],
          ['사업자등록번호', site.businessNumber],
          ['주소', resolve(privacyConfig.businessAddress)],
        ],
      },
      {
        type: 'text',
        value:
          '개인정보 보호 관련 문의, 불만 처리, 피해 구제, 열람 청구는 위 연락처로 접수해 주시기 바랍니다. 접수된 내용에 대해 지체 없이 답변하고 처리하겠습니다.',
      },
    ],
  },
  {
    id: 'remedy',
    number: '08',
    title: '권익 침해 구제 방법',
    blocks: [
      {
        type: 'text',
        value:
          '개인정보 침해로 상담이나 피해 구제가 필요한 경우 아래 기관에 문의하실 수 있습니다. 공공기관의 처분이나 부작위로 권리를 침해받은 경우에는 행정심판을 청구할 수 있습니다.',
      },
      {
        type: 'table',
        head: ['기관', '전화', '웹사이트'],
        rows: [
          ['개인정보 침해신고센터 (한국인터넷진흥원)', '국번 없이 118', 'privacy.kisa.or.kr'],
          ['개인정보 분쟁조정위원회', '1833-6972', 'kopico.go.kr'],
          ['대검찰청 사이버수사과', '국번 없이 1301', 'spo.go.kr'],
          ['경찰청 사이버수사국', '국번 없이 182', 'ecrm.police.go.kr'],
        ],
      },
    ],
  },
  {
    id: 'changes',
    number: '09',
    title: '방침의 변경',
    blocks: [
      {
        type: 'text',
        value:
          '법령이나 서비스 내용의 변경에 따라 이 방침을 수정할 수 있습니다. 내용이 추가·삭제·수정되는 경우 시행 7일 전부터 이 페이지를 통해 변경 사항과 시행일을 알려드립니다.',
      },
      {
        type: 'text',
        value: `기존 이메일 방침 시행일: ${resolve(privacyConfig.effectiveDate)}. 문의 폼 관련 개정안 시행일은 별도 확정이 필요합니다.`,
      },
    ],
  },
];
