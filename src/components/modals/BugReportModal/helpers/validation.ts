interface BugReportFormData {
  bugType?: string[];
  deviceType?: string;
  bugDetails?: string;
}

export const validateStep = (stepType: string, formData: BugReportFormData): boolean => {
  switch (stepType) {
    case 'bugType':
      return Array.isArray(formData.bugType) && formData.bugType.length > 0;
    case 'deviceType':
      return !!formData.deviceType;
    case 'details':
      return typeof formData.bugDetails === 'string' && formData.bugDetails.trim().length > 0;
    case 'file':
      // File step is optional, so always valid
      return true;
    default:
      return false;
  }
};

export const validateFileType = (file: File): boolean => {
  return file.type.startsWith('image/');
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateBugDetails = (details: string, maxLength: number = 400): boolean => {
  return details.length <= maxLength && details.trim().length > 0;
};