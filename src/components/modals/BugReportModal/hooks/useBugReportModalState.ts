import { useState, useMemo, useRef } from 'react';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  bugType: string[];
  deviceType: string;
  bugDetails: string;
  file: File | null;
}

const ALL_BUG_TAGS = [
  'appCrashed',
  'uiGlitch',
  'factCardDidntReveal',
  'bubbleDidntRespond',
  'guessInputNotWorking',
  'progressBarIssue',
  'timerIssue',
  'skipButtonNotWorking',
  'finalFiveRoundProblem',
  'victoryAnimationDidntPlay',
  'wrongAnswerMarked',
  'categoryNotLoading',
  'loadingScreenStuck',
  'settingsNotSaving',
  'themeColorIssue',
  'languageNotSwitching',
  'tutorialNotWorking',
  'mobileLandscapeLayoutIssue',
  'accessibilityIssue',
  'other',
];

const deviceOptions = [
  'iphone',
  'androidPhone',
  'ipad',
  'androidTablet',
  'windowsPC',
  'mac',
  'chromebook',
  'other',
];

export const useBugReportModalState = (props: BugReportModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const steps = useMemo(() => [
    {
      label: 'bugReport.steps.bugType',
      type: 'bugType'
    },
    {
      label: 'bugReport.steps.deviceType',
      type: 'deviceType'
    },
    {
      label: 'bugReport.steps.details',
      type: 'details'
    },
    {
      label: 'bugReport.steps.file',
      type: 'file'
    }
  ], []);

  const initialFormData: FormData = useMemo(() => ({
    bugType: [],
    deviceType: '',
    bugDetails: '',
    file: null
  }), []);

  const INITIAL_TAGS_SHOWN = 6;
  const filteredTags = useMemo(() => 
    ALL_BUG_TAGS.filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase())),
    [tagSearch]
  );

  const tagsToShow = useMemo(() => 
    showAllTags ? filteredTags : filteredTags.slice(0, INITIAL_TAGS_SHOWN),
    [showAllTags, filteredTags]
  );

  const canShowMore = !showAllTags && filteredTags.length > INITIAL_TAGS_SHOWN;
  const canShowLess = showAllTags && filteredTags.length > INITIAL_TAGS_SHOWN;

  return {
    // Props
    isOpen: props.isOpen,
    onClose: props.onClose,
    
    // State
    fileInputRef,
    isDragging,
    setIsDragging,
    showAllTags,
    setShowAllTags,
    tagSearch,
    setTagSearch,
    submitted,
    setSubmitted,
    
    // Constants
    steps,
    initialFormData,
    ALL_BUG_TAGS,
    deviceOptions,
    INITIAL_TAGS_SHOWN,
    
    // Computed
    filteredTags,
    tagsToShow,
    canShowMore,
    canShowLess,
  };
};