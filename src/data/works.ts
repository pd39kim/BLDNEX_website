export type Work = {
  slug: 'previewlog' | 'shuffo' | 'bldnex-website';
  category: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
};

export const works: Work[] = [
  {
    slug: 'previewlog', category: 'DESKTOP PRODUCT', title: 'PreviewLog',
    summary: '촬영본을 편집용 프리뷰 자료로.',
    description: '대표 컷, 대사와 타임코드를 정리하고 검토한 내용을 내보내는 데스크톱 앱.',
    tags: ['로컬 기본 분석', '프리뷰 로그', '검토와 내보내기'],
  },
  {
    slug: 'shuffo', category: 'MOBILE GAME', title: 'Shuffo',
    summary: '좋아하는 사진으로 즐기는 퍼즐.',
    description: '사진을 고르고 조각을 맞추는 모바일 게임.',
    tags: ['사진 선택', '슬라이드 퍼즐', 'iPhone'],
  },
  {
    slug: 'bldnex-website', category: 'WEBSITE', title: 'bldnex.com',
    summary: '지금 보고 계신 이 웹사이트.',
    description: '정적 생성, 빌드 단계 폰트 서브셋, 자동 검수까지 직접 만든 회사 웹사이트.',
    tags: ['Astro 정적 생성', '폰트 서브셋', '빌드 검수'],
  },
];
