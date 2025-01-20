import { DashboardCard } from "@/components/DashboardCard";
import { TransactionList } from "@/components/TransactionList";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, PiggyBankIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Auth } from "@/components/Auth";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

const Index = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  if (!user) {
    return <Auth />;
  }

  const totalIncome = transactions.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum, 0);
  const totalExpenses = transactions.reduce((sum, t) => t.type === "expense" ? sum + t.amount : sum, 0);
  const savings = totalIncome - totalExpenses;

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

    if (editingTransaction) {
      const updatedTransactions = transactions.map((t) =>
        t.id === editingTransaction.id
          ? {
              ...t,
              description,
              amount: parseFloat(amount),
              type,
              category,
            }
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
        id: transactions.length + 1,
        description,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date().toISOString().split('T')[0],
      };
      setTransactions([newTransaction, ...transactions]);
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    }

    setDescription("");
    setAmount("");
    setCategory("");
    setType("expense");
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setCategory(transaction.category);
    setType(transaction.type);
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast({
      title: "Success",
      description: "Transaction deleted successfully",
    });
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    const result = Array.from(transactions);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setTransactions(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            icon={<ArrowUpIcon className="h-4 w-4 text-secondary" />}
            className="border-l-4 border-l-secondary"
          />
          <DashboardCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            icon={<ArrowDownIcon className="h-4 w-4 text-destructive" />}
            className="border-l-4 border-l-destructive"
          />
          <DashboardCard
            title="Savings"
            value={formatCurrency(savings)}
            icon={<PiggyBankIcon className="h-4 w-4 text-primary" />}
            className="border-l-4 border-l-primary"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
                Add Transaction
              </Button>
            </form>
          </Card>
          
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
            <TransactionList 
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReorder={handleReorder}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

const mockTransactions = [
  {
    id: 1,
    description: "Salary",
    amount: 5000,
    type: "income" as const,
    category: "Income",
    date: "2024-03-15",
  },
  {
    id: 2,
    description: "Rent",
    amount: 1500,
    type: "expense" as const,
    category: "Housing",
    date: "2024-03-14",
  },
  {
    id: 3,
    description: "Groceries",
    amount: 200,
    type: "expense" as const,
    category: "Food",
    date: "2024-03-13",
  },
];

export default Index;