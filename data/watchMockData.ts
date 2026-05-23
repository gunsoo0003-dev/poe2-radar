import type { PublicMonitor, WatchCondition } from '../types/watch';

export const publicMonitorMockData: PublicMonitor = {
  id: 'public-monitor-1',
  title: '공식 거래소 검색조건 감시 예시',
  league: 'Fate of the Vaal',
  changeRate: '-24%',
  newItemText: '최근 20분 내 감지',
  conditionText: '희귀 장갑 / 생명력 / 저항 조건',
  prices: [
    {
      amount: '4',
      currency: 'Divine',
    },
    {
      amount: '4.5',
      currency: 'Divine',
    },
    {
      amount: '5',
      currency: 'Divine',
    },
    {
      amount: '5',
      currency: 'Divine',
    },
    {
      amount: '6',
      currency: 'Divine',
    },
  ],
};

export const watchConditionMockList: WatchCondition[] = [
  {
    id: 'watch-1',
    name: '희귀 장갑 생명력 + 저항',
    title: '희귀 장갑 생명력 + 저항',
    league: 'Fate of the Vaal',
    alertEnabled: true,
    alertType: 'price',
    alertLabel: '최저가 5 Divine 이하',
    updatedAt: '방금 전',
    summary: ['생명력', '화염 저항', '냉기 저항', '최저가순'],
    extraSummaryCount: 2,
    prices: [
      {
        amount: '4',
        currency: 'Divine',
      },
      {
        amount: '4.5',
        currency: 'Divine',
      },
      {
        amount: '5',
        currency: 'Divine',
      },
      {
        amount: '5',
        currency: 'Divine',
      },
      {
        amount: '6',
        currency: 'Divine',
      },
    ],
  },
  {
    id: 'watch-2',
    name: '유니크 목걸이 최저가 감시',
    title: '유니크 목걸이 최저가 감시',
    league: 'Fate of the Vaal',
    alertEnabled: true,
    alertType: 'newItem',
    alertLabel: '신규 매물 감지 시 알림',
    updatedAt: '5분 전',
    summary: ['유니크', '목걸이', '최저가순'],
    extraSummaryCount: 1,
    prices: [
      {
        amount: '1',
        currency: 'Divine',
      },
      {
        amount: '1.2',
        currency: 'Divine',
      },
      {
        amount: '1.5',
        currency: 'Divine',
      },
    ],
  },
];