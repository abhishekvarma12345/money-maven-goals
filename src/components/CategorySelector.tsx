
import React from 'react';
import { ExpenseCategory } from '@/lib/types';
import { categoryColors, categoryIcons } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Home, Car, UtensilsCrossed, Lightbulb, Heart, Music, ShoppingBag, User, GraduationCap, Plane, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  selected: ExpenseCategory;
  onSelect: (category: ExpenseCategory) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selected, onSelect }) => {
  // Map of category to icon component
  const iconMap = {
    housing: Home,
    transportation: Car,
    food: UtensilsCrossed,
    utilities: Lightbulb,
    healthcare: Heart,
    entertainment: Music,
    shopping: ShoppingBag,
    personal: User,
    education: GraduationCap,
    travel: Plane,
    other: MoreHorizontal,
  };
  
  const categories: ExpenseCategory[] = [
    'housing',
    'transportation',
    'food',
    'utilities',
    'healthcare',
    'entertainment',
    'shopping',
    'personal',
    'education',
    'travel',
    'other',
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const IconComponent = iconMap[category];
        return (
          <Button
            key={category}
            type="button"
            variant="outline"
            className={cn(
              "flex items-center gap-1 text-xs capitalize",
              selected === category && "border-2 bg-transparent",
              selected === category && `border-${categoryColors[category]}`
            )}
            onClick={() => onSelect(category)}
          >
            <IconComponent className="h-3.5 w-3.5" />
            {category}
          </Button>
        );
      })}
    </div>
  );
};
