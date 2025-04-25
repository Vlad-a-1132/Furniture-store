import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const deletedProducts = await prisma.product.findMany({
      where: {
        deletedAt: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        defaultImage: true,
        category: {
          select: {
            name: true
          }
        },
        subcategory: {
          select: {
            name: true
          }
        },
        deletedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Transform the data to match the expected format
    const formattedProducts = deletedProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      default_image: product.defaultImage,
      category_name: product.category?.name || null,
      subcategory_name: product.subcategory?.name || null,
      deleted_at: product.deletedAt?.toISOString() || null
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching deleted products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deleted products' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    const restoredProduct = await prisma.product.update({
      where: { id },
      data: {
        deletedAt: null
      }
    });

    return NextResponse.json(restoredProduct);
  } catch (error) {
    console.error('Error restoring product:', error);
    return NextResponse.json(
      { error: 'Failed to restore product' },
      { status: 500 }
    );
  }
} 