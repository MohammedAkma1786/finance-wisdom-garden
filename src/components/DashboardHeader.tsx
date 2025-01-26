import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

export function DashboardHeader({ userName, onLogout }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Financial Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {userName}</p>
      </div>
      <Button variant="outline" onClick={onLogout} className="w-full sm:w-auto">Logout</Button>
    </div>
  );
}