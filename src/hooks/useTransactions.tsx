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
      if (!user || !db) return [];
      const q = query(collection(db, 'transactions'), where('userId', '==', user.id));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: parseInt(doc.id),
        type: doc.data().type as "income" | "expense"
      })) as Transaction[];
    },
    enabled: !!user && !!db
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, 'id'>) => {
      const docRef = await addDoc(collection(db, 'transactions'), newTransaction);
      return { ...newTransaction, id: parseInt(docRef.id) };
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
    transactions,
    isLoading,
    addTransaction: addTransactionMutation.mutate
  };
};