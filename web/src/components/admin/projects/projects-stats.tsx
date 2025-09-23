import { Project } from "@/lib/types";
import { BarChart3, DollarSign, Target, TrendingUp } from "lucide-react";

interface ProjectsStatsProps {
  projects: Project[];
}

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-[#001F54] opacity-80">{title}</p>
                <p className="text-3xl font-bold text-[#001F54]">{value}</p>
            </div>
            <div className="p-3 bg-[#001F54] bg-opacity-10 rounded-lg">
                <Icon className="w-6 h-6 text-[#001F54]" />
            </div>
        </div>
    </div>
);


export function ProjectsStats({ projects }: ProjectsStatsProps) {
    const totalGoal = projects.reduce((sum, p) => sum + (p.fundingGoal || 0), 0);
    const totalRaised = projects.reduce((sum, p) => sum + (p.fundingRaised || 0), 0);
    const avgProgress = projects.length > 0
        ? Math.round(projects.reduce((sum, p) => {
            const progress = (p.fundingRaised && p.fundingGoal) ? (p.fundingRaised / p.fundingGoal) * 100 : 0;
            return sum + progress;
        }, 0) / projects.length)
        : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Projects" value={projects.length} icon={Target} />
        <StatCard title="Total Funding Goal" value={`$${totalGoal.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Total Raised" value={`$${totalRaised.toLocaleString()}`} icon={TrendingUp} />
        <StatCard title="Avg. Progress" value={`${avgProgress}%`} icon={BarChart3} />
    </div>
  );
}