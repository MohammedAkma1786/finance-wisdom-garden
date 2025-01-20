import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface TransactionFormProps {
  onSubmit: (transaction: {
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
  }) => void;
  editingTransaction: {
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
  } | null;
}

export function TransactionForm({ onSubmit, editingTransaction }: TransactionFormProps) {
  const { toast } = useToast();
  const [description, setDescription] = useState(editingTransaction?.description || "");
  const [amount, setAmount] = useState(editingTransaction?.amount.toString() || "");
  const [category, setCategory] = useState(editingTransaction?.category || "");
  const [type, setType] = useState<"income" | "expense">(editingTransaction?.type || "expense");

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
    });

    setDescription("");
    setAmount("");
    setCategory("");
    setType("expense");
  };

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              onClick={() => setType("expense")}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              onClick={() => setType("income")}
            >
              Income
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full">
          {editingTransaction ? "Update" : "Add"} Transaction
        </Button>
      </form>
    </Card>
  );
}