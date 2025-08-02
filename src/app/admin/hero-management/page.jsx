'use client';

import HeroManagement from './HeroManagement';

export default function HeroManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Hero Section Management</h1>
      </div>
      
      <HeroManagement />
    </div>
  );
}