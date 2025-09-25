import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUpdateStrategyMutation } from "@/hooks/queries/use-strategies-query";
import { StrategyForm } from "./strategy-form";
import { Strategy } from "@/lib/types";

interface EditStrategyDialogProps {
  strategy: Strategy;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditStrategyDialog({ strategy, isOpen, onOpenChange }: EditStrategyDialogProps) {
  const { mutate: updateStrategy, isPending } = useUpdateStrategyMutation(strategy.id);

  const handleSubmit = (data: Partial<Strategy>) => {
    updateStrategy(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Strategy</DialogTitle>
            <DialogDescription>
              Update the details for &quot;{strategy.title}&quot;.
            </DialogDescription>
        </DialogHeader>
        <StrategyForm onSubmit={handleSubmit} isPending={isPending} defaultValues={strategy} />
      </DialogContent>
    </Dialog>
  );
}