import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function PUT(
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

    const body = await request.json();
    const { email, password, name } = body;

    // Проверяем, не пытаемся ли мы изменить админа
    if (params.id === 'admin' && session.user.id !== 'admin') {
      return NextResponse.json(
        { error: 'Cannot modify admin user' },
        { status: 403 }
      );
    }

    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: params.id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const updateData: any = {
      email,
      name,
    };

    if (password) {
      updateData.password = await hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

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

    // Запрещаем удаление админа
    if (params.id === 'admin') {
      return NextResponse.json(
        { error: 'Cannot delete admin user' },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 