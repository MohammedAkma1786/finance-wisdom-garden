import { ReactNode } from 'react';

export interface DashboardCardData {
  id: string;
  title: string;
  value: number;
  icon: ReactNode;
  className: string;
}

export interface DashboardStatsProps {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  onCardEdit: (cardId: string, value: number) => void;
  dashboardCards: DashboardCardData[];
}