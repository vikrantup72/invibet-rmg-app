export const goals = ['fire', 'walking', 'both'] as const;
export type Goal = (typeof goals)[number];

export type PickOfTheDaySingleData = {
  goal: string;
  colorType: Goal;
  pointsYouPay: number;
  pointsYouGet: number;
  currentPoints: number;
};

export type ActivebetSingleData = {
  goal: string;
  colorType: Goal;
  progress: string;
  pointsYouPay: number;
  pointsYouGet: number;
  progressOutOf: string;
};

export type BetDetailData = {
  goal: string;
  colorType: Goal;
  progress: string;
  pointsYouPay: number;
  pointsYouGet: number;
  progressOutOf: string;
  moneyWon: number;
  participating: number;
  gameLost: number;
  dateFrom: string;
  dateTo: string;
};

export type PreviousBetSingleData = {
  goal: string;
  goalNumber: number;
  colorType: Goal;
  pointsYouPay: number;
  pointsYouGet: number;
  result: 'win' | 'lose';
};

export const previousBetsSampleData: Array<PreviousBetSingleData> = [
  { colorType: 'fire', pointsYouGet: 460, pointsYouPay: 230, goal: '15000 Cal in 15 days', result: 'win', goalNumber: 150000 },
  { colorType: 'both', pointsYouGet: 460, pointsYouPay: 230, goal: '15000 Cal in 15 days', result: 'lose', goalNumber: 150000 },
  { colorType: 'walking', pointsYouGet: 460, pointsYouPay: 230, goal: '15000 Cal in 15 days', result: 'win', goalNumber: 150000 },
  { colorType: 'walking', pointsYouGet: 460, pointsYouPay: 230, goal: '15000 Cal in 15 days', result: 'lose', goalNumber: 150000 },
];

export const pickofDaysSampleData: Array<PickOfTheDaySingleData> = [
  { colorType: 'fire', currentPoints: 5, goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
  { colorType: 'both', currentPoints: 5, goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
  { colorType: 'walking', currentPoints: 5, goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
  { colorType: 'walking', currentPoints: 5, goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
];

export const activeBetsSampleData: Array<ActivebetSingleData> = [
  { colorType: 'walking', progress: '20k', progressOutOf: '100k', goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
];

export const activeBetsDetailSampleData: Array<ActivebetSingleData> = [
  { colorType: 'walking', progress: '20k', progressOutOf: '100k', goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
  { colorType: 'walking', progress: '20k', progressOutOf: '100k', goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
  { colorType: 'walking', progress: '20k', progressOutOf: '100k', goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
  { colorType: 'walking', progress: '20k', progressOutOf: '100k', goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
];

export const upcomingEventsSampleData: Array<PickOfTheDaySingleData> = [
  { colorType: 'fire', currentPoints: 5, goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
  { colorType: 'both', currentPoints: 5, goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
  { colorType: 'walking', currentPoints: 5, goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
  { colorType: 'walking', currentPoints: 5, goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
  { colorType: 'fire', currentPoints: 5, goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
  { colorType: 'both', currentPoints: 5, goal: '15000 Cal in 15 days', pointsYouGet: 460, pointsYouPay: 230 },
];
