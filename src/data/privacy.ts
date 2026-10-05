import { site } from './site';

/**
 * 개인정보처리방침 운영값.
 *
 * TODO 표시된 값은 실제 운영 정보가 확인되기 전까지 비워 둡니다.
 * 값을 지어내지 않습니다. 모두 채워지면 `pending`이 false가 되고,
 * 그때 privacy.astro의 noindex와 푸터의 "(준비 중)" 표기를 해제합니다.
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

export const privacyPending = Object.values(privacyConfig).some((value) => value === '');

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
          '이 웹사이트는 방문자에게 정보를 입력받는 문의 폼이나 회원가입 기능을 제공하지 않습니다. 따라서 웹사이트 이용만으로는 개인정보가 수집되지 않습니다.',
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
          ['웹사이트 이용', '수집하지 않음', '해당 없음'],
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
    title: '자동 수집 장치 — 쿠키를 사용하지 않습니다',
    blocks: [
      {
        type: 'text',
        value:
          '이 웹사이트는 쿠키, 브라우저 저장소(localStorage·sessionStorage), 접속 분석 도구, 광고 식별자를 사용하지 않습니다. 이용자의 방문 기록을 식별하거나 추적하지 않으며, 별도의 쿠키 거부 설정이 필요하지 않습니다.',
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
          '수집한 개인정보를 제3자에게 제공하거나 판매하지 않습니다. 이 웹사이트는 글꼴을 포함한 모든 파일을 자체 서버에서 제공하므로, 페이지를 여는 것만으로 외부 사업자에게 전달되는 정보가 없습니다. 다만 아래 서비스를 이용하는 과정에서 접속 정보가 해당 사업자에게 전달되며, 서버가 국외에 있습니다.',
      },
      {
        type: 'table',
        head: ['제공받는 자', '이전되는 항목', '이전 목적', '이전 국가'],
        rows: [
          [resolve(privacyConfig.hostingProvider), '접속 로그(IP 주소, 접속 일시, 요청 경로)', '웹사이트 호스팅 및 보안', '미국 등 글로벌 엣지 네트워크'],
          ['Google LLC (Gmail)', '이메일 문의에 포함된 정보', '문의 메일 수신·보관', '미국 등'],
        ],
      },
      {
        type: 'text',
        value:
          '이전 시점은 각 요청이 발생하는 때이며, 이전 방법은 정보통신망을 통한 전송입니다. 이용자는 이메일을 보내지 않음으로써 문의 정보의 이전을 거부할 수 있습니다. 웹사이트 열람에 필요한 접속 로그는 서비스 제공에 필수적이어서 거부할 경우 웹사이트를 이용할 수 없습니다.',
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
        value:
          '관계 법령에 따라 보존 의무가 있는 기록은 해당 기간 동안 분리하여 보관합니다. 전자상거래 등에서의 소비자보호에 관한 법률에 따른 계약·대금결제 기록 5년, 소비자 불만·분쟁 처리 기록 3년이 이에 해당할 수 있습니다.',
      },
      {
        type: 'text',
        value:
          '보유 기간이 지나거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일은 복구할 수 없는 방법으로 영구 삭제하고, 출력물이 있는 경우 분쇄하거나 소각합니다.',
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
          '개인정보를 저장하는 데이터베이스나 문의 접수 서버를 운영하지 않음',
          '문의 이메일 계정에 2단계 인증 적용 및 접근 권한 최소화',
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
        value: `시행일자: ${resolve(privacyConfig.effectiveDate)}`,
      },
    ],
  },
];
