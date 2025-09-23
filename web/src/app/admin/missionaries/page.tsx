"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetMissionaries, useRemoveMissionary } from "@/hooks/queries/use-missionaries-query";
import { useGetStrategies } from "@/hooks/queries/use-strategies-query"; // Assuming this exists from previous refactor
import { Loader2, Plus, Search } from "lucide-react";
import { Missionary, QueryMissionaryDto } from "@/lib/types";
import { useDebounce } from "@/hooks/use-debounce";
import { MissionariesStats } from "@/components/admin/missionaries/missionaries-stats";
import { MissionariesTable } from "@/components/admin/missionaries/missionaries-table";
import { AddMissionaryDialog } from "@/components/admin/missionaries/add-missionary-dialog";
import { EditMissionaryDialog } from "@/components/admin/missionaries/edit-missionary-dialog";
import { ViewMissionaryModal } from "@/components/admin/missionaries/view-missionary-modal";
import { DeleteMissionaryAlert } from "@/components/admin/missionaries/delete-missionary-alert";

export default function MissionariesPage() {
  const [query, setQuery] = useState<QueryMissionaryDto>({});
  const [dialogs, setDialogs] = useState({
    add: false,
    edit: null as Missionary | null,
    view: null as Missionary | null,
    delete: null as Missionary | null,
  });

  const debouncedSearch = useDebounce(query.search, 500);

  const { data: missionaries = [], isLoading: isLoadingMissionaries } = useGetMissionaries({ ...query, search: debouncedSearch });
  const { data: strategies = [], isLoading: isLoadingStrategies } = useGetStrategies();
  const { mutate: removeMissionary, isPending: isDeleting } = useRemoveMissionary();

  const handleQueryChange = (key: keyof QueryMissionaryDto, value: string) => {
    setQuery(prev => ({ ...prev, [key]: value === 'all' ? undefined : value }));
  };
  
  const handleConfirmDelete = () => {
    if (dialogs.delete) {
      removeMissionary(dialogs.delete.id, {
        onSuccess: () => setDialogs(prev => ({ ...prev, delete: null })),
      });
    }
  };
  
  const isLoading = isLoadingMissionaries || isLoadingStrategies;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Missionaries Management</h1>
          <p className="text-gray-600 mt-2">Manage missionary profiles, information, and ministry assignments.</p>
        </div>
        <Button onClick={() => setDialogs(prev => ({ ...prev, add: true }))}>
          <Plus className="w-5 h-5 mr-2" />
          Add Missionary
        </Button>
      </div>

      <MissionariesStats missionaries={missionaries} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name..."
              value={query.search || ''}
              onChange={(e) => handleQueryChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={query.status || 'all'} onValueChange={(v) => handleQueryChange('status', v)}>
            <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
           <Select value={query.type || 'all'} onValueChange={(v) => handleQueryChange('type', v)}>
            <SelectTrigger><SelectValue placeholder="Filter by type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
            </SelectContent>
          </Select>
           <Select value={query.region || 'all'} onValueChange={(v) => handleQueryChange('region', v)}>
            <SelectTrigger><SelectValue placeholder="Filter by region" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
                {/* Add other regions as needed */}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        {isLoading ? (
            <div className="flex justify-center items-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : (
            <MissionariesTable
                missionaries={missionaries}
                onEdit={(m) => setDialogs(prev => ({ ...prev, edit: m }))}
                onView={(m) => setDialogs(prev => ({ ...prev, view: m }))}
                onDelete={(m) => setDialogs(prev => ({ ...prev, delete: m }))}
            />
        )}
      </div>

      {/* Dialogs and Modals */}
      <AddMissionaryDialog
        isOpen={dialogs.add}
        onOpenChange={(isOpen) => setDialogs(prev => ({ ...prev, add: isOpen }))}
        strategies={strategies}
      />
      {dialogs.edit && (
        <EditMissionaryDialog
          missionary={dialogs.edit}
          isOpen={!!dialogs.edit}
          onOpenChange={(isOpen) => setDialogs(prev => ({ ...prev, edit: isOpen ? dialogs.edit : null }))}
          strategies={strategies}
        />
      )}
      {dialogs.view && (
        <ViewMissionaryModal
          missionary={dialogs.view}
          isOpen={!!dialogs.view}
          onOpenChange={(isOpen) => setDialogs(prev => ({ ...prev, view: isOpen ? dialogs.view : null }))}
        />
      )}
      {dialogs.delete && (
        <DeleteMissionaryAlert
          isOpen={!!dialogs.delete}
          onOpenChange={(isOpen) => setDialogs(prev => ({ ...prev, delete: isOpen ? dialogs.delete : null }))}
          onConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}