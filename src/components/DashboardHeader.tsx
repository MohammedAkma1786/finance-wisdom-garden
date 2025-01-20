import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

export function DashboardHeader({ userName, onLogout }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {userName}
        </p>
      </div>
      <Button variant="outline" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
}