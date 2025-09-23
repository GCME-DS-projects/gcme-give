import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUpdateMissionary } from "@/hooks/queries/use-missionaries-query";
import { CreateMissionaryDto, Missionary, Strategy } from "@/lib/types";
import { MissionaryForm } from "./missionary-form";

interface Props {
  missionary: Missionary;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  strategies: Strategy[];
}

export function EditMissionaryDialog({ missionary, isOpen, onOpenChange, strategies }: Props) {
  const { mutate: updateMissionary, isPending } = useUpdateMissionary();

  const handleSubmit = (data: CreateMissionaryDto) => {
    updateMissionary({ id: missionary.id, data }, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit {missionary.user.name}</DialogTitle></DialogHeader>
        <MissionaryForm
          onSubmit={handleSubmit}
          isPending={isPending}
          strategies={strategies}
          defaultValues={missionary}
        />
      </DialogContent>
    </Dialog>
  );
}