"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetProjects, useDeleteProjectMutation } from "@/hooks/queries/use-projects-query";
import { Loader2, Plus, Search } from "lucide-react";
import { AddProjectDialog } from "@/components/admin/projects/add-project-dialog";
import { ProjectsStats } from "@/components/admin/projects/projects-stats";
import { ProjectsGrid } from "@/components/admin/projects/projects-grid";
import { EditProjectDialog } from "@/components/admin/projects/edit-project-dialog";
import { DeleteProjectAlert } from "@/components/admin/projects/delete-project-alert";
import { ProjectModal } from "@/components/admin/projects/project-modal";
import { Project } from "@/lib/types";

// Force dynamic rendering to avoid SSG issues with hooks
export const dynamic = 'force-dynamic';

export default function AdminProjectsPage() {
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null); // State for viewing modal

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: projects = [], isLoading, isError } = useGetProjects();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProjectMutation();

  const handleConfirmDelete = () => {
    if (deletingProject) {
      deleteProject(deletingProject.id, {
        onSuccess: () => setDeletingProject(null),
      });
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || project.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, filterStatus]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f4f8fb]">
        <Loader2 className="w-12 h-12 animate-spin text-[#001F54]" />
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-center text-red-600">Error loading projects.</div>;
  }

  return (
    <div className="p-8 bg-[#f4f8fb] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#001F54]">Projects Management</h1>
          <p className="text-[#001F54] opacity-80 mt-2">
            Manage mission projects, funding goals, and progress tracking.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="bg-[#001F54] hover:bg-[#001F54]/90 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </Button>
      </div>

      <ProjectsStats projects={projects} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#001F54] opacity-60 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <ProjectsGrid
        projects={filteredProjects}
        onEdit={setEditingProject}
        onDelete={setDeletingProject}
        onView={setViewingProject} // Pass the handler to the grid
      />

      {/* Dialogs and Alerts */}
      <AddProjectDialog isOpen={isAddOpen} onOpenChange={setAddOpen} />

      {editingProject && (
        <EditProjectDialog
          project={editingProject}
          isOpen={!!editingProject}
          onOpenChange={(isOpen) => !isOpen && setEditingProject(null)}
        />
      )}
      
      {deletingProject && (
        <DeleteProjectAlert
          isOpen={!!deletingProject}
          onOpenChange={(isOpen) => !isOpen && setDeletingProject(null)}
          onConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* Render the View Modal */}
      {viewingProject && (
        <ProjectModal 
          project={viewingProject} 
          onOpenChange={(isOpen) => !isOpen && setViewingProject(null)}
        />
      )}
    </div>
  );
}