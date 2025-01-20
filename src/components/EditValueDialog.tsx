import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface EditValueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
  initialValue: number;
  title: string;
}

export function EditValueDialog({
  isOpen,
  onClose,
  onSave,
  initialValue,
  title,
}: EditValueDialogProps) {
  const [value, setValue] = useState(initialValue.toString());

  const handleSave = () => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onSave(numValue);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
        </DialogHeader>
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-4"
        />
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}