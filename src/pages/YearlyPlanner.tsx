import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlannerGrid } from "@/components/PlannerGrid";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [expenses, setExpenses] = useState<DayExpenses>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleMonthSelect = (monthIndex: string) => {
    setSelectedMonth(monthIndex);
    setShowCalendar(true);
    setShowDetails(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowDetails(true);
  };

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
          <div className="w-10" />
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
            </div>
          </div>
        </Card>

        {showCalendar && (
          <PlannerGrid
            selectedDate={selectedDate}
            setSelectedDate={handleDateSelect}
            expenses={expenses}
            onSaveExpense={handleSaveExpense}
          />
        )}

        {showDetails && (
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter planner title"
                  className="bg-white border-gray-200 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter planner description"
                  className="bg-white border-gray-200 focus:border-primary resize-none h-24"
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default YearlyPlanner;