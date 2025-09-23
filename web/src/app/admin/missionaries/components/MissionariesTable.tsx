import { useState } from "react";
import { Missionary } from "@/lib/types";
import { Edit, Trash2, Eye, MapPin, Calendar, Mail, Phone, Globe, ChevronUp, ChevronDown } from "lucide-react";

interface MissionariesTableProps {
  missionaries: Missionary[];
  onView: (missionary: Missionary) => void;
  onEdit: (missionary: Missionary) => void;
  onDelete: (missionary: Missionary) => void;
}

export default function MissionariesTable({ missionaries, onView, onEdit, onDelete }: MissionariesTableProps) {
  const [sortField, setSortField] = useState<keyof Missionary>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Missionary) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedMissionaries = [...missionaries].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;
    
    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const SortableHeader = ({ field, children }: { field: keyof Missionary; children: React.ReactNode }) => (
    <button onClick={() => handleSort(field)} className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900">
      <span>{children}</span>
      {sortField === field && (sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
    </button>
  );

  return (
    <table className="w-full min-w-[1200px]">
      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <tr>
          <th className="px-6 py-4 text-left"><SortableHeader field="name">Missionary</SortableHeader></th>
          <th className="px-6 py-4 text-left"><SortableHeader field="location">Location</SortableHeader></th>
          <th className="px-6 py-4 text-left"><SortableHeader field="focus">Focus Area</SortableHeader></th>
          <th className="px-6 py-4 text-left"><SortableHeader field="type">Type</SortableHeader></th>
          <th className="px-6 py-4 text-left"><SortableHeader field="strategy">Strategy</SortableHeader></th>
          <th className="px-6 py-4 text-left"><SortableHeader field="status">Status</SortableHeader></th>
          <th className="px-6 py-4 text-left">Contact</th>
          <th className="px-6 py-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {sortedMissionaries.map((missionary) => (
          <MissionaryRow key={missionary.id} missionary={missionary} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
}

// Sub-component for a single row
const MissionaryRow = ({ missionary, onView, onEdit, onDelete }: { missionary: Missionary } & Omit<MissionariesTableProps, 'missionaries'>) => (
    <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
            <div className="flex items-center space-x-3">
                <img
                    src={missionary.user?.image || missionary.image || "/placeholder-user.jpg"}
                    alt={missionary.user?.name || 'Unknown'}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <p className="font-medium text-gray-900">{missionary.user?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{missionary.title || 'No title'}</p>
                    <p className="text-xs text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> {missionary.years || '0'} experience
                    </p>
                </div>
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{missionary.location}</span>
            </div>
        </td>
        <td className="px-6 py-4">
            <span className="text-sm text-gray-700 max-w-xs truncate block">{missionary.focus}</span>
        </td>
        <td className="px-6 py-4">
             <span className={`px-3 py-1 rounded-full text-xs font-medium ${ missionary.type === "Full-time" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800" }`}>
                {missionary.type}
            </span>
        </td>
        <td className="px-6 py-4 text-gray-700">{missionary.strategy}</td>
        <td className="px-6 py-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${ missionary.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800" }`}>
                {missionary.status}
            </span>
        </td>
        <td className="px-6 py-4">
            <div className="space-y-1">
                <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate max-w-32">{missionary.user?.email || 'No email'}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{missionary.phone || 'No phone'}</span>
                </div>
                {missionary.website && (
                    <div className="flex items-center space-x-1">
                        <Globe className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate max-w-32">{missionary.website}</span>
                    </div>
                )}
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center justify-center space-x-2">
                <button onClick={() => onView(missionary)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                <button onClick={() => onEdit(missionary)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(missionary)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
        </td>
    </tr>
);