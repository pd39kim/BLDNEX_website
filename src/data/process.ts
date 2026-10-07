export const processSteps = [
  { name: 'Understand', title: '해결할 문제부터 정리합니다.', description: '현재 상황과 사용자를 이해하고, 프로젝트의 목표와 우선순위를 맞춥니다.', output: '목표 · 대상 사용자 · 핵심 범위' },
  { name: 'Shape', title: '사용할 흐름을 그립니다.', description: '기능 목록을 화면과 사용자 흐름으로 바꾸고, 필요한 디자인과 기술 방향을 정합니다.', output: '정보 구조 · 주요 화면 · 기술 방향' },
  { name: 'Build', title: '작동하는 모습으로 확인합니다.', description: '합의한 범위를 구현하고 실제 화면과 동작을 확인하며 디테일을 다듬습니다.', output: '디자인 · 기능 구현 · 검수 항목' },
  { name: 'Ship', title: '공개 이후의 사용까지 준비합니다.', description: '배포와 기본 운영 방법을 정리하고, 다음에 개선할 항목을 구분합니다.', output: '배포 결과 · 운영 안내 · 후속 과제' },
];

export const collaborationStandards = [
  {
    step: '01',
    name: 'START WITH CLARITY',
    title: '시작 기준을 명확히 맞춥니다.',
    description: '기획서가 완벽하지 않아도 괜찮습니다. 해결할 문제, 주요 사용자, 준비된 자료를 바탕으로 이번에 만들 핵심 범위와 우선순위를 먼저 합의합니다.',
    rule: '핵심 범위와 우선순위 사전 합의',
  },
  {
    step: '02',
    name: 'INSPECT WORKING SOFTWARE',
    title: '작동하는 화면으로 결정합니다.',
    description: '문서로만 논의하지 않고, 실제 브라우저와 기기에서 구동되는 화면을 함께 확인합니다. 사용자 흐름을 직접 경험하며 수정할 지점을 빠르게 찾습니다.',
    rule: '실제 화면과 동작 흐름 기반 검토',
  },
  {
    step: '03',
    name: 'MANAGE TRADE-OFFS',
    title: '요구사항 변경을 투명하게 다룹니다.',
    description: '작업 중 새로운 아이디어가 나오면 무리하게 떠안거나 거절하지 않습니다. 일정·범위·비용에 미치는 영향을 솔직하게 공유하고 우선순위를 다시 조정합니다.',
    rule: '영향 범위 공유 후 우선순위 재조정',
  },
  {
    step: '04',
    name: 'PREPARE FOR OPERATION',
    title: '출시 이후의 운영까지 챙깁니다.',
    description: '단순 코드 납품에 그치지 않습니다. 안정적인 배포 환경, 기초 운영 안내, 향후 추가 개선할 과제를 명확히 구분해 인수인계합니다.',
    rule: '배포 결과 · 운영 안내 · 후속 과제 정리',
  },
];

