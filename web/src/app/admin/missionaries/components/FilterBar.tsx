import { Search, Download } from "lucide-react";
import { Strategy } from "../types";

interface FilterBarProps {
  filters: {
    search: string;
    status: string;
    type: string;
    strategy: string;
  };
  onFiltersChange: (filters: FilterBarProps['filters']) => void;
  strategies: Strategy[];
}

export default function FilterBar({ filters, onFiltersChange, strategies }: FilterBarProps) {
  const handleChange = (field: keyof typeof filters, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search missionaries..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        
        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
        </select>

        {/* Strategy Filter */}
         <select
           value={filters.strategy}
           onChange={(e) => handleChange('strategy', e.target.value)}
           className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         >
           <option value="all">All Strategies</option>
           {strategies.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
           ))}
         </select>
        
        {/* Export Button */}
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}