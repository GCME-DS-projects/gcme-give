import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCreateProjectMutation } from "@/hooks/queries/use-projects-query";
import { ProjectForm } from "./project-form";
import { Project } from "@/lib/types";

interface AddProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddProjectDialog({ isOpen, onOpenChange }: AddProjectDialogProps) {
  const { mutate: createProject, isPending } = useCreateProjectMutation();

  const handleSubmit = (data: Partial<Project>) => {
    createProject(data as any, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new mission project.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm onSubmit={handleSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}