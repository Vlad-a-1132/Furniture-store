'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Category, Product } from '@/types';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      // Пропускаем рендер для главной страницы и админки
      if (pathname === '/' || pathname.startsWith('/admin')) {
        setBreadcrumbs([]);
        setIsLoading(false);
        return;
      }

      const paths = pathname.split('/').filter(Boolean);
      const items: BreadcrumbItem[] = [
        { label: 'Главная', href: '/' }
      ];

      let currentPath = '';
      
      for (const path of paths) {
        currentPath += `/${path}`;
        let label = path;

        // Специальные случаи для определенных путей
        switch (path) {
          case 'catalog':
            label = 'Каталог';
            break;
          case 'cart':
            label = 'Корзина';
            break;
          case 'favorites':
            label = 'Избранное';
            break;
          case 'search':
            label = 'Поиск';
            break;
          case 'auth':
            label = 'Авторизация';
            break;
          default:
            // Если мы в каталоге и это не первый сегмент пути,
            // пытаемся получить реальное название категории или товара
            if (currentPath.startsWith('/catalog/') && paths.indexOf(path) > 0) {
              try {
                // Сначала проверяем, может это товар
                const productResponse = await fetch(`/api/products?slug=${path}`);
                if (productResponse.ok) {
                  const product: Product = await productResponse.json();
                  if (product) {
                    label = product.name;
                    break;
                  }
                }

                // Если это не товар и мы находимся в каталоге, проверяем категорию
                if (label === path && currentPath.startsWith('/catalog/')) {
                  const response = await fetch(`/api/categories?href=${path}`);
                  if (response.ok) {
                    const category: Category = await response.json();
                    if (category) {
                      label = category.name;
                      break;
                    }
                  }
                }
              } catch (error) {
                console.error('Error fetching breadcrumb data:', error);
                // В случае ошибки используем форматированный путь
                label = path
                  .replace(/-/g, ' ')
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
              }
            }

            // Если метка все еще равна пути, форматируем ее
            if (label === path) {
              label = path
                .replace(/-/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }
        }

        items.push({
          label,
          href: currentPath
        });
      }

      setBreadcrumbs(items);
      setIsLoading(false);
    };

    generateBreadcrumbs();
  }, [pathname]);

  if (isLoading || !breadcrumbs.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumbs" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-olive">{breadcrumb.label}</span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="hover:text-olive transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 