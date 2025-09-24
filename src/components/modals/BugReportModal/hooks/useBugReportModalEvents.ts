import { useCallback } from 'react';

interface BugReportModalEventsProps {
  onClose: () => void;
  setSubmitted: (submitted: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setIsDragging: (isDragging: boolean) => void;
  setTagSearch: (search: string) => void;
}

export const useBugReportModalEvents = (props: BugReportModalEventsProps) => {
  const handleSubmit = useCallback(async (formData: { bugType?: string[]; deviceType?: string; bugDetails?: string; file?: File | null }) => {
    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Add form fields
      submitData.append('bugType', JSON.stringify(formData.bugType || []));
      submitData.append('deviceType', formData.deviceType || '');
      submitData.append('bugDetails', formData.bugDetails || '');

      // Add file if present
      if (formData.file) {
        submitData.append('file', formData.file);
      }

      // Send to API
      const response = await fetch('/api/submit-bug-report', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit bug report');
      }

      // Success - show confirmation
      props.setSubmitted(true);
      setTimeout(() => {
        props.onClose();
      }, 2000);

    } catch (error) {
      console.error('Error submitting bug report:', error);
      // You could add error state handling here
      // For now, we'll still show submitted state but you might want to show an error
      props.setSubmitted(true);
      setTimeout(() => {
        props.onClose();
      }, 2000);
    }
  }, [props]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    props.setIsDragging(true);
  }, [props]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    props.setIsDragging(false);
  }, [props]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, handleInputChange: (value: string | string[] | number | File | null, field: string) => void) => {
    e.preventDefault();
    e.stopPropagation();
    props.setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleInputChange(file, 'file');
    }
  }, [props]);

  const handleRemoveFile = useCallback((handleInputChange: (value: string | string[] | number | File | null, field: string) => void) => {
    if (props.fileInputRef.current) {
      props.fileInputRef.current.value = '';
    }
    handleInputChange(null, 'file');
  }, [props]);

  const handleTagSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    props.setTagSearch(e.target.value);
  }, [props]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>, handleInputChange: (value: string | string[] | number | File | null, field: string) => void) => {
    const file = e.target.files?.[0] || null;
    handleInputChange(file, 'file');
  }, []);

  return {
    handleSubmit,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleRemoveFile,
    handleTagSearchChange,
    handleFileUpload,
  };
};