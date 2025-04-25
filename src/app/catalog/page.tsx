import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/prisma';
import { Product } from '@/types/index';

async function getProducts(sortBy: string = 'default'): Promise<Product[]> {
  try {
    let orderBy: any = {};
    
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'name_asc':
        orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const products = await prisma.product.findMany({
      include: {
        colorVariants: true,
      },
      orderBy,
    });
    
    return products.map(product => ({
      ...product,
      seoTitle: product.seoTitle || undefined,
      seoDescription: product.seoDescription || undefined,
      subcategory: product.subcategory || undefined,
      discount: product.discount || undefined,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      specifications: product.specifications as Record<string, string>,
      colorVariants: product.colorVariants.map(variant => ({
        id: variant.id,
        name: variant.name,
        hex: variant.hex,
        image: variant.image,
        productId: variant.productId,
      })),
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { sort?: string }
}) {
  const products = await getProducts(searchParams.sort);

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige to-[#EAE8E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Сортировка</h2>
              <div className="space-y-2">
                <a
                  href="/catalog"
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    !searchParams.sort ? 'bg-olive/10 text-olive' : 'hover:bg-gray-50'
                  }`}
                >
                  По умолчанию
                </a>
                <a
                  href="/catalog?sort=price_asc"
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    searchParams.sort === 'price_asc' ? 'bg-olive/10 text-olive' : 'hover:bg-gray-50'
                  }`}
                >
                  По возрастанию цены
                </a>
                <a
                  href="/catalog?sort=price_desc"
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    searchParams.sort === 'price_desc' ? 'bg-olive/10 text-olive' : 'hover:bg-gray-50'
                  }`}
                >
                  По убыванию цены
                </a>
                <a
                  href="/catalog?sort=name_asc"
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    searchParams.sort === 'name_asc' ? 'bg-olive/10 text-olive' : 'hover:bg-gray-50'
                  }`}
                >
                  По названию (А-Я)
                </a>
                <a
                  href="/catalog?sort=name_desc"
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    searchParams.sort === 'name_desc' ? 'bg-olive/10 text-olive' : 'hover:bg-gray-50'
                  }`}
                >
                  По названию (Я-А)
                </a>
                <a
                  href="/catalog?sort=rating"
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    searchParams.sort === 'rating' ? 'bg-olive/10 text-olive' : 'hover:bg-gray-50'
                  }`}
                >
                  По рейтингу
                </a>
        </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <h1 className="text-3xl font-light text-graphite mb-8">
              Каталог товаров
            </h1>

            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            }>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 