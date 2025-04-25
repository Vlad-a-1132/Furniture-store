'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product, ColorVariant } from '@/types';
import prisma from '@/lib/prisma';

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      colorVariants: true,
    },
  });

  if (!product) return null;

  return {
    ...product,
    seoTitle: product.seoTitle || undefined,
    seoDescription: product.seoDescription || undefined,
    subcategory: product.subcategory || '',
    discount: product.discount || undefined,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    specifications: product.specifications as Record<string, string>,
    colorVariants: product.colorVariants.map(variant => ({
      id: variant.id || undefined,
      name: variant.name,
      hex: variant.hex,
      image: variant.image,
      productId: variant.productId,
    })),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);
  
  if (!product) {
    return <div>Товар не найден</div>;
  }

  return <ProductDetails product={product} />;
}

function ProductDetails({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(
    product.colorVariants[0] || null
  );

  const currentImage = selectedColor?.image || product.defaultImage || product.images[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Изображение товара */}
        <div className="relative aspect-square">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-cover rounded-xl"
          />
        </div>

        {/* Информация о товаре */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-light text-graphite mb-4">{product.name}</h1>
            <p className="text-xl font-medium text-olive">
              {product.price.toLocaleString('ru-RU')} ₽
            </p>
          </div>

          {/* Выбор цвета */}
          {product.colorVariants.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Цвет</h3>
              <div className="flex gap-3">
                {product.colorVariants.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-12 h-12 rounded-full p-1 ${
                      selectedColor?.id === color.id
                        ? 'ring-2 ring-olive ring-offset-2'
                        : ''
                    }`}
                    title={color.name}
                  >
                    <span
                      className="block w-full h-full rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="mt-2 text-sm text-gray-600">{selectedColor.name}</p>
              )}
            </div>
          )}

          {/* Характеристики */}
          {Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Характеристики</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <dt className="text-gray-600 text-sm">{key}</dt>
                    <dd className="font-medium mt-1">{value}</dd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Описание */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Описание</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Кнопка добавления в корзину */}
          <button className="w-full px-6 py-3 bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors">
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
} 