import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useAuth } from "@/contexts/AuthContext";

interface TransactionManagerProps {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

export function TransactionManager({ transactions, setTransactions }: TransactionManagerProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { user } = useAuth();
  const { addTransaction } = useTransactions();

  const handleTransactionSubmit = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user?.id) return;

    // Create a serializable transaction object
    const newTransaction = {
      description: transaction.description || '',
      amount: Number(transaction.amount) || 0,
      type: transaction.type,
      category: transaction.category || '',
      date: transaction.date || new Date().toISOString().split('T')[0],
      userId: user.id,
    };

    addTransaction(newTransaction);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    // Create a serializable copy of the transaction
    const serializableTransaction = {
      id: transaction.id,
      description: transaction.description || '',
      amount: Number(transaction.amount) || 0,
      type: transaction.type,
      category: transaction.category || '',
      date: transaction.date || new Date().toISOString().split('T')[0],
      userId: transaction.userId || '',
    };
    setEditingTransaction(serializableTransaction);
  };

  const handleDelete = (id: number) => {
    // Create a new array with serializable transaction objects
    const updatedTransactions = transactions
      .filter((t) => t.id !== id)
      .map(t => ({
        id: t.id,
        description: t.description || '',
        amount: Number(t.amount) || 0,
        type: t.type,
        category: t.category || '',
        date: t.date || new Date().toISOString().split('T')[0],
        userId: t.userId || '',
      }));
    setTransactions(updatedTransactions);
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    // Create a new array with serializable transaction objects
    const reorderedTransactions = [...transactions].map(t => ({
      id: t.id,
      description: t.description || '',
      amount: Number(t.amount) || 0,
      type: t.type,
      category: t.category || '',
      date: t.date || new Date().toISOString().split('T')[0],
      userId: t.userId || '',
    }));
    const [removed] = reorderedTransactions.splice(startIndex, 1);
    reorderedTransactions.splice(endIndex, 0, removed);
    setTransactions(reorderedTransactions);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TransactionForm
        onSubmit={handleTransactionSubmit}
        editingTransaction={editingTransaction}
      />
      
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Transactions</h2>
        <TransactionList 
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </Card>
    </div>
  );
}