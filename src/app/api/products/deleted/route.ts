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
      include: {
        colorVariants: true,
        category: true,
        subcategory: true,
      },
      orderBy: {
        deletedAt: 'desc'
      }
    });

    return NextResponse.json(deletedProducts);
  } catch (error) {
    console.error('Error in GET /api/products/deleted:', error);
    return NextResponse.json(
      { error: "Failed to fetch deleted products" },
      { status: 500 }
    );
  }
} 