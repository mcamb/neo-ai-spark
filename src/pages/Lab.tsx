
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { FileVideo } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/lab/video-fit" className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="mb-4 bg-neo-lightgray p-3 rounded-full">
                  <FileVideo className="h-6 w-6 text-neo-red" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">Video Fit</h3>
                <p className="text-black">
                  Upload a video and analyze whether it aligns with your campaign.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Lab;
