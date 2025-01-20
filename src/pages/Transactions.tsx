import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

const Transactions = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const toggleTransaction = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Transactions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.map((transaction) => (
            <Card
              key={transaction.id}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleTransaction(transaction.id)}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{transaction.description}</h3>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                
                {expandedId === transaction.id && (
                  <div className="pt-2 space-y-2 border-t">
                    <p className="text-sm text-muted-foreground">Category: {transaction.category}</p>
                    <p className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;