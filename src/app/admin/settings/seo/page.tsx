'use client';

import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

interface MetaTag {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

// Временные данные для демонстрации
const initialMetaTags: MetaTag[] = [
  {
    id: '1',
    path: '/',
    title: 'MebelStore - Магазин мебели',
    description: 'Широкий выбор мебели для дома и офиса. Доставка по всей России.',
    keywords: 'мебель, диваны, кровати, столы, стулья, шкафы',
    ogTitle: 'MebelStore - Магазин мебели',
    ogDescription: 'Широкий выбор мебели для дома и офиса',
    ogImage: 'https://example.com/og-image.jpg',
  },
  {
    id: '2',
    path: '/catalog',
    title: 'Каталог мебели - MebelStore',
    description: 'Каталог мебели с удобным поиском и фильтрами. Более 1000 товаров.',
    keywords: 'каталог мебели, купить мебель, мебель для дома',
    ogTitle: 'Каталог мебели - MebelStore',
    ogDescription: 'Каталог мебели с удобным поиском и фильтрами',
    ogImage: 'https://example.com/catalog-og-image.jpg',
  },
];

export default function SeoSettingsPage() {
  const [metaTags, setMetaTags] = useState<MetaTag[]>(initialMetaTags);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = (tag: MetaTag) => {
    setMetaTags(prev =>
      prev.map(t => (t.id === tag.id ? tag : t))
    );
    setEditingId(null);
  };

  const handleAdd = () => {
    const newTag: MetaTag = {
      id: Date.now().toString(),
      path: '',
      title: '',
      description: '',
      keywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
    };
    setMetaTags(prev => [...prev, newTag]);
    setEditingId(newTag.id);
  };

  const handleDelete = (id: string) => {
    setMetaTags(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-gray-800">SEO настройки</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-olive text-white rounded-lg hover:bg-olive/90 
          transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить мета-теги</span>
        </button>
      </div>

      <div className="space-y-6">
        {metaTags.map((tag) => (
          <div
            key={tag.id}
            className="bg-white rounded-xl shadow-sm p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Мета-теги для страницы: {tag.path || 'Новая страница'}
              </h3>
              <div className="flex items-center gap-2">
                {editingId === tag.id ? (
                  <button
                    onClick={() => handleSave(tag)}
                    className="px-4 py-2 bg-olive text-white rounded-lg 
                    hover:bg-olive/90 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Сохранить</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingId(tag.id)}
                    className="px-4 py-2 border text-gray-700 rounded-lg 
                    hover:bg-gray-50 transition-colors"
                  >
                    Редактировать
                  </button>
                )}
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg 
                  transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL страницы
                </label>
                <input
                  type="text"
                  value={tag.path}
                  onChange={(e) => setMetaTags(prev =>
                    prev.map(t => t.id === tag.id ? { ...t, path: e.target.value } : t)
                  )}
                  disabled={editingId !== tag.id}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-olive/30 disabled:bg-gray-100"
                  placeholder="/example-page"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={tag.title}
                  onChange={(e) => setMetaTags(prev =>
                    prev.map(t => t.id === tag.id ? { ...t, title: e.target.value } : t)
                  )}
                  disabled={editingId !== tag.id}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-olive/30 disabled:bg-gray-100"
                  placeholder="Заголовок страницы"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={tag.description}
                  onChange={(e) => setMetaTags(prev =>
                    prev.map(t => t.id === tag.id ? { ...t, description: e.target.value } : t)
                  )}
                  disabled={editingId !== tag.id}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-olive/30 disabled:bg-gray-100"
                  rows={3}
                  placeholder="Описание страницы"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={tag.keywords}
                  onChange={(e) => setMetaTags(prev =>
                    prev.map(t => t.id === tag.id ? { ...t, keywords: e.target.value } : t)
                  )}
                  disabled={editingId !== tag.id}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-olive/30 disabled:bg-gray-100"
                  placeholder="ключевое слово 1, ключевое слово 2"
                />
              </div>

              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Open Graph мета-теги
                </h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      og:title
                    </label>
                    <input
                      type="text"
                      value={tag.ogTitle}
                      onChange={(e) => setMetaTags(prev =>
                        prev.map(t => t.id === tag.id ? { ...t, ogTitle: e.target.value } : t)
                      )}
                      disabled={editingId !== tag.id}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-olive/30 disabled:bg-gray-100"
                      placeholder="Заголовок для соцсетей"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      og:description
                    </label>
                    <textarea
                      value={tag.ogDescription}
                      onChange={(e) => setMetaTags(prev =>
                        prev.map(t => t.id === tag.id ? { ...t, ogDescription: e.target.value } : t)
                      )}
                      disabled={editingId !== tag.id}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-olive/30 disabled:bg-gray-100"
                      rows={3}
                      placeholder="Описание для соцсетей"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      og:image
                    </label>
                    <input
                      type="text"
                      value={tag.ogImage}
                      onChange={(e) => setMetaTags(prev =>
                        prev.map(t => t.id === tag.id ? { ...t, ogImage: e.target.value } : t)
                      )}
                      disabled={editingId !== tag.id}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-olive/30 disabled:bg-gray-100"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 