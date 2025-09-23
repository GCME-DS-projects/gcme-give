'use client';

import { useRouter } from 'next/navigation';
import MissionaryForm from '@/components/missionary-form';

export default function CreateMissionaryPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/missionaries');
  };

  const handleCancel = () => {
    router.push('/missionaries');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        <div className="mb-6">
          <button
            onClick={() => router.push('/missionaries')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Missionaries
          </button>
        </div>
        <MissionaryForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
}
