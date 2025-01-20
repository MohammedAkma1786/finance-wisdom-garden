import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Transaction } from "@/hooks/useTransactions";

interface DashboardOverviewProps {
  transactions: Transaction[];
}

export function DashboardOverview({ transactions }: DashboardOverviewProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Financial Dashboard</h2>
      <div className="space-x-4">
        <Link to="/planner">
          <Button variant="outline">Expense Planner</Button>
        </Link>
        <Link to="/subscriptions">
          <Button variant="outline">Subscription Tracker</Button>
        </Link>
      </div>
    </div>
  );
}