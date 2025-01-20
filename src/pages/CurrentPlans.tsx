import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import type { ExpenseEntry } from "./YearlyPlanner";

const CurrentPlans = () => {
  // Get expenses from localStorage
  const expenses: ExpenseEntry[] = JSON.parse(localStorage.getItem("expenses") || "[]");

  const calculateTotalExpense = (expense: ExpenseEntry) => {
    return expense.amount * expense.recurringMonths;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/planner">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Current Plans</h1>
          <div className="w-10" />
        </div>

        <Card className="p-6">
          <div className="grid gap-6">
            {expenses.length === 0 ? (
              <p className="text-center text-muted-foreground">No expenses added yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expenses.map((expense, index) => (
                  <Card key={index} className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{expense.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{expense.description}</p>
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium">Monthly Amount:</span>{" "}
                        {formatCurrency(expense.amount)}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {expense.recurringMonths} month{expense.recurringMonths !== 1 ? "s" : ""}
                      </p>
                      <p className="text-lg font-semibold mt-2">
                        Total: {formatCurrency(calculateTotalExpense(expense))}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CurrentPlans;