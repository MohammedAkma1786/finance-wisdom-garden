import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Auth } from "@/components/Auth";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { TransactionManager } from "@/components/TransactionManager";
import { EditValueDialog } from "@/components/EditValueDialog";
import { ArrowDownIcon, ArrowUpIcon, PiggyBankIcon } from "lucide-react";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

const Index = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [editingCard, setEditingCard] = useState<string | null>(null);

  // Calculate totals
  const totalIncome = transactions.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum, 0);
  const totalExpenses = transactions.reduce((sum, t) => t.type === "expense" ? sum + t.amount : sum, 0);
  const savings = totalIncome - totalExpenses;

  const [dashboardCards] = useState([
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
  ]);

  const handleCardEdit = (cardId: string) => {
    setEditingCard(cardId);
  };

  // Add drag and drop handlers
  const handleCardDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData("cardId", cardId);
  };

  const handleCardDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCardDrop = (e: React.DragEvent, dropCardId: string) => {
    e.preventDefault();
    const draggedCardId = e.dataTransfer.getData("cardId");
    if (draggedCardId === dropCardId) return;
    
    // For now, we'll just console log the drag and drop action
    console.log(`Dragged ${draggedCardId} onto ${dropCardId}`);
  };

  const handleSaveEdit = (newValue: number) => {
    if (editingCard === 'income') {
      const difference = newValue - totalIncome;
      if (difference !== 0) {
        const newTransaction: Transaction = {
          id: transactions.length + 1,
          description: "Manual Income Adjustment",
          amount: Math.abs(difference),
          type: difference > 0 ? "income" : "expense",
          category: "Adjustment",
          date: new Date().toISOString().split('T')[0],
        };
        setTransactions([newTransaction, ...transactions]);
      }
    } else if (editingCard === 'savings') {
      const difference = newValue - savings;
      if (difference !== 0) {
        const newTransaction: Transaction = {
          id: transactions.length + 1,
          description: "Manual Savings Adjustment",
          amount: Math.abs(difference),
          type: difference > 0 ? "income" : "expense",
          category: "Savings Adjustment",
          date: new Date().toISOString().split('T')[0],
        };
        setTransactions([newTransaction, ...transactions]);
      }
    }
    
    setEditingCard(null);
  };

  // Early return for unauthenticated users
  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHeader userName={user.name} onLogout={logout} />

        <DashboardStats
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          savings={savings}
          onCardEdit={handleCardEdit}
          dashboardCards={dashboardCards}
          onCardDragStart={handleCardDragStart}
          onCardDragOver={handleCardDragOver}
          onCardDrop={handleCardDrop}
        />

        <TransactionManager 
          transactions={transactions}
          setTransactions={setTransactions}
        />
      </div>

      {editingCard && (
        <EditValueDialog
          isOpen={true}
          onClose={() => setEditingCard(null)}
          onSave={handleSaveEdit}
          initialValue={editingCard === 'income' ? totalIncome : savings}
          title={editingCard === 'income' ? 'Total Income' : 'Savings'}
        />
      )}
    </div>
  );
};

const mockTransactions = [
  {
    id: 1,
    description: "Salary",
    amount: 5000,
    type: "income" as const,
    category: "Income",
    date: "2024-03-15",
  },
  {
    id: 2,
    description: "Rent",
    amount: 1500,
    type: "expense" as const,
    category: "Housing",
    date: "2024-03-14",
  },
  {
    id: 3,
    description: "Groceries",
    amount: 200,
    type: "expense" as const,
    category: "Food",
    date: "2024-03-13",
  },
];

export default Index;