import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfDay, startOfWeek, endOfWeek } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const today = startOfDay(new Date());
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }); // Sunday

    // Get today's orders
    const todayOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // Get new users registered today
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // Get weekly revenue
    const weeklyOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
        status: 'completed',
      },
      select: {
        total: true,
      },
    });

    const weeklyRevenue = weeklyOrders.reduce((acc, order) => acc + order.total, 0);

    // Get conversion rate (orders/users ratio for the week)
    const weeklyUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    const conversionRate = weeklyUsers > 0 
      ? ((weeklyOrders.length / weeklyUsers) * 100).toFixed(2)
      : 0;

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Get recent activity
    const recentReviews = await prisma.review.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    const recentProducts = await prisma.product.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        name: true,
        createdAt: true,
      },
    });

    // Get products with low stock (using orderItems count)
    const productsWithOrderItems = await prisma.product.findMany({
      where: {
        inStock: true,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      take: 3,
    });

    // Combine all data
    const dashboardData = {
      stats: [
        {
          name: 'Заказов сегодня',
          value: todayOrders.toString(),
          trend: '+20%', // You would need to calculate this based on historical data
        },
        {
          name: 'Новых клиентов',
          value: newUsers.toString(),
          trend: '+12%', // You would need to calculate this based on historical data
        },
        {
          name: 'Выручка за неделю',
          value: `${weeklyRevenue.toLocaleString('ru-RU')} ₽`,
          trend: '+8%', // You would need to calculate this based on historical data
        },
        {
          name: 'Конверсия',
          value: `${conversionRate}%`,
          trend: '+2%', // You would need to calculate this based on historical data
        },
      ],
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        customer: order.user?.name || order.user?.email || 'Гость',
        amount: `${order.total.toLocaleString('ru-RU')} ₽`,
        status: order.status,
        date: order.createdAt.toISOString(),
      })),
      recentActivity: [
        ...recentReviews.map(review => ({
          id: review.id,
          type: 'review',
          text: `Новый отзыв на товар "${review.product.name}"`,
          time: review.createdAt.toISOString(),
        })),
        ...recentProducts.map(product => ({
          id: product.name,
          type: 'product',
          text: `Добавлен новый товар "${product.name}"`,
          time: product.createdAt.toISOString(),
        })),
        ...productsWithOrderItems.map(product => ({
          id: product.id,
          type: 'alert',
          text: `Товар "${product.name}" популярен (${product._count.orderItems} заказов)`,
          time: new Date().toISOString(),
        })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 