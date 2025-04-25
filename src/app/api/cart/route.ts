import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            defaultImage: true,
            inStock: true,
          }
        },
        colorVariant: true,
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  console.log('Session in cart POST:', session);

  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const { productId, quantity = 1, colorVariantId } = await request.json();
    console.log('Adding to cart:', { productId, quantity, colorVariantId, userId: session.user.id });

    // Проверяем существование продукта
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return new NextResponse(JSON.stringify({ message: 'Product not found' }), {
        status: 404,
      });
    }

    // Проверяем, есть ли уже этот товар в корзине
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
        colorVariantId: colorVariantId || null,
      }
    });

    let cartItem;
    if (existingCartItem) {
      // Если товар уже есть, обновляем количество
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity
        },
        include: {
          product: true,
          colorVariant: true,
        },
      });
    } else {
      // Если товара нет, создаем новую запись
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity,
          colorVariantId,
        },
        include: {
          product: true,
          colorVariant: true,
        },
      });
    }

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return new NextResponse(JSON.stringify({ 
      message: 'Internal Server Error', 
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const { id, quantity } = await request.json();

    const cartItem = await prisma.cartItem.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
        colorVariant: true,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const { id } = await request.json();

    await prisma.cartItem.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
} 