import { Button } from "@/components/ui/button";

interface TransactionTypeSelectorProps {
  type: "income" | "expense";
  setType: (type: "income" | "expense") => void;
}

export function TransactionTypeSelector({ type, setType }: TransactionTypeSelectorProps) {
  return (
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
  );
}