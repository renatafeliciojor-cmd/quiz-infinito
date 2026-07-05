'use client';

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Nova Campanha
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Campanhas, email marketing e WhatsApp - em desenvolvimento...</p>
      </div>
    </div>
  );
}
