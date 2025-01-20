import { Calendar } from "@/components/ui/calendar";
import type { DayExpenses } from "@/pages/YearlyPlanner";

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
  return (
    <div className="space-y-4">
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