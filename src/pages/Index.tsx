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
import { collection, query, getDocs, addDoc, where, orderBy, Timestamp, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Transaction } from "@/lib/types";
import type { DashboardCardData } from "@/lib/dashboard-types";

const transformFirebaseDoc = (doc: DocumentData): Transaction => {
  const data = doc.data();
  return {
    id: doc.id,
    description: data.description || '',
    amount: Number(data.amount) || 0,
    type: data.type === 'income' ? 'income' : 'expense',
    category: data.category || '',
    date: data.date || new Date().toISOString().split('T')[0]
  };
};

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
        return snapshot.docs.map(transformFirebaseDoc);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error; // Let React Query handle the error
      }
    },
    enabled: Boolean(user?.uid)
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, 'id'> & { userId: string }) => {
      const transactionData = {
        description: String(newTransaction.description),
        amount: Number(newTransaction.amount),
        type: newTransaction.type,
        category: String(newTransaction.category),
        date: String(newTransaction.date),
        userId: String(newTransaction.userId),
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'transactions'), transactionData);
      return { id: docRef.id, ...transactionData } as Transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.uid] });
      toast({ title: "Success", description: "Transaction added successfully" });
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

  const calculateTotals = (transactions: Transaction[]) => {
    return transactions.reduce(
      (acc, t) => {
        const amount = Number(t.amount) || 0;
        if (t.type === "income") {
          acc.income += amount;
        } else {
          acc.expenses += amount;
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
        variant: "destructive",
      });
      return;
    }
    
    if (cardId === 'income') {
      const difference = newValue - totalIncome;
      if (difference !== 0) {
        const transactionData = {
          description: "Manual Income Adjustment",
          amount: Math.abs(difference),
          type: difference > 0 ? 'income' as const : 'expense' as const,
          category: "Adjustment",
          date: new Date().toISOString().split('T')[0],
          userId: user.uid
        };

        addTransactionMutation.mutate(transactionData);
      }
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