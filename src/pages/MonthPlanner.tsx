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

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MonthPlanner = () => {
  const { monthId } = useParams();
  const { toast } = useToast();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [expenses, setExpenses] = useState<DayExpenses>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDates(prev => {
      const dateStr = date.toISOString().split('T')[0];
      const exists = prev.some(d => d.toISOString().split('T')[0] === dateStr);
      
      if (exists) {
        return prev.filter(d => d.toISOString().split('T')[0] !== dateStr);
      } else {
        return [...prev, date];
      }
    });
    setShowDetails(true);
  };

  const handleSaveExpense = () => {
    selectedDates.forEach(date => {
      const dateKey = date.toISOString().split('T')[0];
      const expense: ExpenseEntry = {
        amount: 0,
        description: description
      };

      setExpenses(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), expense]
      }));
    });
    
    toast({
      title: "Expenses saved",
      description: `Expenses saved for ${selectedDates.length} dates.`,
    });

    setTitle("");
    setDescription("");
    setSelectedDates([]);
    setShowDetails(false);
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
          <div className="w-10" />
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Selected dates: {selectedDates.length}
            </p>
            <PlannerGrid
              selectedDates={selectedDates}
              setSelectedDate={handleDateSelect}
              expenses={expenses}
              onSaveExpense={handleSaveExpense}
            />
          </Card>

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
                <Button onClick={handleSaveExpense}>Save Expenses</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthPlanner;