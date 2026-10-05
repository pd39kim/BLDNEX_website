export const site = {
  name: 'BLDNEX',
  legalName: '빌드넥스',
  tagline: "BUILD WHAT'S NEXT",
  email: 'BLDNEX.DEV@GMAIL.COM',
  businessNumber: '374-02-03692',
  siteUrl: 'https://bldnex.com',
  previewlogUrl: 'https://previewlog.bldnex.com',
  shuffoUrl: 'https://apps.apple.com/kr/app/shuffo/id6814380886',
};

export const navigation = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/works', label: 'Works' },
  { href: '/contact', label: 'Contact' },
];

export const contactHref = `mailto:${site.email}?subject=${encodeURIComponent('[프로젝트 문의] 프로젝트명 또는 회사·팀 이름')}`;

export const pageMeta = {
  home: { title: "BLDNEX — BUILD WHAT'S NEXT", description: '웹사이트, SaaS, 모바일 앱을 만드는 제품 개발 스튜디오 BLDNEX. 아이디어 정리부터 디자인, 개발, 출시 준비까지 함께합니다.' },
  about: { title: 'About — 제품을 만드는 방식 · BLDNEX', description: '대표 개발자를 중심으로 프로젝트에 맞춰 협업하는 BLDNEX. 자체 제품을 만드는 이유와 기획부터 출시 준비까지 이어지는 작업 방식을 소개합니다.' },
  services: { title: 'Services — 웹사이트·SaaS·앱 개발 · BLDNEX', description: '기업·브랜드 웹사이트, 웹앱과 SaaS, 모바일 앱을 개발합니다. 프로젝트에 맞는 제공 범위와 산출물, 협업 방식을 살펴보세요.' },
  works: { title: 'Works — BLDNEX의 자체 제품', description: '촬영본 정리 도구 PreviewLog와 모바일 퍼즐 Shuffo. BLDNEX가 만드는 제품과 각각의 사용 흐름을 소개합니다.' },
  previewlog: { title: 'PreviewLog — 촬영본을 프리뷰 자료로 · BLDNEX', description: '대표 컷, 대사, 타임코드를 정리하고 편집용 자료로 내보내는 데스크톱 앱 PreviewLog. 제품의 검토 흐름과 결과물을 소개합니다.' },
  shuffo: { title: 'Shuffo — 사진으로 즐기는 퍼즐 · BLDNEX', description: '사진으로 즐기는 iPhone용 퍼즐 Shuffo. BLDNEX가 만든 모바일 게임의 화면을 살펴보세요.' },
  contact: { title: 'Contact — 프로젝트 문의 · BLDNEX', description: '만들고 싶은 웹사이트, SaaS, 앱과 현재 상황을 알려주세요. 프로젝트 문의에 필요한 정보와 협업에 관한 질문을 안내합니다.' },
};

export const publicPaths = ['/', '/about', '/services', '/works', '/works/previewlog', '/works/shuffo', '/contact'];
