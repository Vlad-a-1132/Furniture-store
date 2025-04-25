'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash,
  Copy,
  Image as ImageIcon,
  ArrowUpDown,
  MoreHorizontal,
  X
} from 'lucide-react';
import Image from 'next/image';
import ColorManager from '@/components/admin/ColorManager';
import SpecificationManager from '@/components/admin/SpecificationManager';
import CategorySelect from '@/components/CategorySelect';
import { Product, ColorVariant, Category } from '@/types';
import { toast } from 'react-hot-toast';

// Временные данные для демонстрации
const products = [
  {
    id: '1',
    name: 'Диван угловой "Комфорт"',
    description: 'Удобный угловой диван с обивкой из экокожи',
    category: 'Диваны и кресла',
    subcategory: 'Диваны угловые',
    price: 54990,
    inStock: true,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc'],
    material: 'textile',
    createdAt: '2024-01-15',
    rating: 4.5,
    reviewsCount: 12,
    colorVariants: [],
    specifications: {},
    keywords: [],
  },
  {
    id: '2',
    name: 'Кресло "Уют"',
    description: 'Мягкое кресло в скандинавском стиле',
    category: 'Диваны и кресла',
    subcategory: 'Кресла',
    price: 24990,
    inStock: true,
    images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c'],
    material: 'textile',
    createdAt: '2024-02-01',
    rating: 4.2,
    reviewsCount: 8,
    colorVariants: [],
    specifications: {},
    keywords: [],
  },
  {
    id: '3',
    name: 'Стол обеденный "Модерн"',
    description: 'Современный обеденный стол из массива дуба',
    category: 'Столы и стулья',
    subcategory: 'Столы обеденные',
    price: 34990,
    inStock: false,
    images: ['https://images.unsplash.com/photo-1530018607912-eff2daa1bac4'],
    material: 'wood',
    createdAt: '2024-01-20',
    rating: 4.8,
    reviewsCount: 20,
    colorVariants: [],
    specifications: {},
    keywords: [],
  },
];

interface Specification {
  key: string;
  value: string;
}

interface ProductModalProps {
  product?: Product;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}

