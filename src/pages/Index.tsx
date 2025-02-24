
import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Auth } from "@/components/Auth";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { TransactionManager } from "@/components/TransactionManager";
import { EditValueDialog } from "@/components/EditValueDialog";
import { ArrowDownIcon, ArrowUpIcon, PiggyBankIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  const [manualIncome, setManualIncome] = useState<number | null>(null);
  const [manualSavings, setManualSavings] = useState<number | null>(null);

  // Calculate totals
  const calculatedIncome = transactions.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum, 0);
  const totalExpenses = transactions.reduce((sum, t) => t.type === "expense" ? sum + t.amount : sum, 0);
  
  const totalIncome = manualIncome !== null ? manualIncome : calculatedIncome;
  const savings = manualSavings !== null ? manualSavings : (totalIncome - totalExpenses);

  // Use useMemo to create dashboardCards that updates when values change
  const dashboardCards = useMemo(() => [
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
  ], [totalIncome, totalExpenses, savings]);

  const handleCardEdit = (cardId: string) => {
    setEditingCard(cardId);
  };

  const handleSaveEdit = (newValue: number) => {
    if (editingCard === 'income') {
      setManualIncome(newValue);
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
      setManualSavings(newValue);
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

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <DashboardHeader userName={user.name} onLogout={logout} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Financial Dashboard</h2>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <Link to="/planner" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">Expense Planner</Button>
            </Link>
            <Link to="/subscriptions" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">Subscription Tracker</Button>
            </Link>
          </div>
        </div>

        <DashboardStats
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          savings={savings}
          onCardEdit={handleCardEdit}
          dashboardCards={dashboardCards}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg sm:text-xl font-semibold">Recent Transactions</h3>
          <Link to="/transactions" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">View All Transactions</Button>
          </Link>
        </div>

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
