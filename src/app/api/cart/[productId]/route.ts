import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Please sign in to remove from cart" });
    }

    // For admin user, delete from admin cart
    if (session.user.id === 'admin') {
      const existingItem = await prisma.adminCart.findFirst({
        where: { productId: params.productId },
      });

      if (!existingItem) {
        return NextResponse.json({ message: "Cart item not found" });
      }

      await prisma.adminCart.delete({
        where: { id: existingItem.id },
      });

      return NextResponse.json({ message: "Item removed from cart" });
    }

    // For regular users
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId: params.productId,
      },
    });

    if (!existingCartItem) {
      return NextResponse.json({ message: "Cart item not found" });
    }

    await prisma.cartItem.delete({
      where: {
        id: existingCartItem.id,
      },
    });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error('Error in DELETE /api/cart/[productId]:', error);
    return NextResponse.json({ message: "Failed to remove from cart" });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Please sign in to update cart" });
    }

    const { quantity } = await req.json();

    // For admin user, update admin cart
    if (session.user.id === 'admin') {
      const existingItem = await prisma.adminCart.findFirst({
        where: { productId: params.productId },
      });

      if (!existingItem) {
        return NextResponse.json({ message: "Cart item not found" });
      }

      const cartItem = await prisma.adminCart.update({
        where: { id: existingItem.id },
        data: { quantity },
        include: { product: true },
      });

      return NextResponse.json(cartItem);
    }

    // For regular users
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId: params.productId,
      },
    });

    if (!existingCartItem) {
      return NextResponse.json({ message: "Cart item not found" });
    }

    const cartItem = await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Error in PATCH /api/cart/[productId]:', error);
    return NextResponse.json({ message: "Failed to update cart item" });
  }
} 