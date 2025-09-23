import { Button } from "@/components/ui/button";
import { Project } from "@/lib/types";
import { Edit, Eye, Target, Trash2, Layers } from "lucide-react";

interface ProjectsGridProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onView: (project: Project) => void; // Add onView handler
}

const ProjectCard = ({ project, onEdit, onDelete, onView }: { project: Project, onEdit: (p: Project) => void, onDelete: (p: Project) => void, onView: (p: Project) => void }) => {
    const progress = (project.fundingGoal && project.fundingRaised) 
        ? Math.min(Math.round((Number(project.fundingRaised) / Number(project.fundingGoal)) * 100), 100)
        : 0;
    
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow flex flex-col justify-between">
            <div>
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#001F54] leading-tight">{project.title}</h3>
                        {project.Strategy?.title && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                <Layers className="w-3 h-3 mr-1.5" />
                                <span>{project.Strategy.title}</span>
                            </div>
                        )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium self-start ${project.status === 'ACTIVE' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {project.status}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">{project.shortDescription}</p>
                 <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Funding Progress</span>
                        <span className="font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-blue-500 to-[#001F54] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">${Number(project.fundingRaised || 0).toLocaleString()}</span>
                        <span className="text-gray-800 font-medium">Goal: ${Number(project.fundingGoal || 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end space-x-1 border-t pt-4 mt-4">
                <Button variant="outline" size="sm" onClick={() => onView(project)} className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
                  <Edit className="h-4 w-4 text-green-600" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(project)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
            </div>
        </div>
    )
};


export function ProjectsGrid({ projects, onEdit, onDelete, onView }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-[#001F54] opacity-30 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[#001F54] mb-2">No projects found</h3>
        <p className="text-[#001F54] opacity-60">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} onView={onView} />
      ))}
    </div>
  );
}