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
import { db } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Transaction } from "@/lib/types";

const Index = () => {
  const { user, logout } = useAuth();
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      
      try {
        const transactionsRef = collection(db, 'transactions');
        const q = query(transactionsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: Number(doc.id),
            description: String(data.description || ''),
            amount: Number(data.amount || 0),
            type: data.type === 'income' ? 'income' : 'expense',
            category: String(data.category || ''),
            date: String(data.date || new Date().toISOString().split('T')[0])
          } satisfies Transaction;
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }
    },
    enabled: Boolean(user?.uid)
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
      const transactionData = {
        description: String(newTransaction.description),
        amount: Number(newTransaction.amount),
        type: newTransaction.type,
        category: String(newTransaction.category),
        date: String(newTransaction.date),
        userId: String(newTransaction.userId)
      };
      
      const docRef = await addDoc(collection(db, 'transactions'), transactionData);
      
      return {
        id: Number(docRef.id),
        description: transactionData.description,
        amount: transactionData.amount,
        type: transactionData.type,
        category: transactionData.category,
        date: transactionData.date
      } satisfies Transaction;
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

  const handleCardEdit = (cardId: string, newValue: number) => {
    if (!user?.uid) return;
    
    if (cardId === 'income') {
      const difference = newValue - totalIncome;
      if (difference !== 0) {
        const newTransaction: Omit<Transaction, 'id'> & { userId: string } = {
          description: "Manual Income Adjustment",
          amount: Math.abs(difference),
          type: difference > 0 ? "income" : "expense",
          category: "Adjustment",
          date: new Date().toISOString().split('T')[0],
          userId: user.uid
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
        <DashboardHeader userName={user.displayName || ''} onLogout={logout} />

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
            queryClient.setQueryData(['transactions', user.uid], newTransactions);
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