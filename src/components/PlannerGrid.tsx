import { Calendar } from "@/components/ui/calendar";
import type { DayExpenses } from "@/pages/YearlyPlanner";
import { format } from "date-fns";

interface PlannerGridProps {
  selectedDates: Date[];
  setSelectedDate: (date: Date) => void;
  expenses: DayExpenses;
  onSaveExpense: () => void;
}

export function PlannerGrid({
  selectedDates,
  setSelectedDate,
  expenses,
}: PlannerGridProps) {
  // Get the earliest and latest selected dates
  const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
  const fromDate = sortedDates[0];
  const toDate = sortedDates[sortedDates.length - 1];

  return (
    <div className="space-y-4">
      {selectedDates.length > 0 && (
        <div className="text-sm text-muted-foreground space-y-1">
          <p>From: {fromDate ? format(fromDate, 'PPP') : 'Not selected'}</p>
          <p>To: {toDate ? format(toDate, 'PPP') : 'Not selected'}</p>
        </div>
      )}
      <Calendar
        mode="multiple"
        selected={selectedDates}
        onSelect={(dates) => {
          if (dates && dates.length > 0) {
            setSelectedDate(dates[dates.length - 1]);
          }
        }}
        className="rounded-md border"
      />
    </div>
  );
}