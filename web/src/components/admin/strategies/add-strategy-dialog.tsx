import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCreateStrategyMutation } from "@/hooks/queries/use-strategies-query";
import { StrategyForm } from "./strategy-form";
import { Strategy } from "@/lib/types";

interface AddStrategyDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddStrategyDialog({ isOpen, onOpenChange }: AddStrategyDialogProps) {
  const { mutate: createStrategy, isPending } = useCreateStrategyMutation();

  const handleSubmit = (data: Partial<Strategy>) => {
    createStrategy(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Strategy</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new mission strategy.
          </DialogDescription>
        </DialogHeader>
        <StrategyForm onSubmit={handleSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}