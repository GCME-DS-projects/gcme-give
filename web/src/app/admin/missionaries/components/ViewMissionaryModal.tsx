import { Missionary } from "@/lib/types";
import { X, Mail, Phone, Globe, Heart, Calendar } from "lucide-react";

interface ViewMissionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionary: Missionary;
}

export default function ViewMissionaryModal({ isOpen, onClose, missionary }: ViewMissionaryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <img src={missionary.user?.image || missionary.image || '/placeholder-user.jpg'} alt={missionary.user?.name || 'Unknown'} className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{missionary.user?.name || 'Unknown'}</h3>
              <p className="text-lg text-gray-600">{missionary.title || 'No title'}</p>
              <p className="text-sm text-gray-500">{missionary.location || 'No location'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Bio */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Biography</h4>
            <p className="text-gray-700 leading-relaxed">{missionary.fullBio || missionary.shortBio}</p>
          </div>
          {/* Mission */}
           {missionary.mission && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Mission Statement</h4>
              <p className="text-gray-700 leading-relaxed">{missionary.mission}</p>
            </div>
           )}
           {/* Prayer Requests */}
           {missionary.prayerRequests && missionary.prayerRequests.length > 0 && (
             <div>
                <h4 className="font-semibold text-gray-900 mb-3">Prayer Requests</h4>
                <ul className="space-y-2">
                    {missionary.prayerRequests.map((req, i) => (
                        <li key={i} className="flex items-start space-x-2">
                            <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{req}</span>
                        </li>
                    ))}
                </ul>
             </div>
           )}
           {/* Support Needs and other sections can be added here */}
        </div>
      </div>
    </div>
  );
}