import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlannerGrid } from "@/components/PlannerGrid";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Month</label>
              <Select
                value={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={String(index)}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {selectedMonth !== "" && (
          <>
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

            <PlannerGrid
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              expenses={expenses}
              onSaveExpense={handleSaveExpense}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default YearlyPlanner;