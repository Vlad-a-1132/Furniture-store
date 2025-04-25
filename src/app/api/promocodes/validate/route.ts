import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { message: 'Промокод не указан' },
        { status: 400 }
      );
    }

    const promocode = await prisma.promocode.findFirst({
      where: { code: code.toUpperCase() },
    });

    if (!promocode) {
      return NextResponse.json(
        { message: 'Промокод не найден' },
        { status: 404 }
      );
    }

    if (!promocode.isActive) {
      return NextResponse.json(
        { message: 'Промокод неактивен' },
        { status: 400 }
      );
    }

    if (promocode.expiresAt && new Date() > new Date(promocode.expiresAt)) {
      return NextResponse.json(
        { message: 'Срок действия промокода истек' },
        { status: 400 }
      );
    }

    if (promocode.usageLimit !== null && promocode.usageCount >= promocode.usageLimit) {
      return NextResponse.json(
        { message: 'Превышен лимит использования промокода' },
        { status: 400 }
      );
    }

    // Increment usage count
    await prisma.promocode.update({
      where: { id: promocode.id },
      data: { usageCount: { increment: 1 } },
    });

    return NextResponse.json({
      discount: promocode.discount,
      message: 'Промокод успешно применен',
    });
  } catch (error) {
    console.error('Error validating promocode:', error);
    return NextResponse.json(
      { message: 'Ошибка при проверке промокода' },
      { status: 500 }
    );
  }
} 