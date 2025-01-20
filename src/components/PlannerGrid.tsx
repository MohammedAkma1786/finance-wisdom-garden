import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { ExpenseEntry, DayExpenses } from "@/pages/YearlyPlanner";

interface PlannerGridProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  expenses: DayExpenses;
  onSaveExpense: (date: Date, expense: ExpenseEntry) => void;
}

export function PlannerGrid({
  selectedDate,
  setSelectedDate,
  expenses,
  onSaveExpense,
}: PlannerGridProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!amount || !description) return;
    
    onSaveExpense(selectedDate, {
      amount: parseFloat(amount),
      description,
    });
    
    setAmount("");
    setDescription("");
    setIsDialogOpen(false);
  };

  const dateKey = selectedDate.toISOString().split('T')[0];
  const dayExpenses = expenses[dateKey] || [];

  return (
    <div className="grid gap-6 md:grid-cols-[300px,1fr]">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md border"
        />
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            Expenses for {selectedDate.toLocaleDateString()}
          </h3>
          <Button onClick={() => setIsDialogOpen(true)}>Add Expense</Button>
        </div>

        <div className="space-y-4">
          {dayExpenses.length === 0 ? (
            <p className="text-muted-foreground">No expenses planned for this day</p>
          ) : (
            dayExpenses.map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <span>{expense.description}</span>
                <span className="font-medium">{formatCurrency(expense.amount)}</span>
              </div>
            ))
          )}
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense for {selectedDate.toLocaleDateString()}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}