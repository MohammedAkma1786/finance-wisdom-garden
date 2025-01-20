import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  const [isGridView, setIsGridView] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const toggleTransaction = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isGridView) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setIsGridView(false)}
          className="w-full"
        >
          <ChevronUp className="mr-2 h-4 w-4" />
          Switch to List View
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.map((transaction) => (
            <Card
              key={transaction.id}
              className={cn(
                "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                expandedId === transaction.id && "ring-2 ring-primary"
              )}
              onClick={() => toggleTransaction(transaction.id)}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{transaction.description}</h3>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                
                {expandedId === transaction.id && (
                  <div className="pt-2 space-y-2 border-t">
                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    <p className={cn(
                      "text-sm font-medium",
                      transaction.type === "income" ? "text-secondary" : "text-destructive"
                    )}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(transaction);
                        }}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(transaction.id);
                        }}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={() => setIsGridView(true)}
        className="w-full"
      >
        <ChevronDown className="mr-2 h-4 w-4" />
        Switch to Grid View
      </Button>
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
    </div>
  );
}