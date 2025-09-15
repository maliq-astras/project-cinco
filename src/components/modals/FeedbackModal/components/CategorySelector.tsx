import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  isItemSelected, 
  canSelectMoreItems, 
  getCategoryButtonStyle,
  formatCategoryName
} from '../helpers';

interface CategorySelectorProps {
  selectedItems: string[];
  onChange: (newSelected: string[]) => void;
  categoryOptions: string[];
  instructionKey: string;
  maxItems?: number;
}

export const CategorySelector = React.memo<CategorySelectorProps>(({
  selectedItems,
  onChange,
  categoryOptions,
  instructionKey,
  maxItems = 3
}) => {
  const { t } = useTranslation();

  const handleItemClick = (option: string) => {
    const selected = isItemSelected(option, selectedItems);
    let newSelected: string[];
    
    if (selected) {
      newSelected = selectedItems.filter((o: string) => o !== option);
    } else {
      newSelected = [...selectedItems, option];
    }
    
    onChange(newSelected);
  };

  return (
    <div className="flex flex-col items-center w-full mb-6">
      <div className="mb-4 pb-4 text-center text-base font-medium text-gray-600 dark:text-gray-300">
        {t(instructionKey)}
      </div>
      <div className="flex flex-wrap gap-3 justify-center w-full max-w-2xl">
        {categoryOptions.map((option) => {
          const selected = isItemSelected(option, selectedItems);
          const disabled = !selected && !canSelectMoreItems(selectedItems, maxItems);
          const styles = getCategoryButtonStyle(option, selected, disabled);
          
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleItemClick(option)}
              className={`border-2 font-semibold transition-all outline-none px-4 py-2 rounded-xl text-sm md:text-base ${styles.borderClass} ${styles.textClass} ${styles.bgClass}`}
              style={styles.style}
              aria-pressed={selected}
              disabled={disabled}
            >
              {formatCategoryName(option, t)}
            </button>
          );
        })}
      </div>
    </div>
  );
});

CategorySelector.displayName = 'CategorySelector';