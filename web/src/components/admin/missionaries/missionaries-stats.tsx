import { Missionary } from "@/lib/types";
import { Globe, Target, Users, CalendarPlus } from "lucide-react";

const StatCard = ({ title, value, icon: Icon }: { title: string; value: React.ReactNode; icon: React.ElementType }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg"><Icon className="w-6 h-6 text-blue-600" /></div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export function MissionariesStats({ missionaries }: { missionaries: Missionary[] }) {
    const activeCount = missionaries.filter(m => m.status === 'Active').length;
    const locationCount = new Set(missionaries.map(m => m.location).filter(Boolean)).size;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Missionaries" value={missionaries.length} icon={Users} />
            <StatCard title="Active on Field" value={activeCount} icon={Target} />
            <StatCard title="Unique Locations" value={locationCount} icon={Globe} />
            <StatCard title="New this Month" value={0} icon={CalendarPlus} />
        </div>
    );
}