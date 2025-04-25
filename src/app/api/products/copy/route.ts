import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/utils";
import { ColorVariant } from "@/types";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    // Получаем исходный товар со всеми связанными данными
    const sourceProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        colorVariants: true,
      },
    });

    if (!sourceProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Генерируем уникальный слаг для копии
    const newSlug = await generateUniqueSlug(prisma, `${sourceProduct.name} (копия)`);

    // Создаем копию товара
    const newProduct = await prisma.product.create({
      data: {
        name: `${sourceProduct.name} (копия)`,
        slug: newSlug,
        description: sourceProduct.description,
        seoTitle: sourceProduct.seoTitle || '',
        seoDescription: sourceProduct.seoDescription || '',
        keywords: sourceProduct.keywords,
        specifications: sourceProduct.specifications || {},
        price: sourceProduct.price,
        images: sourceProduct.images,
        defaultImage: sourceProduct.defaultImage,
        categoryId: sourceProduct.categoryId,
        subcategoryId: sourceProduct.subcategoryId,
        inStock: sourceProduct.inStock,
        discount: sourceProduct.discount || 0,
        material: sourceProduct.material,
        rating: 0,
        reviewsCount: 0,
        colorVariants: {
          create: sourceProduct.colorVariants.map((variant) => ({
            name: variant.name,
            hex: variant.hex,
            image: variant.image || '',
          })),
        },
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error in POST /api/products/copy:', error);
    return NextResponse.json(
      { error: "Failed to copy product" },
      { status: 500 }
    );
  }
} 