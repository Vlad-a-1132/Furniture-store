'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Category } from '@/types';

interface CategoryModalProps {
  category?: Category;
  parentCategory?: Category;
  onClose: () => void;
  onSave: (category: Partial<Category>) => void;
}

const CategoryModal = ({ category, parentCategory, onClose, onSave }: CategoryModalProps) => {
  const [name, setName] = useState(category?.name || '');
  const [href, setHref] = useState(category?.href || '');

  useEffect(() => {
    if (!category) {
      // Автоматически генерируем href из названия при создании новой категории
      const transliteratedName = name.toLowerCase()
        .replace(/[^a-zа-яё0-9\s]/g, '')
        .replace(/\s+/g, '-');
      setHref(transliteratedName);
    }
  }, [name, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: category?.id,
      name,
      href,
      parentId: parentCategory?.id,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {category ? 'Редактировать категорию' : 'Добавить категорию'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Название
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL (href)
              </label>
              <input
                type="text"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                pattern="[a-z0-9-]+"
                title="Только строчные буквы, цифры и дефисы"
              />
              <p className="mt-1 text-sm text-gray-500">
                Используйте только строчные буквы, цифры и дефисы
              </p>
            </div>
            {parentCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Родительская категория
                </label>
                <input
                  type="text"
                  value={parentCategory.name}
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  disabled
                />
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-olive hover:bg-olive/90 rounded-md"
            >
              {category ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category, parent?: Category) => void;
  onDelete: (category: Category, parent?: Category) => void;
  onAddSubcategory: (parent: Category) => void;
}

const CategoryItem = ({ category, onEdit, onDelete, onAddSubcategory }: CategoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasSubcategories = (category.subcategories?.length ?? 0) > 0;
  const hasProducts = (category.products?.length ?? 0) > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg group">
        {hasSubcategories ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}
        <span className="flex-1">
          {category.name}
          {hasProducts && (
            <span className="ml-2 text-sm text-gray-500">
              ({category.products?.length} товаров)
            </span>
          )}
        </span>
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
          <button
            onClick={() => onAddSubcategory(category)}
            className="p-1 text-olive hover:bg-olive/10 rounded"
            title="Добавить подкатегорию"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(category)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Редактировать категорию"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Удалить категорию"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {isExpanded && hasSubcategories && category.subcategories && (
        <div className="ml-6 border-l pl-4">
          {category.subcategories.map((subcategory) => (
            <CategoryItem
              key={subcategory.id}
              category={subcategory}
              onEdit={(cat) => onEdit(cat, category)}
              onDelete={(cat) => onDelete(cat, category)}
              onAddSubcategory={onAddSubcategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [selectedParentCategory, setSelectedParentCategory] = useState<Category | undefined>();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Не удалось загрузить категории');
    }
  };

  const handleAddCategory = (parent?: Category) => {
    setSelectedCategory(undefined);
    setSelectedParentCategory(parent);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category, parent?: Category) => {
    setSelectedCategory(category);
    setSelectedParentCategory(parent);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: category.id }),
      });

      if (!response.ok) throw new Error('Failed to delete category');

      toast.success('Категория успешно удалена');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Не удалось удалить категорию');
    }
  };

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    try {
      const method = categoryData.id ? 'PUT' : 'POST';
      const response = await fetch('/api/categories', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) throw new Error('Failed to save category');

      toast.success(
        categoryData.id
          ? 'Категория успешно обновлена'
          : 'Категория успешно создана'
      );
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Не удалось сохранить категорию');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Категории</h1>
        <button
          onClick={() => handleAddCategory()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-olive rounded-lg hover:bg-olive/90"
        >
          <Plus className="w-4 h-4" />
          Добавить категорию
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          {categories.length > 0 ? (
            <div className="space-y-4">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  onAddSubcategory={handleAddCategory}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Нет категорий. Создайте первую категорию, нажав кнопку "Добавить категорию".
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <CategoryModal
          category={selectedCategory}
          parentCategory={selectedParentCategory}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
} 