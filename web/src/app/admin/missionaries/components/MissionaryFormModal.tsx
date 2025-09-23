import { useState, useEffect } from "react";
import { Missionary, Strategy, SupportNeed } from "../types";
import { X, Save, Plus, Upload, Loader2 } from "lucide-react";

interface MissionaryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData, missionaryId?: string) => void;
  missionary: Missionary | null;
  strategies: Strategy[];
}

const emptyForm: Omit<Missionary, 'id'> = {
  name: "", title: "", email: "", phone: "", location: "", years: 0, focus: "", type: "Full-time", strategy: "", status: "Active", shortBio: "", supportNeeds: []
};

export default function MissionaryFormModal({ isOpen, onClose, onSave, missionary, strategies }: MissionaryFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!missionary;

  useEffect(() => {
    if (missionary) {
      setForm(missionary);
      setImagePreview(missionary.image || null);
    } else {
      setForm(emptyForm);
      setImagePreview(null);
    }
    setSelectedImage(null);
  }, [missionary, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSupportNeedChange = (index: number, field: keyof SupportNeed, value: string | number) => {
    const updatedNeeds = [...(form.supportNeeds || [])];
    updatedNeeds[index] = { ...updatedNeeds[index], [field]: value };
    setForm(prev => ({ ...prev, supportNeeds: updatedNeeds }));
  };
  
  const addSupportNeed = () => {
    const newNeed: SupportNeed = { item: "", amount: "", progress: 0, description: "" };
    setForm(prev => ({ ...prev, supportNeeds: [...(prev.supportNeeds || []), newNeed]}));
  };
  
  const removeSupportNeed = (index: number) => {
    const updatedNeeds = (form.supportNeeds || []).filter((_, i) => i !== index);
    setForm(prev => ({...prev, supportNeeds: updatedNeeds }));
  };
  
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'supportNeeds') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    await onSave(formData, missionary?.id);
    setIsUploading(false);
  };
  
  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
       <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
         <div className="p-6 border-b border-gray-200 flex justify-between items-center">
           <h3 className="text-xl font-bold text-gray-900">{isEditMode ? 'Edit Missionary' : 'Add New Missionary'}</h3>
           <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
             <X className="w-6 h-6" />
           </button>
         </div>
         <form onSubmit={handleSubmit} className="p-6 space-y-4">
           {/* Image Upload Section */}
           <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
            {imagePreview && (
                <div className="mt-2 relative inline-block">
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover border"/>
                </div>
            )}
            <div className="mt-2">
                <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 transition-colors flex items-center space-x-2 w-fit">
                    <Upload className="w-4 h-4" />
                    <span>Choose Image</span>
                    <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                </label>
            </div>
           </div>

           {/* Form Fields */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Name */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
            </div>
            {/* Title */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
            </div>
             {/* Add other fields similarly: email, phone, location, years, focus, website... */}
            {/* Strategy */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Strategy</label>
                <select name="strategyId" value={form.strategyId} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">Select Strategy</option>
                    {strategies.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
            </div>
            {/* Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="type" value={form.type} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                </select>
            </div>
            {/* Status */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
           </div>
           
           {/* Bios */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
             <textarea name="shortBio" value={form.shortBio} onChange={handleChange} required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
           </div>
           {/* Add fullBio and mission textareas */}

           {/* Support Needs */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Support Needs</label>
             {(form.supportNeeds || []).map((need, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50 grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Item" value={need.item} onChange={e => handleSupportNeedChange(index, 'item', e.target.value)} required className="px-2 py-1 border rounded"/>
                    <input type="number" placeholder="Amount" value={need.amount} onChange={e => handleSupportNeedChange(index, 'amount', e.target.value)} required className="px-2 py-1 border rounded"/>
                    <input type="number" placeholder="Progress (%)" value={need.progress} onChange={e => handleSupportNeedChange(index, 'progress', e.target.value)} className="px-2 py-1 border rounded"/>
                    <button type="button" onClick={() => removeSupportNeed(index)} className="text-red-500 hover:text-red-700 text-sm text-right">Remove</button>
                </div>
             ))}
             <button type="button" onClick={addSupportNeed} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">+ Add Support Need</button>
           </div>
           
           <div className="flex justify-end space-x-3 pt-4">
             <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
             <button type="submit" disabled={isUploading} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50">
               {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
               <span>{isUploading ? 'Saving...' : 'Save Changes'}</span>
             </button>
           </div>
         </form>
       </div>
     </div>
  );
}