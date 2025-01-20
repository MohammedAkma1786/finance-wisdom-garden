import { Calendar } from "@/components/ui/calendar";
import type { DayExpenses } from "@/pages/YearlyPlanner";
import { format, addMonths } from "date-fns";

interface PlannerGridProps {
  selectedDates: Date[];
  setSelectedDate: (date: Date) => void;
  expenses: DayExpenses;
  onSaveExpense: () => void;
  recurringMonths: string;
}

export function PlannerGrid({
  selectedDates,
  setSelectedDate,
  expenses,
  recurringMonths,
}: PlannerGridProps) {
  const fromDate = selectedDates[0];
  const toDate = fromDate && recurringMonths 
    ? addMonths(fromDate, parseInt(recurringMonths)) 
    : null;

  return (
    <div className="space-y-4">
      {selectedDates.length > 0 && (
        <div className="text-sm text-muted-foreground space-y-1">
          <p>From: {fromDate ? format(fromDate, 'PPP') : 'Not selected'}</p>
          <p>To: {toDate ? format(toDate, 'PPP') : 'Set recurring months'}</p>
        </div>
      )}
      <Calendar
        mode="single"
        selected={fromDate}
        onSelect={(date) => {
          if (date) {
            setSelectedDate(date);
          }
        }}
        className="rounded-md border"
      />
    </div>
  );
}