import { Button } from "@/components/ui/button";
import { TransactionList } from "@/components/TransactionList";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

const Transactions = () => {
  // Using the same mock data for now - in a real app this would come from a shared state or database
  const transactions = [
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

  const handleEdit = (transaction: Transaction) => {
    console.log("Edit transaction:", transaction);
  };

  const handleDelete = (id: number) => {
    console.log("Delete transaction:", id);
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    console.log("Reorder from", startIndex, "to", endIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Transactions</h1>
        </div>
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
    </div>
  );
};

export default Transactions;