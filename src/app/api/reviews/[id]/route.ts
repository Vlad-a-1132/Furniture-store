import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Удаляем отзыв
    await prisma.review.delete({
      where: { id: params.id },
    });

    // Обновляем рейтинг и количество отзывов у товара
    const reviews = await prisma.review.findMany({
      where: { productId: params.id },
      select: { rating: true },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

    await prisma.product.update({
      where: { id: params.id },
      data: {
        rating: averageRating,
        reviewsCount: reviews.length,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
} 