const ProductModal = ({ product, onClose, onSave }: ProductModalProps) => {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [seoTitle, setSeoTitle] = useState(product?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(product?.seoDescription || '');
  const [keywords, setKeywords] = useState(product?.keywords?.join(', ') || '');
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>(
    Object.entries(product?.specifications || {}).map(([key, value]) => ({ key, value: value as string }))
  );
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [defaultImage, setDefaultImage] = useState(product?.defaultImage || '');
  const [categoryId, setCategoryId] = useState(product?.categoryId || '');
  const [subcategoryId, setSubcategoryId] = useState(product?.subcategoryId || '');
  const [thirdLevelId, setThirdLevelId] = useState(product?.thirdLevelId || '');
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [discount, setDiscount] = useState(product?.discount?.toString() || '');
  const [material, setMaterial] = useState(product?.material || '');
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(product?.colorVariants || []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Не удалось загрузить категории');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error('Выберите категорию');
      return;
    }

    const productData = {
      ...product,
      name,
      description,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
      specifications: Object.fromEntries(
        specifications.map(spec => [spec.key, spec.value])
      ),
      price: parseFloat(price),
      images,
      defaultImage: defaultImage || images[0] || '',
      categoryId,
      subcategoryId: subcategoryId || undefined,
      thirdLevelId: thirdLevelId || undefined,
      inStock,
      discount: discount ? parseFloat(discount) : undefined,
      material,
      colorVariants,
    };

    onSave(productData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.urls && data.urls.length > 0) {
        setImages(prev => [...prev, ...data.urls]);
        if (!defaultImage) {
          setDefaultImage(data.urls[0]);
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Ошибка при загрузке изображений');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (defaultImage === images[index]) {
      setDefaultImage(images[0] || '');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <p>Загрузка категорий...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl my-8">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {product ? 'Редактировать товар' : 'Добавить товар'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Описание
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30 min-h-[120px]"
                      required
                    />
                  </div>

                  <CategorySelect
                    categories={categories}
                    selectedCategoryId={categoryId}
                    selectedSubcategoryId={subcategoryId}
                    selectedThirdLevelId={thirdLevelId}
                    onCategoryChange={setCategoryId}
                    onSubcategoryChange={setSubcategoryId}
                    onThirdLevelChange={setThirdLevelId}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Цена
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Скидка (%)
                      </label>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Материал
                    </label>
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
                      required
                    >
                      <option value="">Выберите материал</option>
                      <option value="wood">Дерево</option>
                      <option value="metal">Металл</option>
                      <option value="plastic">Пластик</option>
                      <option value="textile">Текстиль</option>
                      <option value="leather">Кожа</option>
                      <option value="glass">Стекло</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="h-4 w-4 text-olive rounded border-gray-300 focus:ring-olive"
                      id="inStock"
                    />
                    <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                      В наличии
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SEO заголовок
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SEO описание
                    </label>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30 min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ключевые слова (через запятую)
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
                      placeholder="кресло, мебель, дизайн"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Изображения
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image}
                            alt={`Product image ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-40 object-cover rounded-lg"
                            style={{ width: 'auto' }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setDefaultImage(image)}
                              className={`p-2 rounded-full ${
                                defaultImage === image
                                  ? 'bg-olive text-white'
                                  : 'bg-white text-gray-700'
                              }`}
                            >
                              <ImageIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-2 rounded-full bg-white text-red-500"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg border-gray-300 hover:border-olive transition-colors">
                        <label className="cursor-pointer w-full h-full flex items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            multiple
                          />
                          <Plus className="h-8 w-8 text-gray-400" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <SpecificationManager
                  specifications={specifications}
                  onChange={setSpecifications}
                />

                <ColorManager
                  initialColors={colorVariants}
                  onChange={setColorVariants}
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors"
              >
                {product ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Не удалось загрузить товары');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const filteredProducts = sortedProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (productData: Partial<Product>) => {
    try {
      const method = productData.id ? 'PUT' : 'POST';
      const url = productData.id
        ? `/api/products/${productData.id}`
        : '/api/products';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to save product');

      toast.success(
        productData.id ? 'Товар обновлен' : 'Товар создан'
      );
      
      setShowModal(false);
      setEditingProduct(undefined);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Не удалось сохранить товар');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      toast.success('Товар удален');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Не удалось удалить товар');
    }
  };

  const handleCopy = async (productId: string) => {
    try {
      const response = await fetch('/api/products/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error('Failed to copy product');

      toast.success('Товар скопирован');
      fetchProducts();
    } catch (error) {
      console.error('Error copying product:', error);
      toast.error('Не удалось скопировать товар');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Загрузка товаров...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Товары</h1>
        <button
          onClick={() => {
            setEditingProduct(undefined);
            setShowModal(true);
          }}
          className="flex items-center px-4 py-2 bg-olive text-white rounded-lg hover:bg-olive/90"
        >
          <Plus className="h-5 w-5 mr-2" />
          Добавить товар
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск товаров..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
          />
        </div>
        <button className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900">
          <Filter className="h-5 w-5 mr-2" />
          Фильтры
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1"
                >
                  <span>Название</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center space-x-1"
                >
                  <span>Цена</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                В наличии
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {product.defaultImage && (
                      <Image
                        src={product.defaultImage}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded object-cover mr-3"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                  }).format(product.price)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {categories.find(c => c.id === product.categoryId)?.name || '-'}
                  {product.subcategoryId && (
                    <>
                      {' / '}
                      {categories.find(c => c.id === product.subcategoryId)?.name}
                    </>
                  )}
                  {product.thirdLevelId && (
                    <>
                      {' / '}
                      {categories.find(c => c.id === product.thirdLevelId)?.name}
                    </>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.inStock ? 'Да' : 'Нет'}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowModal(true);
                      }}
                      className="text-olive hover:text-olive/80"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleCopy(product.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(undefined);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
} 