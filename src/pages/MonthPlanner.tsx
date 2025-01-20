import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlannerGrid } from "@/components/PlannerGrid";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ExpenseEntry, DayExpenses } from "./YearlyPlanner";
import { useNavigate } from "react-router-dom";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MonthPlanner = () => {
  const { monthId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [expenses, setExpenses] = useState<DayExpenses>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [recurringMonths, setRecurringMonths] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDates([date]);
    setShowDetails(true);
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

    const existingExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    localStorage.setItem("expenses", JSON.stringify([...existingExpenses, expense]));
    
    toast({
      title: "Expense saved",
      description: "Your expense has been successfully recorded.",
    });

    navigate("/current-plans");
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
          <h1 className="text-2xl font-bold">
            {monthId !== undefined ? months[parseInt(monthId)] : ''} Expense Planner
          </h1>
          <Link to="/current-plans">
            <Button variant="outline">View Current Plans</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Select start date
            </p>
            <PlannerGrid
              selectedDates={selectedDates}
              setSelectedDate={handleDateSelect}
              expenses={expenses}
              onSaveExpense={handleSaveExpense}
              recurringMonths={recurringMonths}
            />
          </Card>

          {showDetails && (
            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Add New Expense</h2>
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
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthPlanner;