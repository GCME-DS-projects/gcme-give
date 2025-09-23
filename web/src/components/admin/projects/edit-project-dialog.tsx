import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUpdateProjectMutation } from "@/hooks/queries/use-projects-query";
import { ProjectForm } from "./project-form";
import { Project } from "@/lib/types";

interface EditProjectDialogProps {
  project: Project;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditProjectDialog({ project, isOpen, onOpenChange }: EditProjectDialogProps) {
  const { mutate: updateProject, isPending } = useUpdateProjectMutation(project.id);

  const handleSubmit = (data: Partial<Project>) => {
    updateProject(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the details for "{project.name}".
          </DialogDescription>
        </DialogHeader>
        <ProjectForm onSubmit={handleSubmit} isPending={isPending} defaultValues={project} />
      </DialogContent>
    </Dialog>
  );
}