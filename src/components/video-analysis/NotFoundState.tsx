
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const NotFoundState: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Video Analysis</h1>
      <Card>
        <CardContent className="pt-6">
          <p>No analysis found for this video. The analysis might still be processing.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundState;
