import { ReactNode } from 'react';

export interface DashboardCardData {
  id: string;
  title: string;
  value: number;
  icon: ReactNode;
  className: string;
}

export interface DashboardStatsProps {
  onCardEdit: (cardId: string, value: number) => void;
  dashboardCards: DashboardCardData[];
}