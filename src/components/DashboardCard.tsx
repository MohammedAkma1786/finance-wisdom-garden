import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardCardProps {
  title: string;
  value: string;
  className?: string;
  icon?: React.ReactNode;
  onEdit?: () => void;
}

export function DashboardCard({ title, value, className, icon, onEdit }: DashboardCardProps) {
  return (
    <Card className={cn("relative group h-full hover:shadow-lg transition-all duration-300 border-l-[6px]", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}