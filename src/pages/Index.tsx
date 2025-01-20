import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Auth } from "@/components/Auth";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { TransactionManager } from "@/components/TransactionManager";
import { EditValueDialog } from "@/components/EditValueDialog";
import { ArrowDownIcon, ArrowUpIcon, PiggyBankIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { collection, query, getDocs, addDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/types/transaction";

const Index = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user?.id || !db) return;

      try {
        const q = query(collection(db, 'transactions'), where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);
        const loadedTransactions = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Ensure type is explicitly cast as "income" | "expense"
          const transactionType = data.type === "income" ? "income" : "expense";
          
          return {
            id: parseInt(doc.id),
            description: String(data.description || ""),
            amount: Number(data.amount || 0),
            type: transactionType,
            category: String(data.category || ""),
            date: String(data.date || new Date().toISOString().split('T')[0]),
            userId: String(data.userId || "")
          } as Transaction;
        });
        
        setTransactions(loadedTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      }
    };

    loadTransactions();
  }, [user]);

  const totalIncome = transactions.reduce((sum, t) => 
    t.type === "income" ? sum + Number(t.amount) : sum, 0);
  const totalExpenses = transactions.reduce((sum, t) => 
    t.type === "expense" ? sum + Number(t.amount) : sum, 0);
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

  const handleSaveEdit = async (newValue: number) => {
    if (!user?.id || !db) return;

    if (editingCard === 'income') {
      const difference = newValue - totalIncome;
      if (difference !== 0) {
        try {
          const newTransaction: Omit<Transaction, 'id'> = {
            description: "Manual Income Adjustment",
            amount: Math.abs(difference),
            type: difference > 0 ? "income" : "expense",
            category: "Adjustment",
            date: new Date().toISOString().split('T')[0],
            userId: user.id
          };

          const docRef = await addDoc(collection(db, 'transactions'), newTransaction);
          
          const updatedTransaction: Transaction = {
            ...newTransaction,
            id: transactions.length + 1
          };
          
          setTransactions(prev => [...prev, updatedTransaction]);
          
          toast({
            title: "Success",
            description: "Income adjusted successfully",
          });
        } catch (error) {
          console.error('Error saving adjustment:', error);
          toast({
            title: "Error",
            description: "Failed to save adjustment",
            variant: "destructive",
          });
        }
      }
    }
    
    setEditingCard(null);
  };

  const handleUpdateTransactions = async (newTransactions: Transaction[]) => {
    if (!user?.id || !db) return;

    try {
      // Ensure all transactions have the correct type
      const processedTransactions = newTransactions.map(t => ({
        ...t,
        amount: Number(t.amount),
        type: t.type === "income" ? "income" : "expense" as const,
        date: String(t.date),
        userId: user.id
      })) as Transaction[];

      // Update Firestore with the new transactions
      for (const transaction of processedTransactions) {
        if (!transactions.find(t => t.id === transaction.id)) {
          await addDoc(collection(db, 'transactions'), transaction);
        }
      }

      setTransactions(processedTransactions);
      toast({
        title: "Success",
        description: "Transactions updated successfully",
      });
    } catch (error) {
      console.error('Error updating transactions:', error);
      toast({
        title: "Error",
        description: "Failed to update transactions",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHeader userName={user.name} onLogout={logout} />

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Financial Dashboard</h2>
          <div className="space-x-4">
            <Link to="/planner">
              <Button variant="outline">Expense Planner</Button>
            </Link>
            <Link to="/subscriptions">
              <Button variant="outline">Subscription Tracker</Button>
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

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Transactions</h3>
          <Link to="/transactions">
            <Button variant="outline">View All Transactions</Button>
          </Link>
        </div>

        <TransactionManager 
          transactions={transactions}
          setTransactions={handleUpdateTransactions}
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

export default Index;