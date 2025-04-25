import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Проверяем, что пользователь авторизован и является админом
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const promocodes = await prisma.promocode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(promocodes);
  } catch (error) {
    console.error('Error in GET /api/promocodes:', error);
    return NextResponse.json(
      { error: "Failed to fetch promocodes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Проверяем, что пользователь авторизован и является админом
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const promocode = await prisma.promocode.create({
      data: {
        code: data.code.toUpperCase(),
        discount: data.discount,
        isActive: data.isActive,
        usageLimit: data.usageLimit,
        expiresAt: data.expiresAt,
      },
    });

    return NextResponse.json(promocode);
  } catch (error) {
    console.error('Error in POST /api/promocodes:', error);
    return NextResponse.json(
      { error: "Failed to create promocode" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const promocode = await prisma.promocode.update({
      where: { id: data.id },
      data: {
        code: data.code.toUpperCase(),
        discount: data.discount,
        isActive: data.isActive,
        usageLimit: data.usageLimit,
        expiresAt: data.expiresAt,
      },
    });
    
    return NextResponse.json(promocode);
  } catch (error) {
    console.error('Error updating promocode:', error);
    return NextResponse.json(
      { error: 'Failed to update promocode' },
      { status: 500 }
    );
  }
} 