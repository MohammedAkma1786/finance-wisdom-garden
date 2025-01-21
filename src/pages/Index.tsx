import { useState } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id || !db) return [];
        
        const transactionsRef = collection(db, 'transactions');
        const q = query(transactionsRef, where('userId', '==', user.id));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: parseInt(doc.id) || 0,
            description: String(data.description || ''),
            amount: parseFloat(data.amount) || 0,
            type: (data.type === 'income' ? 'income' : 'expense') as Transaction['type'],
            category: String(data.category || ''),
            date: String(data.date || new Date().toISOString().split('T')[0])
          };
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }
    },
    enabled: Boolean(user?.id)
  });

  const totalIncome = transactions.reduce(
    (sum, t) => t.type === "income" ? sum + t.amount : sum, 
    0
  );
  
  const totalExpenses = transactions.reduce(
    (sum, t) => t.type === "expense" ? sum + t.amount : sum, 
    0
  );
  
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

  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, 'id'> & { userId: string }) => {
      const serializedTransaction = {
        description: String(newTransaction.description),
        amount: parseFloat(String(newTransaction.amount)),
        type: newTransaction.type,
        category: String(newTransaction.category),
        date: String(newTransaction.date),
        userId: String(newTransaction.userId)
      };
      
      const docRef = await addDoc(collection(db, 'transactions'), serializedTransaction);
      return {
        ...serializedTransaction,
        id: parseInt(docRef.id)
      } as Transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    },
    onError: (error) => {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  });

  const handleCardEdit = async (cardId: string, newValue: number) => {
    if (!user?.id) return;
    
    if (cardId === 'income') {
      const difference = parseFloat(String(newValue)) - totalIncome;
      if (difference !== 0) {
        const newTransaction = {
          description: "Manual Income Adjustment",
          amount: Math.abs(difference),
          type: difference > 0 ? "income" as const : "expense" as const,
          category: "Adjustment",
          date: new Date().toISOString().split('T')[0],
          userId: user.id
        };

        addTransactionMutation.mutate(newTransaction);
      }
    }
    setEditingCard(null);
  };

  if (!user) {
    return <Auth />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHeader userName={user.name || ''} onLogout={logout} />

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
};

export default Index;