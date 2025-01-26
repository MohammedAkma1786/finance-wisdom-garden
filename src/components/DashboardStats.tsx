import { DashboardCard } from "@/components/DashboardCard";
import { ArrowDownIcon, ArrowUpIcon, PiggyBankIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardStatsProps {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  onCardEdit: (cardId: string, value: number) => void;
  dashboardCards: Array<{
    id: string;
    title: string;
    value: number;
    icon: React.ReactNode;
    className: string;
  }>;
}

export function DashboardStats({
  onCardEdit,
  dashboardCards,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {dashboardCards.map((card) => (
        <div key={card.id} className="h-[140px]">
          <DashboardCard 
            title={card.title}
            value={formatCurrency(card.value)}
            icon={card.icon}
            className={card.className}
            onEdit={card.id === 'income' || card.id === 'savings' ? () => onCardEdit(card.id, card.value) : undefined}
          />
        </div>
      ))}
    </div>
  );
}