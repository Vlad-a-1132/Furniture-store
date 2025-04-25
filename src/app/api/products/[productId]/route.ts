import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        colorVariants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in GET /api/products/[productId]:', error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const product = await prisma.product.update({
      where: { id: params.productId },
      data: {
        name: data.name,
        slug: data.slug,
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
          deleteMany: {},
          create: data.colorVariants
        }
      },
      include: {
        colorVariants: true,
        category: true,
        subcategory: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in PUT /api/products/[productId]:', error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const product = await prisma.product.update({
      where: { 
        id: params.productId,
        deletedAt: null
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found or already deleted" },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/products/[productId]:', error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
} 