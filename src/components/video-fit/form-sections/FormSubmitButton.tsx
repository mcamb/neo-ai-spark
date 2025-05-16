
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileVideo, Loader2, Upload } from 'lucide-react';

interface FormSubmitButtonProps {
  isUploading: boolean;
  isFormValid: boolean;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ 
  isUploading, 
  isFormValid 
}) => {
  return (
    <Button 
      type="submit" 
      className="w-full"
      disabled={!isFormValid || isUploading}
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading Video...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          Upload and Analyze Video
        </>
      )}
    </Button>
  );
};

export default FormSubmitButton;
