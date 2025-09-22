"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Eye, MapPin, Calendar, Users, ChevronUp, ChevronDown, Target, Globe, Clock, Search, Download, Mail, Phone, X, Heart, Upload, Save } from "lucide-react";


// Force dynamic rendering to avoid SSG issues with hooks
export const dynamic = 'force-dynamic';

export default function AdminMissionariesPage() {
  const [missionaries, setMissionaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStrategy, setFilterStrategy] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMissionary, setSelectedMissionary] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Fetch missionaries from API
  const fetchMissionaries = async (pageOverride?: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterType !== "all") params.append("type", filterType);
      params.append("page", String(pageOverride || page));
      params.append("limit", String(limit));
      // No filterStrategy param yet, but could be added to API
      const res = await fetch(`/api/admin/missionaries?${params.toString()}`);
      const data = await res.json();
      setMissionaries(data.missionaries || []);
      if (data.pagination) {
        setPage(data.pagination.page);
        setLimit(data.pagination.limit);
        setTotal(data.pagination.total);
        setPages(data.pagination.pages);
      }
    } catch (e) {
      setMissionaries([]);
      setTotal(0);
      setPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMissionaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterStatus, filterType, page, limit]);

  // Fetch strategies from API
  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const res = await fetch("/api/admin/strategies");
        const data = await res.json();
        // Ensure strategies is always an array
        setStrategies(Array.isArray(data) ? data : data.strategies || []);
      } catch (e) {
        setStrategies([]);
      }
    };
    fetchStrategies();
  }, []);

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear image selection
  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Sorting (client-side)
  const sortedMissionaries = [...missionaries].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleView = (missionary: any) => {
    setSelectedMissionary(missionary);
    setShowViewModal(true);
  };

  const handleEdit = (missionary: any) => {
    setSelectedMissionary(missionary);
    // Normalize supportNeeds
    const normalizedSupportNeeds = (missionary.supportNeeds || []).map(
      (need: any) => ({
        ...need,
        amount:
          need.amount !== undefined &&
          need.amount !== null &&
          need.amount !== ""
            ? String(need.amount)
            : "",
        progress:
          need.progress !== undefined &&
          need.progress !== null &&
          need.progress !== ""
            ? String(need.progress)
            : "",
        description: need.description || "",
        item: need.item || "",
      })
    );
    setEditForm({
      ...missionary,
      mission: missionary.mission || "",
      supportNeeds: normalizedSupportNeeds,
      strategyId: missionary.strategyId || "",
    });
    setImagePreview(missionary.image);
    setShowEditModal(true);
  };

  const handleDelete = (missionary: any) => {
    setSelectedMissionary(missionary);
    setShowDeleteModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();

      // Add all form fields
      Object.keys(editForm).forEach((key) => {
        if (key !== "image" && editForm[key] !== undefined) {
          if (Array.isArray(editForm[key])) {
            formData.append(key, JSON.stringify(editForm[key]));
          } else {
            formData.append(key, editForm[key]);
          }
        }
      });

      // Add image if selected
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Add supportNeeds as a JSON string
      formData.append(
        "supportNeeds",
        JSON.stringify(editForm.supportNeeds || [])
      );

      const response = await fetch(`/api/admin/missionaries/${editForm.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedMissionary(null);
        setEditForm({});
        setSelectedImage(null);
        setImagePreview(null);
        fetchMissionaries(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Error updating missionary: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating missionary:", error);
      alert("Failed to update missionary");
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `/api/admin/missionaries/${selectedMissionary.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setShowDeleteModal(false);
        setSelectedMissionary(null);
        fetchMissionaries(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Error deleting missionary: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting missionary:", error);
      alert("Failed to delete missionary");
    }
  };

  const handleAddMissionary = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();

      // Add all form fields
      Object.keys(editForm).forEach((key) => {
        if (key !== "image" && editForm[key] !== undefined) {
          if (Array.isArray(editForm[key])) {
            formData.append(key, JSON.stringify(editForm[key]));
          } else {
            formData.append(key, editForm[key]);
          }
        }
      });

      // Add image if selected
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Add supportNeeds as a JSON string
      formData.append(
        "supportNeeds",
        JSON.stringify(editForm.supportNeeds || [])
      );

      const response = await fetch("/api/admin/missionaries", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditForm({});
        setSelectedImage(null);
        setImagePreview(null);
        fetchMissionaries(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Error creating missionary: ${error.message}`);
      }
    } catch (error) {
      console.error("Error creating missionary:", error);
      alert("Failed to create missionary");
    } finally {
      setUploading(false);
    }
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900"
    >
      <span>{children}</span>
      {sortField === field &&
        (sortDirection === "asc" ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        ))}
    </button>
  );

  // Pagination handlers
  const goToPage = (p: number) => {
    if (p < 1 || p > pages) return;
    setPage(p);
  };
  const goToPrevious = () => goToPage(page - 1);
  const goToNext = () => goToPage(page + 1);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Missionaries Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage Ethiopian missionary profiles, information, and ministry
            assignments
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Missionary</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#001F54] bg-opacity-10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#001F54]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#001F54] opacity-80">
                  Total Missionaries
                </p>
                <p className="text-2xl font-bold text-[#001F54]">
                  {missionaries.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#001F54] bg-opacity-10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-[#001F54]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#001F54] opacity-80">
                  Active
                </p>
                <p className="text-2xl font-bold text-[#001F54]">
                  {missionaries.filter((m) => m.status === "Active").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#001F54] bg-opacity-10 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#001F54]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#001F54] opacity-80">
                  Locations
                </p>
                <p className="text-2xl font-bold text-[#001F54]">
                  {new Set(missionaries.map((m) => m.location)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#001F54] bg-opacity-10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#001F54]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#001F54] opacity-80">
                  Avg. Experience
                </p>
                <p className="text-2xl font-bold text-[#001F54]">7+ years</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search missionaries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
          <select
            value={filterStrategy}
            onChange={(e) => setFilterStrategy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Strategies</option>
            <option value="Digital Missions">Digital Missions</option>
            <option value="Digital Evangelism">Digital Evangelism</option>
            <option value="Digital Mentorship">Digital Mentorship</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Missionaries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto relative">
        {/* Horizontal scroll cue */}
        <div
          className="hidden md:block pointer-events-none absolute right-4 top-4 z-10"
          id="scroll-cue"
        >
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded shadow">
            Scroll &rarr;
          </span>
        </div>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left">
                  <SortableHeader field="name">Missionary</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left">
                  <SortableHeader field="location">Location</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left">
                  <SortableHeader field="focus">Focus Area</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left">
                  <SortableHeader field="type">Type</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left">
                  <SortableHeader field="strategy">Strategy</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left">
                  <SortableHeader field="status">Status</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left">Contact</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedMissionaries.map((missionary) => (
                <tr
                  key={missionary.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={missionary.image || "/placeholder-user.jpg"}
                        alt={missionary.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {missionary.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {missionary.title}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {missionary.years} experience
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {missionary.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 max-w-xs truncate block">
                      {missionary.focus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        missionary.type === "Full-time"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {missionary.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {missionary.strategy}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        missionary.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {missionary.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate max-w-32">
                          {missionary.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {missionary.phone}
                        </span>
                      </div>
                      {missionary.website && (
                        <div className="flex items-center space-x-1">
                          <Globe className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate max-w-32">
                            {missionary.website}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleView(missionary)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(missionary)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(missionary)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing page {page} of {pages} ({total} missionaries)
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={goToPrevious}
                  aria-disabled={page === 1}
                  tabIndex={page === 1 ? -1 : 0}
                  style={{
                    pointerEvents: page === 1 ? "none" : undefined,
                    opacity: page === 1 ? 0.5 : 1,
                  }}
                />
              </PaginationItem>
              {Array.from({ length: pages }).map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    isActive={page === idx + 1}
                    onClick={() => goToPage(idx + 1)}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={goToNext}
                  aria-disabled={page === pages}
                  tabIndex={page === pages ? -1 : 0}
                  style={{
                    pointerEvents: page === pages ? "none" : undefined,
                    opacity: page === pages ? 0.5 : 1,
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* View Missionary Modal */}
      {showViewModal && selectedMissionary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedMissionary.image}
                    alt={selectedMissionary.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedMissionary.name}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {selectedMissionary.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedMissionary.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedMissionary.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedMissionary.phone}
                      </span>
                    </div>
                    {selectedMissionary.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {selectedMissionary.website}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Ministry Details
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Focus Area:</span>
                      <p className="text-gray-700">
                        {selectedMissionary.focus}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Strategy:</span>
                      <p className="text-gray-700">
                        {selectedMissionary.strategy}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Experience:</span>
                      <p className="text-gray-700">
                        {selectedMissionary.years}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedMissionary.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedMissionary.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Biography</h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedMissionary.fullBio}
                </p>
              </div>

              {/* Mission */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Mission Statement
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedMissionary.mission}
                </p>
              </div>

              {/* Prayer Requests */}
              {selectedMissionary.prayerRequests &&
                selectedMissionary.prayerRequests.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Prayer Requests
                    </h4>
                    <ul className="space-y-2">
                      {selectedMissionary.prayerRequests.map(
                        (request: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{request}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {/* Recent Updates */}
              {selectedMissionary.recentUpdates &&
                selectedMissionary.recentUpdates.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Recent Updates
                    </h4>
                    <div className="space-y-4">
                      {selectedMissionary.recentUpdates.map(
                        (update: any, index: number) => (
                          <div
                            key={index}
                            className="border-l-4 border-blue-500 pl-4"
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {update.date}
                              </span>
                            </div>
                            <h5 className="font-medium text-gray-900 mb-1">
                              {update.title}
                            </h5>
                            <p className="text-gray-700">{update.content}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Support Needs */}
              {selectedMissionary.supportNeeds &&
                selectedMissionary.supportNeeds.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Support Needs
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedMissionary.supportNeeds.map(
                        (need: any, index: number) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900">
                                {need.item}
                              </h5>
                              <span className="text-lg font-bold text-blue-600">
                                {need.amount}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {need.description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Missionary Modal */}
      {showEditModal && selectedMissionary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Edit Missionary
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit(e);
              }}
              className="p-6 space-y-4"
            >
              {/* Image Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Image
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={clearImageSelection}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* File Input */}
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 transition-colors flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Choose Image</span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  {selectedImage && (
                    <span className="text-sm text-gray-600">
                      {selectedImage.name}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.phone || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={editForm.years || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, years: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Focus Area
                  </label>
                  <input
                    type="text"
                    value={editForm.focus || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, focus: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strategy
                  </label>
                  <select
                    value={editForm.strategyId || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, strategyId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Strategy</option>
                    {strategies.map((strategy) => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={editForm.type || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.status || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    value={editForm.website || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, website: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Bio
                </label>
                <textarea
                  value={editForm.shortBio || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, shortBio: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Bio
                </label>
                <textarea
                  value={editForm.fullBio || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullBio: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mission Statement
                </label>
                <textarea
                  value={editForm.mission || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, mission: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Support Needs Editing Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Needs
                </label>
                {(editForm.supportNeeds || []).map((need: any, idx: number) => (
                  <div
                    key={idx}
                    className="mb-4 p-4 border rounded-lg bg-gray-50 relative"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Item"
                        value={need.item || ""}
                        onChange={(e) => {
                          const updated = [...editForm.supportNeeds];
                          updated[idx].item = e.target.value;
                          setEditForm({ ...editForm, supportNeeds: updated });
                        }}
                        className="px-2 py-1 border rounded w-full"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={
                          need.amount !== undefined && need.amount !== null
                            ? need.amount
                            : ""
                        }
                        onChange={(e) => {
                          const updated = [...editForm.supportNeeds];
                          updated[idx].amount =
                            e.target.value === "" ? "" : Number(e.target.value);
                          setEditForm({ ...editForm, supportNeeds: updated });
                        }}
                        className="px-2 py-1 border rounded w-full"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Progress (%)"
                        min={0}
                        max={100}
                        value={
                          need.progress !== undefined && need.progress !== null
                            ? need.progress
                            : ""
                        }
                        onChange={(e) => {
                          const updated = [...editForm.supportNeeds];
                          updated[idx].progress =
                            e.target.value === "" ? "" : Number(e.target.value);
                          setEditForm({ ...editForm, supportNeeds: updated });
                        }}
                        className="px-2 py-1 border rounded w-full"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={need.description || ""}
                        onChange={(e) => {
                          const updated = [...editForm.supportNeeds];
                          updated[idx].description = e.target.value;
                          setEditForm({ ...editForm, supportNeeds: updated });
                        }}
                        className="px-2 py-1 border rounded w-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...editForm.supportNeeds];
                        updated.splice(idx, 1);
                        setEditForm({ ...editForm, supportNeeds: updated });
                      }}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setEditForm({
                      ...editForm,
                      supportNeeds: [
                        ...(editForm.supportNeeds || []),
                        { item: "", amount: "", progress: 0, description: "" },
                      ],
                    });
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  + Add Support Need
                </button>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Missionary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Add New Missionary
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditForm({});
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddMissionary} className="p-6 space-y-4">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Image
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={clearImageSelection}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* File Input */}
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 transition-colors flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Choose Image</span>
                    <input
                      id="image-upload-add"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  {selectedImage && (
                    <span className="text-sm text-gray-600">
                      {selectedImage.name}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.phone || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={editForm.years || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, years: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Focus Area
                  </label>
                  <input
                    type="text"
                    value={editForm.focus || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, focus: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strategy
                  </label>
                  <select
                    value={editForm.strategyId || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, strategyId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Strategy</option>
                    {strategies.map((strategy) => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={editForm.type || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.status || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    value={editForm.website || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, website: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Bio
                </label>
                <textarea
                  value={editForm.shortBio || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, shortBio: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Bio
                </label>
                <textarea
                  value={editForm.fullBio || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullBio: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mission Statement
                </label>
                <textarea
                  value={editForm.mission || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, mission: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Support Needs Editing Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Needs
                </label>
                {(editForm.supportNeeds || []).map((need: any, idx: number) => (
                  <div
                    key={idx}
                    className="mb-4 p-4 border rounded-lg bg-gray-50 relative"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Item"
                        value={need.item || ""}
                        onChange={(e) => {
                          const updated = [...editForm.supportNeeds];
                          updated[idx].item = e.target.value;
                          setEditForm({ ...editForm, supportNeeds: updated });
                        }}
                        className="px-2 py-1 border rounded w-full"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={
                          need.amount !== undefined && need.amount !== null
                            ? need.amount
                            : ""
                        }
                        onChange={(e) => {
                          const updated = [...editForm.supportNeeds];
                          updated[idx].amount =
                            e.target.value === "" ? "" : Number(e.target.value);
                          setEditForm({ ...editForm, supportNeeds: updated });
                        }}
                        className="px-2 py-1 border rounded w-full"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Progress (%)"
                        min={0}
                        max={100}
                        value={
                          need.progress !== undefined && need.progress !== null
                            ? need.progress
                            : ""
                        }
                        onChange={(e) => {
                          const updated = [...editForm.supportNeeds];
                          updated[idx].progress =
                            e.target.value === "" ? "" : Number(e.target.value);
                          setEditForm({ ...editForm, supportNeeds: updated });
                        }}
                        className="px-2 py-1 border rounded w-full"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={need.description || ""}
                        onChange={(e) => {
                          const updated = [...editForm.supportNeeds];
                          updated[idx].description = e.target.value;
                          setEditForm({ ...editForm, supportNeeds: updated });
                        }}
                        className="px-2 py-1 border rounded w-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...editForm.supportNeeds];
                        updated.splice(idx, 1);
                        setEditForm({ ...editForm, supportNeeds: updated });
                      }}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setEditForm({
                      ...editForm,
                      supportNeeds: [
                        ...(editForm.supportNeeds || []),
                        { item: "", amount: "", progress: 0, description: "" },
                      ],
                    });
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  + Add Support Need
                </button>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditForm({});
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{uploading ? "Creating..." : "Create Missionary"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Delete Missionary
              </h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete {selectedMissionary?.name}? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
