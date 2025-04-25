'use client';

import { useState, memo } from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface FilterSection {
  title: string;
  options: { value: string; label: string; count?: number }[];
}

export interface Filters {
  categories: string[];
  priceRange: string[];
  materials: string[];
}

export interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'priceAsc', label: 'Сначала дешевле' },
  { value: 'priceDesc', label: 'Сначала дороже' },
  { value: 'new', label: 'Сначала новые' },
  { value: 'discount', label: 'По размеру скидки' },
];

const filterSections: FilterSection[] = [
  {
    title: 'Категории',
    options: [
      { value: 'sofas', label: 'Диваны', count: 12 },
      { value: 'beds', label: 'Кровати', count: 8 },
      { value: 'chairs', label: 'Стулья', count: 15 },
      { value: 'tables', label: 'Столы', count: 10 },
      { value: 'wardrobes', label: 'Шкафы', count: 6 },
    ],
  },
  {
    title: 'Цена',
    options: [
      { value: '0-10000', label: 'До 10 000 ₽' },
      { value: '10000-30000', label: 'От 10 000 до 30 000 ₽' },
      { value: '30000-50000', label: 'От 30 000 до 50 000 ₽' },
      { value: '50000+', label: 'Более 50 000 ₽' },
    ],
  },
  {
    title: 'Материал',
    options: [
      { value: 'wood', label: 'Дерево' },
      { value: 'metal', label: 'Металл' },
      { value: 'glass', label: 'Стекло' },
      { value: 'textile', label: 'Текстиль' },
    ],
  },
];

interface ProductFiltersProps {
  onFiltersChange: (filters: Filters) => void;
  onSortChange: (sort: string) => void;
  selectedSort: string;
}

const ProductFilters = memo(function ProductFilters({ 
  onFiltersChange, 
  onSortChange,
  selectedSort 
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState<string[]>(
    filterSections.map(section => section.title)
  );
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    categories: [],
    priceRange: [],
    materials: [],
  });

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const handleFilterChange = (section: string, value: string) => {
    setSelectedFilters(prev => {
      const key = section.toLowerCase() === 'категории' 
        ? 'categories' 
        : section.toLowerCase() === 'цена' 
          ? 'priceRange'
          : 'materials';

      const newFilters = {
        ...prev,
        [key]: prev[key].includes(value)
          ? prev[key].filter(v => v !== value)
          : [...prev[key], value]
      };

      onFiltersChange(newFilters);
      return newFilters;
    });
  };

  return (
    <div className="space-y-8">
      {/* Сортировка */}
      <div className="border-b border-olive/10 pb-6">
        <h3 className="text-lg font-light text-graphite mb-4">
          Сортировка
        </h3>
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full p-2 rounded-lg border border-olive/30 text-graphite 
          focus:outline-none focus:ring-2 focus:ring-olive/30 bg-white"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Фильтры */}
      {filterSections.map((section) => (
        <div key={section.title} className="border-b border-olive/10 pb-6">
          <button
            className="flex items-center justify-between w-full text-left group"
            onClick={() => toggleSection(section.title)}
          >
            <h3 className="text-lg font-light text-graphite group-hover:text-olive 
            transition-colors duration-300">
              {section.title}
            </h3>
            <ChevronDownIcon
              className={`h-5 w-5 text-olive transition-transform duration-300 
              ${openSections.includes(section.title) ? 'rotate-180' : ''}`}
            />
          </button>

          {openSections.includes(section.title) && (
            <div className="mt-4 space-y-3 animate-fade-in">
              {section.options.map((option) => (
                <label key={option.value} className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters[
                      section.title.toLowerCase() === 'категории' 
                        ? 'categories' 
                        : section.title.toLowerCase() === 'цена'
                          ? 'priceRange'
                          : 'materials'
                    ].includes(option.value)}
                    onChange={() => handleFilterChange(section.title, option.value)}
                    className="w-4 h-4 rounded border-olive/30 text-olive 
                    focus:ring-olive/30 transition-colors duration-300"
                  />
                  <span className="ml-3 text-graphite/80 group-hover:text-graphite 
                  transition-colors duration-300">
                    {option.label}
                  </span>
                  {option.count && (
                    <span className="ml-auto text-sm text-olive/60">
                      {option.count}
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <button 
        onClick={() => {
          setSelectedFilters({
            categories: [],
            priceRange: [],
            materials: [],
          });
          onFiltersChange({
            categories: [],
            priceRange: [],
            materials: [],
          });
        }}
        className="w-full py-3 px-6 bg-white text-graphite rounded-lg border border-graphite
        hover:bg-graphite hover:text-white transition-all duration-300 font-light"
      >
        Сбросить фильтры
      </button>
    </div>
  );
});

export default ProductFilters; 