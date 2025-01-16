import { DashboardCard } from "@/components/DashboardCard";
import { TransactionList } from "@/components/TransactionList";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, PiggyBankIcon } from "lucide-react";

const mockTransactions = [
  {
    id: 1,
    description: "Salary",
    amount: 5000,
    type: "income" as const,
    category: "Income",
    date: "2024-03-15",
  },
  {
    id: 2,
    description: "Rent",
    amount: 1500,
    type: "expense" as const,
    category: "Housing",
    date: "2024-03-14",
  },
  {
    id: 3,
    description: "Groceries",
    amount: 200,
    type: "expense" as const,
    category: "Food",
    date: "2024-03-13",
  },
];

const Index = () => {
  const totalIncome = 5000;
  const totalExpenses = 1700;
  const savings = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
          <p className="text-muted-foreground">Track your finances and reach your goals.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            icon={<ArrowUpIcon className="h-4 w-4 text-secondary" />}
            className="border-l-4 border-l-secondary"
          />
          <DashboardCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            icon={<ArrowDownIcon className="h-4 w-4 text-destructive" />}
            className="border-l-4 border-l-destructive"
          />
          <DashboardCard
            title="Savings"
            value={formatCurrency(savings)}
            icon={<PiggyBankIcon className="h-4 w-4 text-primary" />}
            className="border-l-4 border-l-primary"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
            <TransactionList transactions={mockTransactions} />
          </Card>
          
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Coming Soon</h2>
            <div className="flex h-[400px] items-center justify-center rounded-md border-2 border-dashed">
              <div className="text-center">
                <DollarSignIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Spending analytics and insights coming soon!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;