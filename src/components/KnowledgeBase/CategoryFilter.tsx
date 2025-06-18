
import React from 'react';
import { Badge } from '../ui/badge';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Filtrar por categoria:</span>
      <div className="flex flex-wrap gap-1">
        {categories.map(category => (
          <Badge
            key={category}
            variant={selectedCategory === category ? 'default' : 'secondary'}
            onClick={() => onCategoryChange(category)}
            className="cursor-pointer"
          >
            {category === 'all' ? 'Todas' : category}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
