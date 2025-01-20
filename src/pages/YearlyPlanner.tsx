import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YearlyPlanner = () => {
  const navigate = useNavigate();

  const handleMonthSelect = (monthIndex: number) => {
    navigate(`/planner/${monthIndex}`);
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
          <h1 className="text-2xl font-bold">Expense Planner</h1>
          <Link to="/current-plans">
            <Button variant="outline">View Current Plans</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {months.map((month, index) => (
            <Card 
              key={month}
              className="p-6 hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleMonthSelect(index)}
            >
              <h3 className="text-lg font-semibold text-center">{month}</h3>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearlyPlanner;