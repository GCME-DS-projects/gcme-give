'use client';

import { useState, useEffect } from 'react';
import { useCreateMissionary, useUpdateMissionary, useMissionary } from '@/lib/hooks/use-missionaries';
import { CreateMissionaryDto, UpdateMissionaryDto, Missionary } from '@/lib/missionaries-api';

interface MissionaryFormProps {
  missionaryId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function MissionaryForm({ missionaryId, onSuccess, onCancel }: MissionaryFormProps) {
  const isEditing = !!missionaryId;
  const { missionary, loading: loadingMissionary } = useMissionary(missionaryId || '');
  const { createMissionary, loading: creating } = useCreateMissionary();
  const { updateMissionary, loading: updating } = useUpdateMissionary();
  
  const [formData, setFormData] = useState<CreateMissionaryDto>({
    userId: '',
    title: '',
    phone: '',
    shortBio: '',
    fullBio: '',
    location: '',
    qualification: '',
    website: '',
    experience: '',
    years: '',
    mission: '',
    focus: '',
    status: 'active',
    prayerRequests: [],
    type: '',
    role: '',
    livesImpacted: 0,
    communitiesServed: 0,
    projectsCompleted: 0,
    region: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && missionary) {
      setFormData({
        userId: missionary.userId,
        title: missionary.title || '',
        phone: missionary.phone || '',
        shortBio: missionary.shortBio || '',
        fullBio: missionary.fullBio || '',
        location: missionary.location || '',
        qualification: missionary.qualification || '',
        website: missionary.website || '',
        experience: missionary.experience || '',
        years: missionary.years || '',
        mission: missionary.mission || '',
        focus: missionary.focus || '',
        status: missionary.status || 'active',
        prayerRequests: missionary.prayerRequests || [],
        type: missionary.type || '',
        role: missionary.role || '',
        livesImpacted: missionary.livesImpacted || 0,
        communitiesServed: missionary.communitiesServed || 0,
        projectsCompleted: missionary.projectsCompleted || 0,
        region: missionary.region || '',
      });
    }
  }, [isEditing, missionary]);

  const handleInputChange = (field: keyof CreateMissionaryDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    }

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && missionaryId) {
        await updateMissionary(missionaryId, formData);
      } else {
        await createMissionary(formData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save missionary:', error);
    }
  };

  const loading = creating || updating || loadingMissionary;

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg font-semibold text-gray-700">Loading missionary...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Missionary' : 'Create New Missionary'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID *
              </label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) => handleInputChange('userId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.userId ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter user ID"
                disabled={isEditing}
              />
              {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter missionary title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.website ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://example.com"
              />
              {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>

          {/* Bio Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Bio
            </label>
            <textarea
              value={formData.shortBio}
              onChange={(e) => handleInputChange('shortBio', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the missionary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Bio
            </label>
            <textarea
              value={formData.fullBio}
              onChange={(e) => handleInputChange('fullBio', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed biography of the missionary"
            />
          </div>

          {/* Mission Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Statement
              </label>
              <textarea
                value={formData.mission}
                onChange={(e) => handleInputChange('mission', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mission statement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus Area
              </label>
              <input
                type="text"
                value={formData.focus}
                onChange={(e) => handleInputChange('focus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Primary focus area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Years of experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualification
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => handleInputChange('qualification', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Educational qualifications"
              />
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lives Impacted
              </label>
              <input
                type="number"
                value={formData.livesImpacted}
                onChange={(e) => handleInputChange('livesImpacted', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communities Served
              </label>
              <input
                type="number"
                value={formData.communitiesServed}
                onChange={(e) => handleInputChange('communitiesServed', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projects Completed
              </label>
              <input
                type="number"
                value={formData.projectsCompleted}
                onChange={(e) => handleInputChange('projectsCompleted', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>

          {/* Prayer Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prayer Requests
            </label>
            <textarea
              value={formData.prayerRequests?.join('\n') || ''}
              onChange={(e) => handleInputChange('prayerRequests', e.target.value.split('\n').filter(line => line.trim()))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter prayer requests, one per line"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Missionary' : 'Create Missionary')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
