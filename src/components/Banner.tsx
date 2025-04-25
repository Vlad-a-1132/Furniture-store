'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Banner as BannerType } from '@/types';

interface BannerProps {
  banners: BannerType[];
}

const Banner = ({ banners }: BannerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % banners.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <div className="relative h-[800px] overflow-hidden bg-beige pt-16">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute w-full h-[calc(100%-8rem)] transition-all duration-700 ease-out ${
            index === currentSlide 
              ? 'opacity-100 translate-x-0 scale-100' 
              : index < currentSlide
                ? 'opacity-0 -translate-x-full scale-95'
                : 'opacity-0 translate-x-full scale-95'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 h-full">
            <div className="grid grid-cols-12 grid-rows-6 gap-6 h-full py-8">
              {/* Основное изображение */}
              <div className="col-span-8 row-span-6 relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-graphite/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-12">
                  <h2 className="text-5xl font-light text-white mb-6 opacity-0 translate-y-8 
                  animate-[slideUp_700ms_ease-out_forwards]">
                    {banner.title}
                  </h2>
                  <p className="text-xl text-white/90 mb-8 max-w-xl opacity-0 translate-y-8 
                  animate-[slideUp_700ms_ease-out_200ms_forwards]">
                    {banner.description}
                  </p>
                  <button className="opacity-0 translate-y-8 animate-[slideUp_700ms_ease-out_400ms_forwards] 
                  bg-white/90 text-graphite px-8 py-3 rounded-xl font-medium 
                  hover:bg-white hover:scale-105 transition-all duration-300 
                  shadow-lg hover:shadow-xl">
                    Подробнее
                  </button>
                </div>
              </div>

              {/* Дополнительные секции справа */}
              <div className="col-span-4 row-span-3 relative rounded-3xl overflow-hidden shadow-xl 
              bg-olive/20 backdrop-blur-sm group hover:bg-olive/30 transition-all duration-500
              opacity-0 translate-y-8 animate-[slideUp_700ms_ease-out_600ms_forwards]">
                <Image
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
                  alt="Новая коллекция"
                  fill
                  className="object-cover opacity-80 transition-all duration-700 
                  group-hover:scale-110 group-hover:opacity-90 scale-110 animate-[scaleDown_1.5s_ease-out_forwards]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent 
                opacity-0 transition-opacity duration-700 group-hover:opacity-60 animate-[fadeIn_700ms_ease-out_1s_forwards]" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="transform group-hover:translate-y-0 translate-y-4 
                  transition-transform duration-500">
                    <h3 className="text-2xl font-light text-white mb-3 group-hover:text-white/90 
                    transition-colors duration-500">
                      Новая коллекция
                    </h3>
                    <p className="text-white/80 group-hover:text-white/90 transition-colors duration-500">
                      Откройте для себя уникальные предметы интерьера
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 row-span-3 relative rounded-3xl overflow-hidden shadow-xl 
              bg-wood/20 backdrop-blur-sm group hover:bg-wood/30 transition-all duration-500
              opacity-0 translate-y-8 animate-[slideUp_700ms_ease-out_800ms_forwards]">
                <Image
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
                  alt="Акции"
                  fill
                  className="object-cover opacity-80 transition-all duration-700 
                  group-hover:scale-110 group-hover:opacity-90 scale-110 animate-[scaleDown_1.5s_ease-out_forwards]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent 
                opacity-0 transition-opacity duration-700 group-hover:opacity-60 animate-[fadeIn_700ms_ease-out_1.2s_forwards]" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform group-hover:translate-y-0 translate-y-4 
                  transition-transform duration-500">
                    <h3 className="text-xl font-light text-white mb-2 group-hover:text-white/90 
                    transition-colors duration-500">
                      Акции
                    </h3>
                    <p className="text-sm text-white/80 group-hover:text-white/90 transition-colors duration-500">
                      Скидки до 30%
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 row-span-3 relative rounded-3xl overflow-hidden shadow-xl 
              bg-beige backdrop-blur-sm group hover:bg-beige/70 transition-all duration-500
              opacity-0 translate-y-8 animate-[slideUp_700ms_ease-out_1000ms_forwards]">
                <Image
                  src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe"
                  alt="Доставка"
                  fill
                  className="object-cover opacity-80 transition-all duration-700 
                  group-hover:scale-110 group-hover:opacity-90 scale-110 animate-[scaleDown_1.5s_ease-out_forwards]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent 
                opacity-0 transition-opacity duration-700 group-hover:opacity-60 animate-[fadeIn_700ms_ease-out_1.4s_forwards]" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform group-hover:translate-y-0 translate-y-4 
                  transition-transform duration-500">
                    <h3 className="text-xl font-light text-white mb-2 group-hover:text-white/90 
                    transition-colors duration-500">
                      Доставка
                    </h3>
                    <p className="text-sm text-white/80 group-hover:text-white/90 transition-colors duration-500">
                      Бесплатно от 50 000 ₽
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Кнопки навигации */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur 
        rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-110 
        group border border-white/20"
      >
        <ChevronLeftIcon className="h-6 w-6 text-white group-hover:text-graphite 
        transition-colors duration-300" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur 
        rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-110 
        group border border-white/20"
      >
        <ChevronRightIcon className="h-6 w-6 text-white group-hover:text-graphite 
        transition-colors duration-300" />
      </button>

      {/* Индикаторы слайдов */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ease-out 
            hover:bg-white ${
              index === currentSlide 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/50 hover:w-4'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner; 