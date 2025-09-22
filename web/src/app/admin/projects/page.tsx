"use client";

import { useState, useEffect } from "react";
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
import { Plus, Edit, Trash2, Eye, ChevronUp, ChevronDown, MapPin, Calendar, TrendingUp, BarChart3, Search, DollarSign, Target, Users, Loader2 } from "lucide-react";


// Force dynamic rendering to avoid SSG issues with hooks
export const dynamic = 'force-dynamic';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goal: "",
    raised: "",
    status: "active",
    image: "",
    location: "",
    category: "",
    startDate: "",
    endDate: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch projects
        const projectsResponse = await fetch(
          `/api/admin/projects?page=${page}&limit=${limit}`
        );
        if (!projectsResponse.ok) throw new Error("Failed to fetch projects");
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects || []);
        setTotal(projectsData.pagination?.total || 0);
        setPages(projectsData.pagination?.pages || 1);

        // Fetch strategies
        const strategiesResponse = await fetch("/api/admin/strategies");
        if (!strategiesResponse.ok)
          throw new Error("Failed to fetch strategies");
        const strategiesData = await strategiesResponse.json();
        setStrategies(
          Array.isArray(strategiesData.strategies)
            ? strategiesData.strategies
            : []
        );

        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setStrategies([]);
        setIsLoading(false);
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [page, limit]);

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.shortDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || project.status === filterStatus;
      const matchesCategory =
        filterCategory === "all" || project.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
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

  const handleDelete = (project: any) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedProject) {
      try {
        const response = await fetch(
          `/api/admin/projects/${selectedProject.id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete project");
        }
        setProjects(projects.filter((p) => p.id !== selectedProject.id));
        setShowDeleteModal(false);
        setSelectedProject(null);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleView = (project: any) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleEdit = (project: any) => {
    setEditForm({
      ...project,
      urgencyFactors: Array.isArray(project.urgencyFactors)
        ? project.urgencyFactors
        : [],
      impact: Array.isArray(project.impact) ? project.impact : [],
      timeLine:
        project.timeLine && typeof project.timeLine === "object"
          ? project.timeLine
          : {},
      testimonials: Array.isArray(project.testimonials)
        ? project.testimonials
        : [],
      beneficiaries: project.beneficiaries || "",
      problem: project.problem || "",
      solution: project.solution || "",
      urgency: project.urgency ? String(project.urgency) : "",
      teamSize: project.teamSize || "",
      fundingGoal: project.fundingGoal || "",
      fundingRaised: project.fundingRaised || "",
      category: project.category ? String(project.category) : "",
      location: project.location || "",
      duration: project.duration || "",
      strategyId: project.strategyId ? String(project.strategyId) : "",
      image: project.image || null,
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle different input types
    if (name === "fundingGoal" || name === "fundingRaised") {
      // Convert to number for funding fields
      setEditForm({ ...editForm, [name]: parseFloat(value) || 0 });
    } else if (name === "urgencyFactors" || name === "impact") {
      // Handle array fields
      const items = value.split("\n").filter((item) => item.trim() !== "");
      setEditForm({ ...editForm, [name]: items });
    } else if (name === "timeLine" || name === "testimonials") {
      // Handle JSON fields
      try {
        const jsonValue = JSON.parse(value);
        setEditForm({ ...editForm, [name]: jsonValue });
      } catch (err) {
        // Keep the string value even if invalid JSON
        setEditForm({ ...editForm, [name]: value });
      }
    } else {
      // Handle all other fields as strings
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditSave = async () => {
    try {
      // Generate slug from title if not present
      const formData = {
        ...editForm,
        slug:
          editForm.slug || editForm.title.toLowerCase().replace(/\s+/g, "-"),
      };

      // Send update request to API
      const response = await fetch(`/api/admin/projects/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      // Update local state
      setProjects(projects.map((p) => (p.id === formData.id ? formData : p)));
      setShowEditModal(false);
    } catch (err: any) {
      setError(err.message);
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

  const ProjectCard = ({ project }: { project: any }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {project.shortDescription}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{project.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{project.teamSize}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            project.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {project.status}
        </span>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Funding Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">
            ${project.fundingRaised.toLocaleString()}
          </span>
          <span className="text-gray-900 font-medium">
            ${project.fundingGoal.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{project.category}</span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-600">{project.strategy}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(project)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(project)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(project)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Pagination controls
  const renderPagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
      >
        Previous
      </button>
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 rounded ${
            page === i + 1
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => setPage((p) => Math.min(pages, p + 1))}
        disabled={page === pages}
        className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
      >
        Next
      </button>
      <span className="ml-4 text-gray-500">
        Page {page} of {pages} ({total} projects)
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 bg-[#f4f8fb]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#001F54]"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-red-600 py-8 bg-[#f4f8fb]">{error}</div>
    );
  }

  return (
    <div className="p-8 bg-[#f4f8fb] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#001F54]">
            Projects Management
          </h1>
          <p className="text-[#001F54] opacity-80 mt-2">
            Manage mission projects, funding goals, and progress tracking
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#001F54] text-white px-6 py-3 rounded-lg hover:bg-[#001F54]/90 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#001F54] opacity-80">
                Total Projects
              </p>
              <p className="text-3xl font-bold text-[#001F54]">
                {projects.length}
              </p>
            </div>
            <div className="p-3 bg-[#001F54] bg-opacity-10 rounded-lg">
              <Target className="w-6 h-6 text-[#001F54]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#001F54] opacity-80">
                Total Funding Goal
              </p>
              <p className="text-3xl font-bold text-[#001F54]">
                $
                {projects
                  .reduce((sum, p) => sum + (Number(p.fundingGoal) || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-[#001F54] bg-opacity-10 rounded-lg">
              <DollarSign className="w-6 h-6 text-[#001F54]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#001F54] opacity-80">
                Total Raised
              </p>
              <p className="text-3xl font-bold text-[#001F54]">
                $
                {projects
                  .reduce((sum, p) => sum + (Number(p.fundingRaised) || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-[#001F54] bg-opacity-10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-[#001F54]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#001F54] opacity-80">
                Avg. Progress
              </p>
              <p className="text-3xl font-bold text-[#001F54]">
                {projects.length > 0
                  ? Math.round(
                      projects.reduce(
                        (sum, p) => sum + (Number(p.progress) || 0),
                        0
                      ) / projects.length
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="p-3 bg-[#001F54] bg-opacity-10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-[#001F54]" />
            </div>
          </div>
        </div>
      </div>
      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#001F54] opacity-60 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F54] focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F54] focus:border-transparent text-[#001F54]"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Paused">Paused</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F54] focus:border-transparent text-[#001F54]"
        >
          <option value="all">All Categories</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Education">Education</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Community">Community</option>
        </select>
        {/* <button className="px-4 py-2 bg-[#001F54] text-white rounded-lg hover:bg-[#001F54]/90 transition-colors flex items-center justify-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button> */}
      </div>
      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#001F54] mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-[#001F54] opacity-80 mb-2">
                  {project.shortDescription}
                </p>
                <div className="flex items-center space-x-4 text-sm text-[#001F54] opacity-80">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{project.teamSize}</span>
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {project.status}
              </span>
            </div>
            <div className="flex justify-between text-sm text-[#001F54] opacity-80 mb-1">
              <span>Funding Progress</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-[#001F54] bg-opacity-10 rounded-full h-2">
              <div
                className="bg-[#001F54] h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-[#001F54] opacity-80">
                ${project.fundingRaised.toLocaleString()}
              </span>
              <span className="text-[#001F54] font-medium">
                ${project.fundingGoal.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#001F54] opacity-80">
                  {project.category}
                </span>
                <span className="text-sm text-[#001F54] opacity-40">•</span>
                <span className="text-sm text-[#001F54] opacity-80">
                  {project.strategy}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleView(project)}
                  className="p-2 text-[#001F54] hover:bg-[#001F54] hover:bg-opacity-10 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-[#001F54] opacity-30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#001F54] mb-2">
            No projects found
          </h3>
          <p className="text-[#001F54] opacity-60 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#001F54] text-white px-6 py-3 rounded-lg hover:bg-[#001F54]/90 transition-colors"
          >
            Create Your First Project
          </button>
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
                Delete Project
              </h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{selectedProject?.title}"? This
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
      {/* View Modal */}
      {showViewModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full">
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">
                Project Details
              </h3>
            </div>
            <div className="mb-4">
              <div className="font-semibold">{selectedProject.title}</div>
              <div className="text-gray-600 mb-2">
                {selectedProject.shortDescription}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Category: {selectedProject.category}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Location: {selectedProject.location}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Duration: {selectedProject.duration}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Team Size: {selectedProject.teamSize}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Funding Goal: ${selectedProject.fundingGoal?.toLocaleString?.()}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Funding Raised: $
                {selectedProject.fundingRaised?.toLocaleString?.()}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Progress: {selectedProject.progress}%
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Strategy: {selectedProject.strategy}
              </div>
            </div>
            <button
              onClick={() => setShowViewModal(false)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 w-full mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full">
            <div className="flex items-center mb-4">
              <Edit className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">Edit Project</h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSave();
              }}
              className="max-h-[70vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 gap-4 p-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    name="shortDescription"
                    value={editForm.shortDescription}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Community">Community</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    name="location"
                    value={editForm.location}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    name="duration"
                    value={editForm.duration}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 6 months"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Size
                  </label>
                  <input
                    name="teamSize"
                    value={editForm.teamSize}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5-10 people"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funding Goal ($)
                  </label>
                  <input
                    name="fundingGoal"
                    type="number"
                    value={editForm.fundingGoal}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funding Raised ($)
                  </label>
                  <input
                    name="fundingRaised"
                    type="number"
                    value={editForm.fundingRaised}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beneficiaries
                  </label>
                  <input
                    name="beneficiaries"
                    value={editForm.beneficiaries}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 1000 students"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Problem Statement
                  </label>
                  <textarea
                    name="problem"
                    value={editForm.problem}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Solution
                  </label>
                  <textarea
                    name="solution"
                    value={editForm.solution}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency
                  </label>
                  <select
                    name="urgency"
                    value={editForm.urgency}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select urgency level</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency Factors (one per line)
                  </label>
                  <textarea
                    name="urgencyFactors"
                    value={editForm.urgencyFactors?.join("\n") || ""}
                    onChange={(e) => {
                      const factors = e.target.value
                        .split("\n")
                        .filter((factor) => factor.trim() !== "");
                      setEditForm({ ...editForm, urgencyFactors: factors });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter each factor on a new line"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact Points (one per line)
                  </label>
                  <textarea
                    name="impact"
                    value={editForm.impact?.join("\n") || ""}
                    onChange={(e) => {
                      const impacts = e.target.value
                        .split("\n")
                        .filter((impact) => impact.trim() !== "");
                      setEditForm({ ...editForm, impact: impacts });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter each impact point on a new line"
                  />
                </div>

                {/* Timeline Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeline
                  </label>
                  {(Array.isArray(editForm.timeLine)
                    ? editForm.timeLine
                    : Object.entries(editForm.timeLine || {})
                  ).map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Phase"
                        value={Array.isArray(item) ? item[0] : item.phase || ""}
                        onChange={(e) => {
                          let newTimeline = Array.isArray(editForm.timeLine)
                            ? [...editForm.timeLine]
                            : Object.entries(editForm.timeLine || {});
                          if (Array.isArray(item))
                            newTimeline[idx][0] = e.target.value;
                          else newTimeline[idx].phase = e.target.value;
                          setEditForm({
                            ...editForm,
                            timeLine: Object.fromEntries(newTimeline),
                          });
                        }}
                        className="w-1/3 px-2 py-1 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={
                          Array.isArray(item) ? item[1] : item.description || ""
                        }
                        onChange={(e) => {
                          let newTimeline = Array.isArray(editForm.timeLine)
                            ? [...editForm.timeLine]
                            : Object.entries(editForm.timeLine || {});
                          if (Array.isArray(item))
                            newTimeline[idx][1] = e.target.value;
                          else newTimeline[idx].description = e.target.value;
                          setEditForm({
                            ...editForm,
                            timeLine: Object.fromEntries(newTimeline),
                          });
                        }}
                        className="w-2/3 px-2 py-1 border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          let newTimeline = Array.isArray(editForm.timeLine)
                            ? [...editForm.timeLine]
                            : Object.entries(editForm.timeLine || {});
                          newTimeline.splice(idx, 1);
                          setEditForm({
                            ...editForm,
                            timeLine: Object.fromEntries(newTimeline),
                          });
                        }}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      let newTimeline = Array.isArray(editForm.timeLine)
                        ? [...editForm.timeLine]
                        : Object.entries(editForm.timeLine || {});
                      newTimeline.push(["", ""]);
                      setEditForm({
                        ...editForm,
                        timeLine: Object.fromEntries(newTimeline),
                      });
                    }}
                    className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded"
                  >
                    Add Phase
                  </button>
                </div>

                {/* Testimonials Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Testimonials
                  </label>
                  {(Array.isArray(editForm.testimonials)
                    ? editForm.testimonials
                    : []
                  ).map((testimonial: any, idx: number) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={testimonial.name || ""}
                        onChange={(e) => {
                          let newTestimonials = [...editForm.testimonials];
                          newTestimonials[idx].name = e.target.value;
                          setEditForm({
                            ...editForm,
                            testimonials: newTestimonials,
                          });
                        }}
                        className="w-1/4 px-2 py-1 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        value={testimonial.role || ""}
                        onChange={(e) => {
                          let newTestimonials = [...editForm.testimonials];
                          newTestimonials[idx].role = e.target.value;
                          setEditForm({
                            ...editForm,
                            testimonials: newTestimonials,
                          });
                        }}
                        className="w-1/4 px-2 py-1 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Quote"
                        value={testimonial.quote || ""}
                        onChange={(e) => {
                          let newTestimonials = [...editForm.testimonials];
                          newTestimonials[idx].quote = e.target.value;
                          setEditForm({
                            ...editForm,
                            testimonials: newTestimonials,
                          });
                        }}
                        className="w-2/4 px-2 py-1 border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          let newTestimonials = [...editForm.testimonials];
                          newTestimonials.splice(idx, 1);
                          setEditForm({
                            ...editForm,
                            testimonials: newTestimonials,
                          });
                        }}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      let newTestimonials = Array.isArray(editForm.testimonials)
                        ? [...editForm.testimonials]
                        : [];
                      newTestimonials.push({ name: "", role: "", quote: "" });
                      setEditForm({
                        ...editForm,
                        testimonials: newTestimonials,
                      });
                    }}
                    className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded"
                  >
                    Add Testimonial
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strategy
                  </label>
                  <select
                    name="strategyId"
                    value={editForm.strategyId || ""}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="">
                      {isLoading ? "Loading strategies..." : "Select a strategy"}
                    </option>
                    {strategies.map((strategy) => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Image
                  </label>
                  {/* Image Preview */}
                  {editForm.image &&
                    (typeof editForm.image === "string" ||
                      editForm.image instanceof ArrayBuffer) && (
                      <div className="mb-2">
                        <img
                          src={
                            typeof editForm.image === "string"
                              ? editForm.image.startsWith("data:")
                                ? editForm.image
                                : `data:image/jpeg;base64,${editForm.image}`
                              : URL.createObjectURL(new Blob([editForm.image]))
                          }
                          alt="Project Preview"
                          className="w-32 h-32 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditForm({ ...editForm, image: null })
                          }
                          className="block mt-1 text-red-500 text-xs underline"
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  <input
                    type="file"
                    name="image"
                    id="project-image-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
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
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setEditForm({
                            ...editForm,
                            image: event.target?.result,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {renderPagination()}
    </div>
  );
};
