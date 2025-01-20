import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

export function TransactionList({ transactions, onEdit, onDelete, onReorder }: TransactionListProps) {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      onReorder(dragIndex, dropIndex);
    }
  };

  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-move group"
          >
            <div className="flex items-center gap-4">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">{transaction.category}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "text-sm font-medium",
                  transaction.type === "income" ? "text-secondary" : "text-destructive"
                )}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(transaction)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(transaction.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}