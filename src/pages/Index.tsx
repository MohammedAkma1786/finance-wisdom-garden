import { TransactionList } from "@/components/TransactionList";
import { Card } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, PiggyBankIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Auth } from "@/components/Auth";
import { TransactionForm } from "@/components/TransactionForm";
import { DashboardStats } from "@/components/DashboardStats";
import { EditValueDialog } from "@/components/EditValueDialog";

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
  const { toast } = useToast();
  
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);

  // Calculate totals
  const totalIncome = transactions.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum, 0);
  const totalExpenses = transactions.reduce((sum, t) => t.type === "expense" ? sum + t.amount : sum, 0);
  const savings = totalIncome - totalExpenses;

  const handleTransactionSubmit = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: transactions.length + 1,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions([newTransaction, ...transactions]);
    toast({
      title: "Success",
      description: "Transaction added successfully",
    });
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast({
      title: "Success",
      description: "Transaction deleted successfully",
    });
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    const reorderedTransactions = [...transactions];
    const [removed] = reorderedTransactions.splice(startIndex, 1);
    reorderedTransactions.splice(endIndex, 0, removed);
    setTransactions(reorderedTransactions);
  };

  const [dashboardCards, setDashboardCards] = useState([
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

  const handleCardEdit = (cardId: string, currentValue: number) => {
    setEditingCard(cardId);
  };

  const handleSaveEdit = (newValue: number) => {
    if (editingCard === 'income') {
      // Add a new income transaction
      const newTransaction: Transaction = {
        id: transactions.length + 1,
        description: "Manual Income Adjustment",
        amount: newValue - totalIncome,
        type: "income",
        category: "Income",
        date: new Date().toISOString().split('T')[0],
      };
      setTransactions([newTransaction, ...transactions]);
      toast({
        title: "Success",
        description: "Income updated successfully",
      });
    } else if (editingCard === 'savings') {
      // Add a new savings transaction
      const newTransaction: Transaction = {
        id: transactions.length + 1,
        description: "Manual Savings Adjustment",
        amount: newValue - savings,
        type: newValue > savings ? "income" : "expense",
        category: "Savings",
        date: new Date().toISOString().split('T')[0],
      };
      setTransactions([newTransaction, ...transactions]);
      toast({
        title: "Success",
        description: "Savings updated successfully",
      });
    }
    setEditingCard(null);
  };

  const handleCardDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCardDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCardDrop = (e: React.DragEvent, dropCardId: string) => {
    e.preventDefault();
    const dragCardId = e.dataTransfer.getData('cardId');
    
    if (dragCardId !== dropCardId) {
      const dragIndex = dashboardCards.findIndex(card => card.id === dragCardId);
      const dropIndex = dashboardCards.findIndex(card => card.id === dropCardId);
      
      const newCards = [...dashboardCards];
      const [removed] = newCards.splice(dragIndex, 1);
      newCards.splice(dropIndex, 0, removed);
      
      setDashboardCards(newCards);
      toast({
        title: "Success",
        description: "Dashboard card order updated",
      });
    }
  };

  // Early return for unauthenticated users
  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>

        <DashboardStats
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          savings={savings}
          onCardDragStart={handleCardDragStart}
          onCardDragOver={handleCardDragOver}
          onCardDrop={handleCardDrop}
          onCardEdit={handleCardEdit}
          dashboardCards={dashboardCards}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TransactionForm
            onSubmit={handleTransactionSubmit}
            editingTransaction={editingTransaction}
          />
          
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
            <TransactionList 
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReorder={handleReorder}
            />
          </Card>
        </div>
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