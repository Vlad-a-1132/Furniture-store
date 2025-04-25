'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const promoItems = [
  {
    id: 1,
    title: 'Месяц спален – скидки до 50%',
    description: 'Создайте спальню своей мечты',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c',
    href: '/promotions/bedroom-month',
  },
  {
    id: 2,
    title: 'Рассрочка без переплаты!',
    description: 'На все коллекции мебели',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    href: '/promotions/installment',
  },
  {
    id: 3,
    title: 'Выгодно, как ни крути!',
    description: 'Дополнительная скидка 10%',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    href: '/promotions/bonus',
  }
];

export default function PromoSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок с кнопкой "Все акции" */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-light text-graphite">Акции</h2>
          <Link 
            href="/promotions"
            className="flex items-center text-graphite/80 hover:text-graphite transition-colors group"
          >
            <span className="mr-2">Все акции</span>
            <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Слайдер */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl 
              transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl text-graphite font-medium mb-2">{item.title}</h3>
                <p className="text-graphite/70">{item.description}</p>
              </div>

              {/* Стрелка в правом нижнем углу */}
              <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-olive/10 
              flex items-center justify-center transform translate-x-2 opacity-0 
              group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <ChevronRight className="w-5 h-5 text-olive" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 