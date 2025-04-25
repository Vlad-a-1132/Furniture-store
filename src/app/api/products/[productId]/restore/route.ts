import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
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
        id: params.productId
      },
      data: {
        deletedAt: null
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in POST /api/products/[productId]/restore:', error);
    return NextResponse.json(
      { error: "Failed to restore product" },
      { status: 500 }
    );
  }
} 