
import React from 'react';
import MainLayout from '@/components/MainLayout';

const Lab = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Lab</h1>
          <p className="text-gray-600 mt-1">
            Experiment with new content strategies and AI-powered tools.
          </p>
        </div>
        
        <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
          <div className="text-center">
            <p className="text-gray-500">No experiments running yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Start experimenting with the AI lab.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Lab;
