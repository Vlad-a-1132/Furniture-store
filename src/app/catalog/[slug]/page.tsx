import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Product } from '@/types';
import ProductDetails from '@/components/ProductDetails';

// Генерация метаданных для страницы
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Товар не найден',
      description: 'Запрашиваемый товар не найден',
    };
  }

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description,
    keywords: product.keywords.join(', '),
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description,
      images: [product.defaultImage],
    },
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      colorVariants: true,
      reviews: {
        where: {
          isApproved: true
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      category: true,
      subcategory: true,
      thirdLevel: true,
    },
  });

  if (!product) {
    return null;
  }

  const transformedProduct: Product = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    seoTitle: product.seoTitle || undefined,
    seoDescription: product.seoDescription || undefined,
    keywords: product.keywords,
    specifications: product.specifications as Record<string, string>,
    price: product.price,
    images: product.images,
    defaultImage: product.defaultImage,
    categoryId: product.categoryId || undefined,
    subcategoryId: product.subcategoryId || undefined,
    thirdLevelId: product.thirdLevelId || undefined,
    inStock: product.inStock,
    discount: product.discount || undefined,
    material: product.material,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    deletedAt: product.deletedAt || undefined,
    subcategory: product.subcategory ? {
      ...product.subcategory,
      slug: product.subcategory.href,
      parentId: product.subcategory.parentId || undefined,
    } : undefined,
    category: product.category ? {
      ...product.category,
      slug: product.category.href,
      parentId: product.category.parentId || undefined,
    } : undefined,
    thirdLevel: product.thirdLevel ? {
      ...product.thirdLevel,
      slug: product.thirdLevel.href,
      parentId: product.thirdLevel.parentId || undefined,
    } : undefined,
    colorVariants: product.colorVariants.map((variant) => ({
      ...variant,
      image: variant.image || '',
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    })),
    reviews: product.reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: review.user ? {
        ...review.user,
        name: review.user.name || 'Anonymous',
        image: review.user.image || undefined,
      } : {
        id: 'anonymous',
        name: 'Anonymous',
        email: 'anonymous@example.com',
      },
    })),
  };

  return transformedProduct;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
} 