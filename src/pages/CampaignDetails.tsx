
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';

const CampaignDetails = () => {
  const { campaignId } = useParams();
  
  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Campaign Details</h1>
        <p className="text-gray-600 mb-4">Campaign ID: {campaignId}</p>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Campaign details will be implemented in the future.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default CampaignDetails;
