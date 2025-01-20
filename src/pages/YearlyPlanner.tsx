import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export interface ExpenseEntry {
  amount: number;
  description: string;
  title: string;
  recurringMonths: number;
  createdAt: string;
}

export interface DayExpenses {
  [date: string]: ExpenseEntry[];
}

const YearlyPlanner = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [recurringMonths, setRecurringMonths] = useState("");

  const handleSaveExpense = () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your expense",
        variant: "destructive",
      });
      return;
    }

    const months = recurringMonths ? parseInt(recurringMonths) : 1;
    
    const expense: ExpenseEntry = {
      amount: Number(amount),
      description,
      title,
      recurringMonths: months,
      createdAt: new Date().toISOString(),
    };

    // Get existing expenses from localStorage
    const existingExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    
    // Add new expense
    localStorage.setItem("expenses", JSON.stringify([...existingExpenses, expense]));
    
    toast({
      title: "Expense saved",
      description: "Your expense has been successfully recorded.",
    });

    // Navigate to current plans page
    navigate("/current-plans");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Yearly Expense Planner</h1>
          <Link to="/current-plans">
            <Button variant="outline">View Current Plans</Button>
          </Link>
        </div>

        <Card className="p-6">
          <div className="grid gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      placeholder="Enter planner title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      placeholder="Enter planner description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="max-w-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Amount ($)</label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Recurring Months</label>
                    <Input
                      type="number"
                      placeholder="Number of months (optional)"
                      value={recurringMonths}
                      onChange={(e) => setRecurringMonths(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>

                  <Button onClick={handleSaveExpense}>Save Expense</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default YearlyPlanner;