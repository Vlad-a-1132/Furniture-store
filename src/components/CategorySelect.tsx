import { Category } from '@/types';

interface CategorySelectProps {
  categories: Category[];
  selectedCategoryId: string;
  selectedSubcategoryId?: string;
  selectedThirdLevelId?: string;
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange: (subcategoryId: string) => void;
  onThirdLevelChange: (thirdLevelId: string) => void;
}

export default function CategorySelect({
  categories,
  selectedCategoryId,
  selectedSubcategoryId,
  selectedThirdLevelId,
  onCategoryChange,
  onSubcategoryChange,
  onThirdLevelChange,
}: CategorySelectProps) {
  // Получаем категории первого уровня (без parentId)
  const topLevelCategories = categories.filter(c => !c.parentId);
  
  // Получаем подкатегории для выбранной категории
  const subcategories = categories.filter(c => c.parentId === selectedCategoryId);
  
  // Получаем категории третьего уровня для выбранной подкатегории
  const thirdLevelCategories = categories.filter(c => c.parentId === selectedSubcategoryId);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Категория
        </label>
        <select
          value={selectedCategoryId}
          onChange={(e) => {
            onCategoryChange(e.target.value);
            // Сбрасываем подкатегории при смене основной категории
            onSubcategoryChange('');
            onThirdLevelChange('');
          }}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
          required
        >
          <option value="">Выберите категорию</option>
          {topLevelCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategoryId && subcategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Подкатегория
          </label>
          <select
            value={selectedSubcategoryId}
            onChange={(e) => {
              onSubcategoryChange(e.target.value);
              // Сбрасываем категории третьего уровня при смене подкатегории
              onThirdLevelChange('');
            }}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
          >
            <option value="">Выберите подкатегорию</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSubcategoryId && thirdLevelCategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Подраздел
          </label>
          <select
            value={selectedThirdLevelId}
            onChange={(e) => onThirdLevelChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
          >
            <option value="">Выберите подраздел</option>
            {thirdLevelCategories.map((thirdLevel) => (
              <option key={thirdLevel.id} value={thirdLevel.id}>
                {thirdLevel.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
} 