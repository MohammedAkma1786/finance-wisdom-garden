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
  const shouldShowEdit = isEditable && (title === "Total Income" || title === "Savings");

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.currentTarget.classList.add('opacity-50');
        onDragStart(e);
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove('opacity-50');
      }}
      onDragOver={onDragOver}
      onDrop={(e) => {
        e.currentTarget.classList.remove('opacity-50');
        onDrop(e);
      }}
      className={cn(
        "group cursor-move relative h-full transition-all duration-200",
        "hover:shadow-lg active:shadow-md",
        className
      )}
    >
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="h-full transform transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.98]">
        <DashboardCard 
          title={title} 
          value={value} 
          icon={icon} 
          className={cn(
            "border-l-[6px] h-full",
            className,
            "hover:bg-background/50 backdrop-blur-sm"
          )}
          onEdit={shouldShowEdit ? onEdit : undefined}
        />
      </div>
    </div>
  );
}