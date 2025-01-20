import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

interface ExpenseEntry {
  amount: number;
  description: string;
}

interface DayExpenses {
  [key: string]: ExpenseEntry[];
}

const CurrentPlans = () => {
  // Get expenses from localStorage or state management
  const expenses: DayExpenses = JSON.parse(localStorage.getItem("expenses") || "{}");

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(expenses).map(([date, expenseList]) => (
                <Card key={date} className="p-4">
                  <h3 className="font-semibold mb-2">{new Date(date).toLocaleDateString()}</h3>
                  {expenseList.map((expense, index) => (
                    <div key={index} className="border-t pt-2 mt-2 first:border-t-0 first:pt-0 first:mt-0">
                      <p className="text-sm text-muted-foreground">{expense.description}</p>
                      <p className="font-medium">{formatCurrency(expense.amount)}</p>
                    </div>
                  ))}
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CurrentPlans;