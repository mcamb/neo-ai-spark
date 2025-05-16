
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { UploadResult } from '../services/videoUploadService';

interface UploadFeedbackProps {
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  lastUploadResult: UploadResult | null;
}

const UploadFeedback: React.FC<UploadFeedbackProps> = ({
  isUploading,
  uploadProgress,
  uploadError,
  lastUploadResult
}) => {
  if (isUploading) {
    return (
      <div className="space-y-2 my-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Uploading video...</span>
          <span>{uploadProgress}%</span>
        </div>
        <Progress value={uploadProgress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-1">
          Please wait while your video is being uploaded and processed.
        </p>
      </div>
    );
  }

  if (uploadError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Upload Failed</AlertTitle>
        <AlertDescription>
          {uploadError}
        </AlertDescription>
      </Alert>
    );
  }

  if (lastUploadResult) {
    if (lastUploadResult.success) {
      return (
        <Alert className="my-4 border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-600">Upload Successful</AlertTitle>
          <AlertDescription className="text-green-700">
            Your video has been uploaded successfully and is ready for analysis.
          </AlertDescription>
        </Alert>
      );
    } else {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>
            {lastUploadResult.message}
            {lastUploadResult.error && (
              <details className="mt-2 text-xs">
                <summary>Technical details</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {JSON.stringify(lastUploadResult.error, null, 2)}
                </pre>
              </details>
            )}
          </AlertDescription>
        </Alert>
      );
    }
  }

  return null;
};

export default UploadFeedback;
