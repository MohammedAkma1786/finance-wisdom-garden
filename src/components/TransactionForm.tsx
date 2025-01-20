import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { TransactionTypeSelector } from "./transaction-form/TransactionTypeSelector";
import { TransactionDatePicker } from "./transaction-form/TransactionDatePicker";
import { TransactionFormFields } from "./transaction-form/TransactionFormFields";

interface TransactionFormProps {
  onSubmit: (transaction: {
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
  }) => void;
  editingTransaction: {
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
  } | null;
}

export function TransactionForm({ onSubmit, editingTransaction }: TransactionFormProps) {
  const { toast } = useToast();
  const [description, setDescription] = useState(editingTransaction?.description || "");
  const [amount, setAmount] = useState(editingTransaction?.amount.toString() || "");
  const [category, setCategory] = useState(editingTransaction?.category || "");
  const [type, setType] = useState<"income" | "expense">(editingTransaction?.type || "expense");
  const [date, setDate] = useState<Date>(
    editingTransaction?.date ? new Date(editingTransaction.date) : new Date()
  );

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setType(editingTransaction.type);
      setDate(new Date(editingTransaction.date));
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: date.toISOString().split('T')[0],
    });

    if (!editingTransaction) {
      setDescription("");
      setAmount("");
      setCategory("");
      setType("expense");
      setDate(new Date());
    }
  };

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">
        {editingTransaction ? "Edit" : "Add"} Transaction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TransactionFormFields
          description={description}
          setDescription={setDescription}
          amount={amount}
          setAmount={setAmount}
          category={category}
          setCategory={setCategory}
        />
        <TransactionDatePicker date={date} setDate={setDate} />
        <TransactionTypeSelector type={type} setType={setType} />
        <Button type="submit" className="w-full">
          {editingTransaction ? "Update" : "Add"} Transaction
        </Button>
      </form>
    </Card>
  );
}