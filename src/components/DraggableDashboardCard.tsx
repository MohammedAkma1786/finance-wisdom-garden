import { DashboardCard } from "@/components/DashboardCard";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface DraggableDashboardCardProps {
  title: string;
  value: string;
  className?: string;
  icon?: React.ReactNode;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function DraggableDashboardCard({
  title,
  value,
  className,
  icon,
  onDragStart,
  onDragOver,
  onDrop,
}: DraggableDashboardCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn("group cursor-move", className)}
    >
      <div className="relative">
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <DashboardCard title={title} value={value} icon={icon} className={className} />
      </div>
    </div>
  );
}