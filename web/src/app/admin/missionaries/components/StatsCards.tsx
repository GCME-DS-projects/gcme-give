import { Users, Target, Globe, Clock } from "lucide-react";
import { Missionary } from "@/lib/types";

interface StatsCardsProps {
  missionaries: Missionary[];
}

export default function StatsCards({ missionaries }: StatsCardsProps) {
    const total = missionaries.length;
    const active = missionaries.filter(m => m.status === 'Active').length;
    const locations = new Set(missionaries.map(m => m.location).filter(Boolean)).size;
    const avgExperience = missionaries.length > 0 
      ? Math.round(missionaries.reduce((sum, m) => sum + (parseInt(m.years || '0') || 0), 0) / missionaries.length)
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {/* Total Missionaries */}
      <StatCard icon={Users} label="Total Missionaries" value={total} />
      {/* Active Missionaries */}
      <StatCard icon={Target} label="Active" value={active} />
      {/* Locations */}
      <StatCard icon={Globe} label="Locations" value={locations} />
      {/* Avg Experience */}
      <StatCard icon={Clock} label="Avg. Experience" value={`${avgExperience} years`} />
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center">
            <div className="w-12 h-12 bg-[#001F54] bg-opacity-10 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#001F54]" />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-[#001F54] opacity-80">{label}</p>
                <p className="text-2xl font-bold text-[#001F54]">{value}</p>
            </div>
        </div>
    </div>
);