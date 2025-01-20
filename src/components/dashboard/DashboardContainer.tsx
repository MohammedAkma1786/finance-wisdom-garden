import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardOverview } from "@/components/DashboardOverview";
import { DashboardStats } from "@/components/DashboardStats";
import { TransactionManager } from "@/components/TransactionManager";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Transaction } from "@/hooks/useTransactions";
import { useQueryClient } from "@tanstack/react-query";
import { EditValueDialog } from "@/components/EditValueDialog";
import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, PiggyBankIcon } from "lucide-react";

interface DashboardContainerProps {
  user: {
    id: string;
    name: string | null;
  };
  transactions: Transaction[];
  onLogout: () => void;
}

export function DashboardContainer({ user, transactions, onLogout }: DashboardContainerProps) {
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const totalIncome = transactions.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum, 0);
  const totalExpenses = transactions.reduce((sum, t) => t.type === "expense" ? sum + t.amount : sum, 0);
  const savings = totalIncome - totalExpenses;

  const dashboardCards = [
    {
      id: "income",
      title: "Total Income",
      value: totalIncome,
      icon: <ArrowUpIcon className="h-4 w-4 text-secondary" />,
      className: "border-l-secondary"
    },
    {
      id: "expenses",
      title: "Total Expenses",
      value: totalExpenses,
      icon: <ArrowDownIcon className="h-4 w-4 text-destructive" />,
      className: "border-l-destructive"
    },
    {
      id: "savings",
      title: "Savings",
      value: savings,
      icon: <PiggyBankIcon className="h-4 w-4 text-primary" />,
      className: "border-l-primary"
    }
  ];

  const handleCardEdit = async (cardId: string, newValue: number) => {
    if (cardId === 'income') {
      const difference = newValue - totalIncome;
      if (difference !== 0) {
        queryClient.setQueryData(['transactions', user.id], (prev: Transaction[] = []) => [
          ...prev,
          {
            id: Date.now(),
            description: "Manual Income Adjustment",
            amount: Math.abs(difference),
            type: difference > 0 ? "income" : "expense",
            category: "Adjustment",
            date: new Date().toISOString().split('T')[0],
            userId: user.id
          }
        ]);
      }
    }
    setEditingCard(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHeader userName={user.name || 'User'} onLogout={onLogout} />
        <DashboardOverview transactions={transactions} />
        <DashboardStats
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          savings={savings}
          onCardEdit={(cardId) => setEditingCard(cardId)}
          dashboardCards={dashboardCards}
        />

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Transactions</h3>
          <Link to="/transactions">
            <Button variant="outline">View All Transactions</Button>
          </Link>
        </div>

        <TransactionManager 
          transactions={transactions}
          setTransactions={(newTransactions) => {
            queryClient.setQueryData(['transactions', user.id], newTransactions);
          }}
        />
      </div>

      {editingCard && (
        <EditValueDialog
          isOpen={true}
          onClose={() => setEditingCard(null)}
          onSave={(value) => handleCardEdit(editingCard, value)}
          initialValue={editingCard === 'income' ? totalIncome : savings}
          title={editingCard === 'income' ? 'Total Income' : 'Savings'}
        />
      )}
    </div>
  );
}