import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateMissionary } from "@/hooks/queries/use-missionaries-query";
import { CreateMissionaryDto, Strategy } from "@/lib/types";
import { MissionaryForm } from "./missionary-form";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  strategies: Strategy[];
}

export function AddMissionaryDialog({ isOpen, onOpenChange, strategies }: Props) {
  const { mutate: createMissionary, isPending } = useCreateMissionary();

  const handleSubmit = (data: CreateMissionaryDto) => {
    createMissionary(data, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add New Missionary</DialogTitle></DialogHeader>
        <MissionaryForm onSubmit={handleSubmit} isPending={isPending} strategies={strategies} />
      </DialogContent>
    </Dialog>
  );
}