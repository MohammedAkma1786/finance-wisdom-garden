import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

interface TransactionManagerProps {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

export function TransactionManager({ transactions, setTransactions }: TransactionManagerProps) {
  const { toast } = useToast();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleTransactionSubmit = (transaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      const updatedTransactions = transactions.map((t) =>
        t.id === editingTransaction.id
          ? { ...transaction, id: editingTransaction.id }
          : t
      );
      setTransactions(updatedTransactions);
      setEditingTransaction(null);
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } else {
      const newTransaction: Transaction = {
        ...transaction,
        id: transactions.length + 1,
      };
      setTransactions([newTransaction, ...transactions]);
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast({
      title: "Success",
      description: "Transaction deleted successfully",
    });
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    const reorderedTransactions = [...transactions];
    const [removed] = reorderedTransactions.splice(startIndex, 1);
    reorderedTransactions.splice(endIndex, 0, removed);
    setTransactions(reorderedTransactions);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <TransactionForm
        onSubmit={handleTransactionSubmit}
        editingTransaction={editingTransaction}
      />
      
      <Card className="p-4 sm:p-6">
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