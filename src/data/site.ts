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
];

export const contactHref = `mailto:${site.email}?subject=${encodeURIComponent('[프로젝트 문의] 프로젝트명 또는 회사·팀 이름')}`;

/**
 * ogImage는 scripts/generate-og.mjs가 만드는 페이지별 공유 이미지(1200×630)입니다.
 * ogImageAlt는 이미지에 실제로 그려진 문구를 그대로 옮깁니다.
 */
export const pageMeta = {
  home: { title: "BLDNEX — BUILD WHAT'S NEXT", description: '웹사이트, SaaS, 모바일 앱을 만드는 제품 개발 스튜디오 BLDNEX. 요구사항 정의부터 UI 디자인, 개발, 배포까지 제품 론칭에 필요한 전 과정을 만듭니다.', ogImage: '/assets/brand/og-bldnex.png', ogImageAlt: 'BLDNEX — BUILD WHAT’S NEXT. 웹사이트 · SaaS · 모바일 앱' },
  about: { title: 'About — 제품을 만드는 방식 · BLDNEX', description: 'PreviewLog와 Shuffo를 직접 개발하고 배포한 BLDNEX. 자체 제품을 만들며 축적한 실전 기준과 협업 방식을 소개합니다.', ogImage: '/assets/brand/og-about.png', ogImageAlt: 'BLDNEX About — We build our own. 직접 만들고 운영해 본 경험으로 고객의 제품을 만듭니다.' },
  services: { title: 'Services — 웹사이트·SaaS·앱 개발 · BLDNEX', description: '기업·브랜드 웹사이트, 웹앱과 SaaS, 모바일 앱을 개발합니다. 프로젝트에 맞는 제공 범위와 산출물, 협업 방식을 살펴보세요.', ogImage: '/assets/brand/og-services.png', ogImageAlt: 'BLDNEX Services — Websites. Apps. SaaS. 웹사이트 · 웹앱/SaaS · 모바일 앱 개발' },
  works: { title: 'Works — BLDNEX의 자체 제품', description: '촬영본 정리 도구 PreviewLog와 모바일 퍼즐 Shuffo. BLDNEX가 만드는 제품과 각각의 사용 흐름을 소개합니다.', ogImage: '/assets/brand/og-works.png', ogImageAlt: 'BLDNEX Works — Our own products. PreviewLog · Shuffo' },
  previewlog: { title: 'PreviewLog — 촬영본을 프리뷰 자료로 · BLDNEX', description: '대표 컷, 대사, 타임코드를 정리하고 편집용 자료로 내보내는 데스크톱 앱 PreviewLog. 제품의 검토 흐름과 결과물을 소개합니다.', ogImage: '/assets/brand/og-previewlog.png', ogImageAlt: 'BLDNEX PreviewLog — 촬영본을 편집용 프리뷰 자료로.' },
  shuffo: { title: 'Shuffo — 사진으로 즐기는 퍼즐 · BLDNEX', description: '사진으로 즐기는 iPhone용 퍼즐 Shuffo. BLDNEX가 만든 모바일 게임의 화면을 살펴보세요.', ogImage: '/assets/brand/og-shuffo.png', ogImageAlt: 'BLDNEX Shuffo — 좋아하는 사진이 작은 퍼즐이 됩니다.' },
  contact: { title: 'Contact — 프로젝트 문의 · BLDNEX', description: '만들고 싶은 웹사이트, SaaS, 앱과 현재 상황을 알려주세요. 프로젝트 문의에 필요한 정보와 협업에 관한 질문을 안내합니다.', ogImage: '/assets/brand/og-contact.png', ogImageAlt: 'BLDNEX Contact — Tell us what you’re building. BLDNEX.DEV@GMAIL.COM' },
  'bldnex-website': { title: 'bldnex.com — 이 웹사이트를 만든 방법 · BLDNEX', description: 'BLDNEX 웹사이트의 기술 구성과 빌드할 때 실제로 측정한 용량, 외부 요청 수, 자동 검수 항목을 공개합니다.', ogImage: '/assets/brand/og-bldnex-website.png', ogImageAlt: 'BLDNEX bldnex.com — 만든 제품을 보시려면, 지금 보고 계신 이 사이트를 확인해 주세요.' },
};

export const publicPaths = ['/', '/about', '/services', '/works', '/works/previewlog', '/works/shuffo', '/works/bldnex-website', '/contact'];
