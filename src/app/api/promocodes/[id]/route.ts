import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const promocode = await prisma.promocode.update({
      where: { id: params.id },
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
    console.error('Error in PUT /api/promocodes/[id]:', error);
    return NextResponse.json(
      { error: "Failed to update promocode" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Проверяем, что пользователь авторизован и является админом
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.promocode.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/promocodes/[id]:', error);
    return NextResponse.json(
      { error: "Failed to delete promocode" },
      { status: 500 }
    );
  }
} 