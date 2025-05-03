
import React from 'react';
import MainLayout from '@/components/MainLayout';

const Campaigns = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your social media campaigns here.
          </p>
        </div>
        
        <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
          <div className="text-center">
            <p className="text-gray-500">No campaigns created yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Start by creating a new campaign.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Campaigns;
