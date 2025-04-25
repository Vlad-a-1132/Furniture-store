import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Преобразуем данные для фронтенда
    const formattedPromotions = promotions.map(promotion => ({
      id: promotion.id,
      title: `Скидка ${promotion.discount}%`,
      description: `Используйте промокод ${promotion.code} для получения скидки`,
      image: 'https://i.postimg.cc/x1WVRHjs/DALLE-2025-02-05-111-1.png', // Замените на реальные изображения
      discount: promotion.discount,
      validUntil: promotion.expiresAt?.toISOString(),
      code: promotion.code,
    }));

    return NextResponse.json(formattedPromotions);
  } catch (error) {
    console.error('Error fetching active promotions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
} 