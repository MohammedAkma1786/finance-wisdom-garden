import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlannerGrid } from "@/components/PlannerGrid";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export interface ExpenseEntry {
  amount: number;
  description: string;
}

export interface DayExpenses {
  [key: string]: ExpenseEntry[];
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YearlyPlanner = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [expenses, setExpenses] = useState<DayExpenses>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleMonthSelect = (monthIndex: string) => {
    setSelectedMonth(monthIndex);
    navigate(`/planner/${monthIndex}`);
  };

  const handleSaveExpense = () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const dateKey = selectedDate.toISOString().split('T')[0];
    const expense: ExpenseEntry = {
      amount: Number(amount),
      description: description
    };

    setExpenses(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), expense]
    }));
    
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
              <h2 className="text-lg font-semibold">Select a Month</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {months.map((month, index) => (
                  <Button
                    key={month}
                    variant={selectedMonth === String(index) ? "default" : "outline"}
                    className="h-24 text-lg font-medium"
                    onClick={() => handleMonthSelect(String(index))}
                  >
                    {month}
                  </Button>
                ))}
              </div>
              <div className="space-y-4 mt-6">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="max-w-xs"
                />
                <Button onClick={handleSaveExpense}>Save Expense</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default YearlyPlanner;