export const formatStepLabel = (label: string) => {
  return label.toUpperCase();
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatFileName = (fileName: string, maxLength: number = 30) => {
  if (fileName.length <= maxLength) return fileName;
  
  const extension = fileName.split('.').pop();
  const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
  const truncatedName = nameWithoutExtension.substring(0, maxLength - extension!.length - 4);
  
  return `${truncatedName}...${extension}`;
};