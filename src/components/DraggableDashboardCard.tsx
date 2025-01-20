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
  onEdit?: () => void;
  isEditable?: boolean;
}

export function DraggableDashboardCard({
  title,
  value,
  className,
  icon,
  onDragStart,
  onDragOver,
  onDrop,
  onEdit,
  isEditable = false,
}: DraggableDashboardCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn("group cursor-move relative", className)}
    >
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="transform transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.98]">
        <DashboardCard 
          title={title} 
          value={value} 
          icon={icon} 
          className={cn(
            "border-l-[6px]",
            className,
            "hover:bg-background/50 backdrop-blur-sm"
          )}
          onEdit={isEditable ? onEdit : undefined}
        />
      </div>
    </div>
  );
}