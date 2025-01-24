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
import { collection, query, getDocs, addDoc, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Transaction } from "@/lib/types";
import type { DashboardCardData } from "@/lib/dashboard-types";

const Index = () => {
  const { user, logout } = useAuth();
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      
      const transactionsRef = collection(db, 'transactions');
      const q = query(
        transactionsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      try {
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
          const data = doc.data();
          const type = data.type === 'income' ? 'income' as const : 'expense' as const;
          
          const transaction: Transaction = {
            id: doc.id,
            description: data.description || '',
            amount: Number(data.amount || 0),
            type,
            category: data.category || '',
            date: data.date || new Date().toISOString().split('T')[0]
          };
          
          return transaction;
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }
    },
    enabled: Boolean(user?.uid)
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, 'id'>) => {
      if (!user?.uid) throw new Error('User not authenticated');

      const transactionData = {
        description: newTransaction.description,
        amount: newTransaction.amount,
        type: newTransaction.type,
        category: newTransaction.category,
        date: newTransaction.date,
        userId: user.uid,
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'transactions'), transactionData);
      
      const transaction: Transaction = {
        id: docRef.id,
        description: transactionData.description,
        amount: transactionData.amount,
        type: transactionData.type,
        category: transactionData.category,
        date: transactionData.date
      };

      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.uid] });
      toast({
        title: "Success",
        description: "Transaction added successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive"
      });
    }
  });

  const calculateTotals = (transactions: Transaction[]) => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === "income") {
          acc.income += t.amount;
        } else {
          acc.expenses += t.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0 }
    );
  };

  const { income: totalIncome, expenses: totalExpenses } = calculateTotals(transactions);
  const savings = totalIncome - totalExpenses;

  const handleCardEdit = (cardId: string, newValue: number) => {
    if (!user?.uid || isNaN(newValue)) {
      toast({
        title: "Error",
        description: "Invalid value provided",
        variant: "destructive"
      });
      return;
    }
    
    const difference = newValue - totalIncome;
    if (cardId === 'income' && difference !== 0) {
      const adjustmentTransaction: Omit<Transaction, 'id'> = {
        description: "Manual Income Adjustment",
        amount: Math.abs(difference),
        type: difference > 0 ? 'income' : 'expense',
        category: "Adjustment",
        date: new Date().toISOString().split('T')[0]
      };
      
      addTransactionMutation.mutate(adjustmentTransaction);
    }
    setEditingCard(null);
  };

  const dashboardCards: DashboardCardData[] = [
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

  if (!user) return <Auth />;
  if (isLoading) return <div>Loading...</div>;

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