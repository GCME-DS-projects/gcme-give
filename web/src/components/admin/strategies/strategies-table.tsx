import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Strategy } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";

interface StrategiesTableProps {
  strategies: Strategy[];
  onEdit: (strategy: Strategy) => void;
  onDelete: (strategy: Strategy) => void;
}

export function StrategiesTable({ strategies, onEdit, onDelete }: StrategiesTableProps) {
  if (strategies.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No strategies found</h3>
        <p className="text-gray-600 mb-6">Click "Add Strategy" to create your first one.</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Activities</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {strategies.map((strategy) => (
          <TableRow key={strategy.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{strategy.title}</TableCell>
            <TableCell>{strategy.description}</TableCell>
            <TableCell>
              <code className="text-sm bg-gray-100 p-1 rounded">{strategy.slug}</code>
            </TableCell>
            <TableCell>{strategy.activities.join(", ")}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(strategy)}>
                  <Edit className="h-4 w-4 text-green-600" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(strategy)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}