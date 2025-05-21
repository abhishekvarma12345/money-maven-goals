
import React from 'react';
import { ExpenseCategory } from '@/lib/types';
import { CategorySelector } from './CategorySelector';

interface CategorySelectorWrapperProps {
  selected: ExpenseCategory;
  onSelect: React.Dispatch<React.SetStateAction<ExpenseCategory>>;
  disabled?: boolean;
}

const CategorySelectorWrapper: React.FC<CategorySelectorWrapperProps> = ({ 
  selected, 
  onSelect,
  disabled 
}) => {
  // Pass only the props that CategorySelector expects
  return (
    <div className={disabled ? 'opacity-70 pointer-events-none' : ''}>
      <CategorySelector 
        selected={selected}
        onSelect={onSelect}
      />
    </div>
  );
};

export default CategorySelectorWrapper;
