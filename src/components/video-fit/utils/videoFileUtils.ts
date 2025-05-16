
export const createVideoPreview = (file: File): string => {
  return URL.createObjectURL(file);
};

export const cleanupVideoPreview = (previewUrl: string | null): void => {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
};

export const getVideoTitleFromFileName = (file: File): string => {
  return file.name.split('.')[0];
};
