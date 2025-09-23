"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Missionary, Strategy, Pagination, QueryMissionaryDto, CreateMissionaryDto, UpdateMissionaryDto } from "@/lib/types";

// Import React Query hooks
import { 
  useGetMissionaries, 
  useCreateMissionary, 
  useUpdateMissionary, 
  useRemoveMissionary 
} from "@/hooks/queries/use-missionaries-query";

// Import the new components
import PageHeader from "./components/PageHeader";
import StatsCards from "./components/StatsCards";
import FilterBar from "./components/FilterBar";
import MissionariesTable from "./components/MissionariesTable";
import PaginationControls from "./components/PaginationControls";
import MissionaryFormModal from "./components/MissionaryFormModal";
import ViewMissionaryModal from "./components/ViewMissionaryModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";

export const dynamic = 'force-dynamic';

type ModalType = 'add' | 'edit' | 'view' | 'delete';

export default function AdminMissionariesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, pages: 1 });
  
  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    strategy: "all",
  });

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [selectedMissionary, setSelectedMissionary] = useState<Missionary | null>(null);

  // Build query parameters for API
  const queryParams: QueryMissionaryDto = {
    page: pagination.page,
    limit: pagination.limit,
    ...(filters.search && { search: filters.search }),
    ...(filters.status !== "all" && { status: filters.status }),
    ...(filters.type !== "all" && { type: filters.type }),
    ...(filters.strategy !== "all" && { strategyId: filters.strategy }),
  };

  // Use React Query hooks
  const { data: missionaries = [], isLoading, error } = useGetMissionaries(queryParams);
  const createMissionaryMutation = useCreateMissionary();
  const updateMissionaryMutation = useUpdateMissionary();
  const deleteMissionaryMutation = useRemoveMissionary();

  // Fetch strategies (keeping this as manual fetch for now since we don't have strategies hooks yet)
  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const res = await fetch("/api/admin/strategies");
        const data = await res.json();
        setStrategies(Array.isArray(data) ? data : data.strategies || []);
      } catch (e) {
        console.error("Failed to fetch strategies:", e);
        setStrategies([]);
      }
    };
    fetchStrategies();
  }, []);

  // Modal handlers
  const openModal = (type: ModalType, missionary: Missionary | null = null) => {
    setModalType(type);
    setSelectedMissionary(missionary);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedMissionary(null);
  };
  
  // CRUD handlers
  const handleSave = async (formData: FormData, missionaryId?: string) => {
    const isEdit = !!missionaryId;
    
    try {
      if (isEdit) {
        // Convert FormData to UpdateMissionaryDto
        const updateData: UpdateMissionaryDto = {};
        for (const [key, value] of formData.entries()) {
          if (key === 'supportNeeds' || key === 'recentUpdates') {
            updateData[key as keyof UpdateMissionaryDto] = JSON.parse(value as string);
          } else if (key !== 'image') {
            updateData[key as keyof UpdateMissionaryDto] = value as string;
          }
        }
        await updateMissionaryMutation.mutateAsync({ id: missionaryId, data: updateData });
      } else {
        // Convert FormData to CreateMissionaryDto
        const createData: CreateMissionaryDto = {
          userId: 'temp-user-id', // This should be set from the current user context
          ...Object.fromEntries(formData.entries()) as Partial<CreateMissionaryDto>
        };
        
        // Handle special fields
        for (const [key, value] of formData.entries()) {
          if (key === 'supportNeeds' || key === 'recentUpdates') {
            createData[key as keyof CreateMissionaryDto] = JSON.parse(value as string);
          } else if (key === 'imageUrl') {
            createData.imageUrl = value as string;
          } else if (key !== 'image') {
            createData[key as keyof CreateMissionaryDto] = value as string;
          }
        }
        
        await createMissionaryMutation.mutateAsync(createData);
      }
      closeModal();
    } catch (error) {
      console.error(error);
      // Error handling is done by the mutation hooks with toast notifications
    }
  };
  
  const handleDelete = async () => {
    if (!selectedMissionary) return;
    try {
      await deleteMissionaryMutation.mutateAsync(selectedMissionary.id);
      closeModal();
    } catch (error) {
      console.error(error);
      // Error handling is done by the mutation hooks with toast notifications
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((p: Pagination) => ({ ...p, page: newPage }));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <PageHeader onAddClick={() => openModal('add')} />
      <StatsCards missionaries={missionaries} />
      <FilterBar filters={filters} onFiltersChange={setFilters} strategies={strategies} />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto relative">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-red-600">Error loading missionaries: {(error as Error).message}</div>
          </div>
        ) : (
          <MissionariesTable
            missionaries={missionaries}
            onView={(m) => openModal('view', m)}
            onEdit={(m) => openModal('edit', m)}
            onDelete={(m) => openModal('delete', m)}
          />
        )}
      </div>

      {!isLoading && !error && missionaries.length > 0 && (
        <PaginationControls pagination={pagination} onPageChange={handlePageChange} />
      )}
      
      {/* Modals */}
      {(modalType === 'add' || modalType === 'edit') && (
        <MissionaryFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
          missionary={selectedMissionary}
          strategies={strategies}
        />
      )}

      {modalType === 'view' && selectedMissionary && (
        <ViewMissionaryModal
          isOpen={isModalOpen}
          onClose={closeModal}
          missionary={selectedMissionary}
        />
      )}
      
      {modalType === 'delete' && selectedMissionary && (
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleDelete}
          missionaryName={selectedMissionary.user?.name || 'Unknown'}
        />
      )}
    </div>
  );
}