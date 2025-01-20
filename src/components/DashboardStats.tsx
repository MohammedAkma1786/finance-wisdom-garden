import { DraggableDashboardCard } from "@/components/DraggableDashboardCard";
import { ArrowDownIcon, ArrowUpIcon, PiggyBankIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardStatsProps {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  onCardDragStart: (e: React.DragEvent, cardId: string) => void;
  onCardDragOver: (e: React.DragEvent) => void;
  onCardDrop: (e: React.DragEvent, dropCardId: string) => void;
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
  onCardDragStart,
  onCardDragOver,
  onCardDrop,
  onCardEdit,
  dashboardCards,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {dashboardCards.map((card) => (
        <DraggableDashboardCard
          key={card.id}
          title={card.title}
          value={formatCurrency(card.value)}
          icon={card.icon}
          className={card.className}
          onDragStart={(e) => onCardDragStart(e, card.id)}
          onDragOver={onCardDragOver}
          onDrop={(e) => onCardDrop(e, card.id)}
          onEdit={() => onCardEdit(card.id, card.value)}
          isEditable={card.id === 'income' || card.id === 'savings'}
        />
      ))}
    </div>
  );
}