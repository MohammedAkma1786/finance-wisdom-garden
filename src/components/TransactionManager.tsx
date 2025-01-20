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

  const handleTransactionSubmit = (transaction: Omit<Transaction, 'id'>) => {
    if (!user?.id) return;

    const newTransaction = {
      ...transaction,
      userId: user.id,
    };

    addTransaction(newTransaction);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    const reorderedTransactions = [...transactions];
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