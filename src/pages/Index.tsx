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
          const transactionType = data.type === "income" ? "income" : "expense";
          
          return {
            id: Number(doc.id),
            description: String(data.description || ""),
            amount: Number(data.amount || 0),
            type: transactionType,
            category: String(data.category || ""),
            date: String(data.date || new Date().toISOString().split('T')[0]),
            userId: String(data.userId || "")
          };
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
      const processedTransactions = newTransactions.map(t => ({
        description: String(t.description),
        amount: Number(t.amount),
        type: t.type === "income" ? "income" : "expense",
        category: String(t.category),
        date: String(t.date),
        userId: String(user.id)
      }));

      for (const transaction of processedTransactions) {
        await addDoc(collection(db, 'transactions'), transaction);
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