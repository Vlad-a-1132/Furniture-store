import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { transliterate } from '@/lib/utils';

// Получение списка категорий
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const href = searchParams.get('href');

    if (href) {
      // Поиск конкретной категории по href
      const category = await prisma.category.findFirst({
        where: { href },
        include: {
          parent: true,
          children: true,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(category);
    }

    // Если href не указан, возвращаем все категории
    const categories = await prisma.category.findMany({
      include: {
        children: true,
        parent: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Создание новой категории
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, href, parentId } = await request.json();

    const category = await prisma.category.create({
      data: {
        name,
        href: href || transliterate(name),
        parentId,
      },
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// Обновление категории
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, name, href, parentId } = await request.json();

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        href,
        parentId,
      },
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error in PUT /api/categories:', error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// Удаление категории
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error('Error in DELETE /api/categories:', error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
} 