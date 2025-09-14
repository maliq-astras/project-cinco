import { useCallback } from 'react';

interface BugReportModalEventsProps {
  onClose: () => void;
  setSubmitted: (submitted: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setIsDragging: (isDragging: boolean) => void;
  setTagSearch: (search: string) => void;
}

export const useBugReportModalEvents = (props: BugReportModalEventsProps) => {
  const handleSubmit = useCallback(async (formData: any) => {
    // Here you would typically send the bug report to your backend
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    props.setSubmitted(true);
    setTimeout(() => {
      props.onClose();
    }, 2000);
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

  const handleDrop = useCallback((e: React.DragEvent, handleInputChange: (value: any, field: string) => void) => {
    e.preventDefault();
    e.stopPropagation();
    props.setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleInputChange(file, 'file');
    }
  }, [props]);

  const handleRemoveFile = useCallback((handleInputChange: (value: any, field: string) => void) => {
    if (props.fileInputRef.current) {
      props.fileInputRef.current.value = '';
    }
    handleInputChange(null, 'file');
  }, [props]);

  const handleTagSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    props.setTagSearch(e.target.value);
  }, [props]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>, handleInputChange: (value: any, field: string) => void) => {
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