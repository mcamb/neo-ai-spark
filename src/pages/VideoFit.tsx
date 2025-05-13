
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import VideoUploadForm from '@/components/video-fit/VideoUploadForm';

const VideoFit = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Video Fit</h1>
          <p className="text-gray-600 mt-1">
            Upload a video and analyze whether it aligns with your campaign.
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <VideoUploadForm />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VideoFit;
