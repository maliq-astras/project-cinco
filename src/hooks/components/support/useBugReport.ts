import { useState, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

export const bugOptions = [
  'App crashed',
  'UI glitch',
  'Performance issue',
  'Audio problem',
  'Other',
];

export const deviceOptions = [
  'Computer',
  'Mobile phone',
  'Tablet',
  'Other device'
];

export const useBugReport = () => {
  const { colors } = useTheme();
  const [step, setStep] = useState(0);
  const [bugType, setBugType] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [otherBug, setOtherBug] = useState('');
  const [bugDetails, setBugDetails] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const deviceDropdownRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0 && droppedFiles[0].type.startsWith('image/')) {
      setFile(droppedFiles[0]);
    }
  };

  const selectBugType = (type: string) => {
    console.log('Selecting bug type:', type);
    setBugType(type);
    setIsDropdownOpen(false);
    
    if (type !== 'Other') {
      setStep((prev) => prev + 1);
    }
  };

  const selectDeviceType = (type: string) => {
    setDeviceType(type);
    setIsDeviceDropdownOpen(false);
    setStep((prev) => prev + 1);
  };

  const handleNext = () => {
    if (step === 0) {
      if (bugType === 'Other' && otherBug.trim() === '') return;
      setStep((prev) => prev + 1);
    } else if (step === 2 && bugDetails.trim() === '') {
      return;
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setStep(0);
      setBugType('');
      setOtherBug('');
      setBugDetails('');
      setFile(null);
      setSubmitted(false);
    }, 2000);
  };

  return {
    colors,
    step,
    bugType,
    deviceType,
    otherBug,
    bugDetails,
    file,
    isDragging,
    fileInputRef,
    submitted,
    isDropdownOpen,
    isDeviceDropdownOpen,
    dropdownRef,
    deviceDropdownRef,
    setIsDropdownOpen,
    setIsDeviceDropdownOpen,
    setOtherBug,
    setBugDetails,
    handleFileChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    selectBugType,
    selectDeviceType,
    handleNext,
    handleSubmit
  };
}; 