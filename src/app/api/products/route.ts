import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ColorVariant } from '@/types';
import type { PrismaClient } from '@prisma/client';
import { generateUniqueSlug } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          colorVariants: true,
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    }

    // Если slug не указан, возвращаем список всех товаров
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null
      },
      include: {
        colorVariants: true,
        category: true,
        subcategory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const slug = await generateUniqueSlug(prisma, data.name);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        keywords: data.keywords,
        specifications: data.specifications,
        price: data.price,
        images: data.images,
        defaultImage: data.defaultImage,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        inStock: data.inStock,
        discount: data.discount,
        material: data.material,
        colorVariants: {
          create: data.colorVariants,
        },
      },
      include: {
        colorVariants: true,
        category: true,
        subcategory: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id } = data;

    // Если название изменилось, генерируем новый slug
    const slug = data.name !== data.originalName
      ? await generateUniqueSlug(prisma, data.name, id)
      : data.slug;

    // Удаляем существующие цветовые варианты
    await prisma.colorVariant.deleteMany({
      where: { productId: id },
    });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        keywords: data.keywords,
        specifications: data.specifications,
        price: data.price,
        images: data.images,
        defaultImage: data.defaultImage,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        inStock: data.inStock,
        discount: data.discount,
        material: data.material,
        colorVariants: {
          create: data.colorVariants,
        },
      },
      include: {
        colorVariants: true,
        category: true,
        subcategory: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in PUT /api/products:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/products:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 