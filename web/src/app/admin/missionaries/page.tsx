"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Missionary, Strategy, Pagination } from "./types";

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
  const [missionaries, setMissionaries] = useState<Missionary[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch missionaries
  const fetchMissionaries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status !== "all") params.append("status", filters.status);
    if (filters.type !== "all") params.append("type", filters.type);
    params.append("page", String(pagination.page));
    params.append("limit", String(pagination.limit));
    
    try {
      const res = await fetch(`/api/admin/missionaries?${params.toString()}`);
      const data = await res.json();
      setMissionaries(data.missionaries || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error("Failed to fetch missionaries:", e);
      setMissionaries([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchMissionaries();
  }, [fetchMissionaries]);

  // Fetch strategies
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
    const url = isEdit ? `/api/admin/missionaries/${missionaryId}` : "/api/admin/missionaries";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, { method, body: formData });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${isEdit ? 'update' : 'create'} missionary`);
      }
      closeModal();
      fetchMissionaries(); // Refresh list
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };
  
  const handleDelete = async () => {
    if (!selectedMissionary) return;
    try {
      const response = await fetch(`/api/admin/missionaries/${selectedMissionary.id}`, { method: "DELETE" });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete missionary");
      }
      closeModal();
      fetchMissionaries(); // Refresh list
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(p => ({ ...p, page: newPage }));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <PageHeader onAddClick={() => openModal('add')} />
      <StatsCards missionaries={missionaries} />
      <FilterBar filters={filters} onFiltersChange={setFilters} strategies={strategies} />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto relative">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
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

      {!loading && missionaries.length > 0 && (
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
          missionaryName={selectedMissionary.name}
        />
      )}
    </div>
  );
}