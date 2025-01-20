import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { TransactionManager } from "@/components/TransactionManager";
import type { Transaction } from "@/types/transaction";

interface User {
  id: string;
}

export default function Index() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user] = useState<User>({ id: "test-user" });
  const { toast } = useToast();

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user?.id || !db) return;

      try {
        const q = query(collection(db, 'transactions'), where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);
        
        const loadedTransactions = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: parseInt(doc.id),
            description: data.description ? String(data.description) : "",
            amount: data.amount ? Number(data.amount) : 0,
            type: data.type === "income" ? "income" : "expense",
            category: data.category ? String(data.category) : "",
            date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
            userId: data.userId ? String(data.userId) : user.id
          } as Transaction;
        });
        
        setTransactions(loadedTransactions);
      } catch (error) {
        console.error("Error loading transactions:", error);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      }
    };

    loadTransactions();
  }, [user, toast]);

  const handleUpdateTransactions = async (newTransactions: Transaction[]) => {
    if (!user?.id || !db) return;

    try {
      // Process each transaction before adding to Firestore
      for (const transaction of newTransactions) {
        const firestoreData = {
          description: String(transaction.description),
          amount: Number(transaction.amount),
          type: transaction.type,
          category: String(transaction.category),
          date: String(transaction.date),
          userId: String(user.id)
        };
        await addDoc(collection(db, 'transactions'), firestoreData);
      }

      setTransactions(newTransactions);
      toast({
        title: "Success",
        description: "Transactions updated successfully",
      });
    } catch (error) {
      console.error("Error updating transactions:", error);
      toast({
        title: "Error",
        description: "Failed to update transactions",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Transaction Manager</h1>
      <TransactionManager
        transactions={transactions}
        setTransactions={handleUpdateTransactions}
      />
    </div>
  );
}