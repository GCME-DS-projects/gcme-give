import { Plus } from "lucide-react";

interface PageHeaderProps {
  onAddClick: () => void;
}

export default function PageHeader({ onAddClick }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Missionaries Management</h1>
        <p className="text-gray-600 mt-2">
          Manage Ethiopian missionary profiles, information, and ministry assignments
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Add Missionary</span>
      </button>
    </div>
  );
}