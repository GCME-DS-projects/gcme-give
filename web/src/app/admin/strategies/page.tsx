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
import { Plus, Edit, Trash2, Eye, MapPin, Calendar, Users, ChevronUp, ChevronDown, Target, Globe, Clock, Search, Download, Loader2, Mail, Phone, X, Heart, Upload, Save } from "lucide-react";

// Force dynamic rendering to avoid SSG issues with hooks
export const dynamic = 'force-dynamic';

const fetchStrategies = async () => {
  const res = await fetch("/api/admin/strategies");
  if (!res.ok) throw new Error("Failed to fetch strategies");
  return res.json();
};

const createStrategy = async (data: any) => {
  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;
  const res = await fetch("/api/admin/strategies", {
    method: "POST",
    ...(isFormData
      ? { body: data }
      : {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
  });
  if (!res.ok) throw new Error("Failed to create strategy");
  return res.json();
};

const StrategiesPage = () => {
  
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    fullDescription: "",
    slug: "",
    icon: "",
    activities: "",
    visionText: "",
    involvedText: "",
    impactQuote: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  const loadStrategies = async () => {
    setLoading(true);
    try {
      const data = await fetchStrategies();
      setStrategies(
        Array.isArray(data.strategies)
          ? data.strategies.filter((s: any) => !s.isDeleted)
          : []
      );
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStrategies();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "activities") {
          formData.append(
            key,
            JSON.stringify(value.split(",").map((a: string) => a.trim()))
          );
        } else {
          formData.append(key, value);
        }
      });
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await createStrategy(formData);
      setShowAddModal(false);
      setForm({
        title: "",
        description: "",
        fullDescription: "",
        slug: "",
        icon: "",
        activities: "",
        visionText: "",
        involvedText: "",
        impactQuote: "",
      });
      await loadStrategies();
    } catch (e: any) {
      setError(e.message);
    }
    setSaving(false);
  };

  const handleDelete = async (strategyId: string) => {
    if (!window.confirm("Are you sure you want to delete this strategy?"))
      return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/strategies/${strategyId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete strategy");
      setStrategies((prev) => prev.filter((s) => s.id !== strategyId));
    } catch (e: any) {
      setError(e.message);
    }
    setSaving(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Strategies Management
          </h1>
          <p className="text-gray-600">
            Manage mission strategies, activities, and vision
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Strategy</span>
        </button>
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : strategies.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No strategies found
            </h3>
            <p className="text-gray-600 mb-6">
              Click "Add Strategy" to create your first strategy.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-left">Slug</th>
                <th className="px-6 py-4 text-left">Activities</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {strategies.map((strategy) => (
                <tr
                  key={strategy.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {strategy.title}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {strategy.description}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{strategy.slug}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {Array.isArray(strategy.activities)
                      ? strategy.activities.join(", ")
                      : ""}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedStrategy(strategy);
                          setShowViewModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedStrategy(strategy);
                          setEditForm({
                            ...strategy,
                            activities: Array.isArray(strategy.activities)
                              ? strategy.activities.join(", ")
                              : "",
                          });
                          setImageFile(null);
                          setImagePreview(null);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(strategy.id)}
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
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Add Strategy
            </h3>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <div className="grid grid-cols-1 gap-5 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description
                </label>
                <textarea
                  value={form.fullDescription}
                  onChange={(e) =>
                    setForm({ ...form, fullDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activities (comma separated)
                </label>
                <textarea
                  value={form.activities}
                  onChange={(e) =>
                    setForm({ ...form, activities: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vision Text
                </label>
                <textarea
                  value={form.visionText}
                  onChange={(e) =>
                    setForm({ ...form, visionText: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Involved Text
                </label>
                <textarea
                  value={form.involvedText}
                  onChange={(e) =>
                    setForm({ ...form, involvedText: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impact Quote
                </label>
                <textarea
                  value={form.impactQuote}
                  onChange={(e) =>
                    setForm({ ...form, impactQuote: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) =>
                        setImagePreview(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                  className="mb-2"
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-40 object-cover rounded mb-2"
                  />
                ) : null}
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* View Modal */}
      {showViewModal && selectedStrategy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Strategy Details
            </h3>
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-500 font-semibold">Title</div>
                <div className="font-medium text-gray-900">
                  {selectedStrategy.title}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Slug</div>
                <div className="text-gray-800">{selectedStrategy.slug}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Icon</div>
                <div className="text-gray-800">{selectedStrategy.icon}</div>
              </div>
            </div>
            {/* Description */}
            <div className="mb-6">
              <div className="text-xs text-gray-500 font-semibold mb-1">
                Description
              </div>
              <div className="text-gray-800">
                {selectedStrategy.description}
              </div>
            </div>
            {/* Full Description */}
            <div className="mb-6">
              <div className="text-xs text-gray-500 font-semibold mb-1">
                Full Description
              </div>
              <div className="text-gray-800 whitespace-pre-line max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                {selectedStrategy.fullDescription}
              </div>
            </div>
            {/* Activities */}
            <div className="mb-6">
              <div className="text-xs text-gray-500 font-semibold mb-1">
                Activities
              </div>
              <ul className="list-disc list-inside text-gray-800">
                {Array.isArray(selectedStrategy.activities)
                  ? selectedStrategy.activities.map((a: string, i: number) => (
                      <li key={i}>{a}</li>
                    ))
                  : null}
              </ul>
            </div>
            {/* Vision Text */}
            {selectedStrategy.visionText && (
              <div className="mb-4">
                <div className="text-xs text-gray-500 font-semibold mb-1">
                  Vision Text
                </div>
                <div className="text-gray-800">
                  {selectedStrategy.visionText}
                </div>
              </div>
            )}
            {/* Involved Text */}
            {selectedStrategy.involvedText && (
              <div className="mb-4">
                <div className="text-xs text-gray-500 font-semibold mb-1">
                  Involved Text
                </div>
                <div className="text-gray-800">
                  {selectedStrategy.involvedText}
                </div>
              </div>
            )}
            {/* Impact Quote */}
            {selectedStrategy.impactQuote && (
              <div className="mb-4">
                <div className="text-xs text-gray-500 font-semibold mb-1">
                  Impact Quote
                </div>
                <div className="italic text-gray-700">
                  {selectedStrategy.impactQuote}
                </div>
              </div>
            )}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showEditModal && selectedStrategy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              setError("");
              try {
                const formData = new FormData();
                Object.entries(editForm).forEach(([key, value]) => {
                  if (key === "activities") {
                    formData.append(
                      key,
                      JSON.stringify(
                        (value as string).split(",").map((a: string) => a.trim())
                      )
                    );
                  } else if (key !== "image") {
                    formData.append(key, value as string);
                  }
                });
                if (imageFile) {
                  formData.append("image", imageFile);
                } else if (imagePreview === null && editForm.image === null) {
                  // User removed the image
                  formData.append("image", "null");
                }
                const res = await fetch(
                  `/api/admin/strategies/${selectedStrategy.id}`,
                  {
                    method: "PUT",
                    body: formData,
                  }
                );
                if (!res.ok) throw new Error("Failed to update strategy");
                setShowEditModal(false);
                setSelectedStrategy(null);
                setEditForm({});
                await loadStrategies();
              } catch (e: any) {
                setError(e.message);
              }
              setSaving(false);
            }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Strategy
            </h3>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <div className="grid grid-cols-1 gap-5 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={editForm.slug}
                  onChange={(e) =>
                    setEditForm({ ...editForm, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  value={editForm.icon}
                  onChange={(e) =>
                    setEditForm({ ...editForm, icon: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description
                </label>
                <textarea
                  value={editForm.fullDescription}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      fullDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activities (comma separated)
                </label>
                <textarea
                  value={editForm.activities}
                  onChange={(e) =>
                    setEditForm({ ...editForm, activities: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vision Text
                </label>
                <textarea
                  value={editForm.visionText}
                  onChange={(e) =>
                    setEditForm({ ...editForm, visionText: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Involved Text
                </label>
                <textarea
                  value={editForm.involvedText}
                  onChange={(e) =>
                    setEditForm({ ...editForm, involvedText: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impact Quote
                </label>
                <textarea
                  value={editForm.impactQuote}
                  onChange={(e) =>
                    setEditForm({ ...editForm, impactQuote: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) =>
                        setImagePreview(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                  className="mb-2"
                />
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-40 object-cover rounded mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setEditForm({ ...editForm, image: null });
                        setImageFile(null);
                      }}
                      className="text-red-500 text-xs underline mt-1"
                    >
                      Remove Image
                    </button>
                  </>
                ) : editForm.image ? (
                  <>
                    <img
                      src={`data:image/jpeg;base64,${editForm.image}`}
                      alt="Current"
                      className="w-full max-h-40 object-cover rounded mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setEditForm({ ...editForm, image: null });
                        setImageFile(null);
                      }}
                      className="text-red-500 text-xs underline mt-1"
                    >
                      Remove Image
                    </button>
                  </>
                ) : null}
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StrategiesPage;
