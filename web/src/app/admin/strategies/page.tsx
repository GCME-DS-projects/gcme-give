"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetStrategies, useDeleteStrategyMutation } from "@/hooks/queries/use-strategies-query";
import { Loader2, Plus } from "lucide-react";
import { AddStrategyDialog } from "@/components/admin/strategies/add-strategy-dialog";
import { EditStrategyDialog } from "@/components/admin/strategies/edit-strategy-dialog";
import { DeleteStrategyAlert } from "@/components/admin/strategies/delete-strategy-alert";
import { StrategiesTable } from "@/components/admin/strategies/strategies-table";
import { Strategy } from "@/lib/types";

// Force dynamic rendering to avoid SSG issues with hooks
export const dynamic = 'force-dynamic';

export default function StrategiesPage() {
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [deletingStrategy, setDeletingStrategy] = useState<Strategy | null>(null);

  const { data: strategies, isLoading, isError } = useGetStrategies();
  const { mutate: deleteStrategy, isPending: isDeleting } = useDeleteStrategyMutation();

  const handleConfirmDelete = () => {
    if (deletingStrategy) {
      deleteStrategy(deletingStrategy.id, {
        onSuccess: () => setDeletingStrategy(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-red-600">Error loading strategies. Please try again later.</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Strategies Management</h1>
          <p className="text-gray-600">Manage mission strategies, activities, and vision.</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>Add Strategy</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <StrategiesTable
          strategies={strategies || []}
          onEdit={setEditingStrategy}
          onDelete={setDeletingStrategy}
        />
      </div>

      {/* Dialogs and Alerts */}
      <AddStrategyDialog isOpen={isAddOpen} onOpenChange={setAddOpen} />

      {editingStrategy && (
        <EditStrategyDialog
          strategy={editingStrategy}
          isOpen={!!editingStrategy}
          onOpenChange={(isOpen) => !isOpen && setEditingStrategy(null)}
        />
      )}
      
      {deletingStrategy && (
        <DeleteStrategyAlert
          isOpen={!!deletingStrategy}
          onOpenChange={(isOpen) => !isOpen && setDeletingStrategy(null)}
          onConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}