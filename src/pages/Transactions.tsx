import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Pencil, Trash2, ChevronDown, ChevronUp, Search } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

const Transactions = () => {
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

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (transaction: Transaction) => {
    console.log("Edit transaction:", transaction);
  };

  const handleDelete = (id: number) => {
    console.log("Delete transaction:", id);
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.date.includes(searchQuery)
  );

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

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTransactions.map((transaction) => (
              <Card 
                key={transaction.id} 
                className={cn(
                  "p-4 hover:shadow-lg transition-all duration-300 cursor-pointer",
                  expandedId === transaction.id ? "shadow-lg" : ""
                )}
                onClick={() => toggleExpand(transaction.id)}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{transaction.description}</h3>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(transaction.id);
                      }}
                    >
                      {expandedId === transaction.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {expandedId === transaction.id && (
                    <div className="pt-2 space-y-2 animate-fade-in">
                      <p className="text-sm text-muted-foreground">Category: {transaction.category}</p>
                      <div className="flex justify-between items-center">
                        <span
                          className={cn(
                            "font-medium",
                            transaction.type === "income" ? "text-secondary" : "text-destructive"
                          )}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(transaction);
                            }}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(transaction.id);
                            }}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Transactions;