import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlannerGrid } from "@/components/PlannerGrid";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export interface ExpenseEntry {
  amount: number;
  description: string;
}

export interface DayExpenses {
  [key: string]: ExpenseEntry[];
}

const YearlyPlanner = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [expenses, setExpenses] = useState<DayExpenses>({});
  const [yearlyGoal, setYearlyGoal] = useState("");

  const handleSaveExpense = (date: Date, expense: ExpenseEntry) => {
    const dateKey = date.toISOString().split('T')[0];
    setExpenses(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), expense]
    }));
    
    toast({
      title: "Expense saved",
      description: "Your expense has been successfully recorded.",
    });
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
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Yearly Financial Goal</label>
            <Input
              value={yearlyGoal}
              onChange={(e) => setYearlyGoal(e.target.value)}
              placeholder="Enter your financial goal for the year"
              className="max-w-md"
            />
          </div>
        </Card>

        <PlannerGrid
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          expenses={expenses}
          onSaveExpense={handleSaveExpense}
        />
      </div>
    </div>
  );
};

export default YearlyPlanner;