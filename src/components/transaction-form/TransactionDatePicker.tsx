import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TransactionDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function TransactionDatePicker({ date, setDate }: TransactionDatePickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Date
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white shadow-lg" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => setDate(newDate || new Date())}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}