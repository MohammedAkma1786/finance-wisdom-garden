import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, query, getDocs, addDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  userId?: string;
}

export const useTransactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user?.id || !db) return [];
      
      try {
        const q = query(collection(db, 'transactions'), where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);
        
        // Ensure we return only serializable data
        return querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: parseInt(doc.id) || Date.now(),
            description: String(data.description || ''),
            amount: Number(data.amount) || 0,
            type: (data.type === 'income' ? 'income' : 'expense') as 'income' | 'expense',
            category: String(data.category || ''),
            date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
            userId: String(data.userId || '')
          };
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }
    },
    enabled: !!user?.id && !!db,
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, 'id'>) => {
      if (!db) throw new Error('Database not initialized');
      
      // Ensure we're only sending serializable data
      const serializedTransaction = {
        description: String(newTransaction.description || ''),
        amount: Number(newTransaction.amount) || 0,
        type: newTransaction.type === 'income' ? 'income' : 'expense',
        category: String(newTransaction.category || ''),
        date: String(newTransaction.date || new Date().toISOString().split('T')[0]),
        userId: String(newTransaction.userId || '')
      };
      
      const docRef = await addDoc(collection(db, 'transactions'), serializedTransaction);
      
      return {
        ...serializedTransaction,
        id: parseInt(docRef.id) || Date.now()
      };
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

  return {
    transactions: transactions as Transaction[],
    isLoading,
    addTransaction: addTransactionMutation.mutate
  };
};