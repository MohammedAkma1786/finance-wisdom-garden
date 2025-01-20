import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  onSubmit: (transaction: {
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
  }) => void;
  editingTransaction: {
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
  } | null;
}

export function TransactionForm({ onSubmit, editingTransaction }: TransactionFormProps) {
  const { toast } = useToast();
  const [description, setDescription] = useState(editingTransaction?.description || "");
  const [amount, setAmount] = useState(editingTransaction?.amount.toString() || "");
  const [category, setCategory] = useState(editingTransaction?.category || "");
  const [type, setType] = useState<"income" | "expense">(editingTransaction?.type || "expense");
  const [date, setDate] = useState<Date>(
    editingTransaction?.date ? new Date(editingTransaction.date) : new Date()
  );

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setType(editingTransaction.type);
      setDate(new Date(editingTransaction.date));
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: date.toISOString().split('T')[0],
    });

    if (!editingTransaction) {
      setDescription("");
      setAmount("");
      setCategory("");
      setType("expense");
      setDate(new Date());
    }
  };

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">
        {editingTransaction ? "Edit" : "Add"} Transaction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
          />
        </div>
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
                className="[&_.rdp-day_button:hover]:bg-primary [&_.rdp-day_button[aria-selected]]:text-primary [&_.rdp-day_button[aria-selected]]:hover:text-primary"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              onClick={() => setType("expense")}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              onClick={() => setType("income")}
            >
              Income
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full">
          {editingTransaction ? "Update" : "Add"} Transaction
        </Button>
      </form>
    </Card>
  );
}