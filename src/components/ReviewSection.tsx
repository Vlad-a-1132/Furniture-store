'use client';

import { useState } from 'react';
import { Star, ThumbsUp, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Review } from '@/types';

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'likes' | 'createdAt'>) => void;
  onLikeReview: (reviewId: string) => void;
}

const REVIEWS_PER_PAGE = 5;

export default function ReviewSection({ 
  productId, 
  reviews, 
  onAddReview,
  onLikeReview 
}: ReviewSectionProps) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [author, setAuthor] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview({
      productId,
      author,
      rating,
      text: reviewText,
      images,
    });
    // Сброс формы
    setRating(5);
    setReviewText('');
    setAuthor('');
    setImages([]);
    // Переход на первую страницу после добавления отзыва
    setCurrentPage(1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // В реальном приложении здесь будет загрузка на сервер
      // Сейчас просто создаем URL для превью
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  // Компонент для отображения пагинации
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-olive/10 transition-colors 
          disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="w-5 h-5 text-graphite" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-lg transition-all duration-300 
            ${currentPage === page 
              ? 'bg-olive text-white' 
              : 'hover:bg-olive/10 text-graphite'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-olive/10 transition-colors 
          disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <ChevronRight className="w-5 h-5 text-graphite" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light text-graphite">Отзывы о товаре</h2>
        <p className="text-graphite/60">Всего отзывов: {reviews.length}</p>
      </div>

      {/* Форма добавления отзыва */}
      <form onSubmit={handleSubmit} className="bg-white/50 backdrop-blur-sm rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-medium text-graphite mb-4">Оставить отзыв</h3>
        
        {/* Рейтинг */}
        <div className="space-y-2">
          <label className="text-sm text-graphite/70">Оценка</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                className="text-2xl focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= (hoveredStar ?? rating)
                      ? 'fill-olive text-olive'
                      : 'text-olive/30'
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Имя автора */}
        <div className="space-y-2">
          <label htmlFor="author" className="text-sm text-graphite/70">Ваше имя</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 rounded-lg border border-olive/30 
            focus:outline-none focus:ring-2 focus:ring-olive/30"
            required
          />
        </div>

        {/* Текст отзыва */}
        <div className="space-y-2">
          <label htmlFor="review" className="text-sm text-graphite/70">Ваш отзыв</label>
          <textarea
            id="review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            className="w-full p-2 rounded-lg border border-olive/30 
            focus:outline-none focus:ring-2 focus:ring-olive/30"
            required
          />
        </div>

        {/* Загрузка изображений */}
        <div className="space-y-2">
          <label className="text-sm text-graphite/70">Фотографии</label>
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative w-20 h-20">
                <Image
                  src={image}
                  alt={`Фото ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 
                  shadow-md hover:bg-graphite hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="w-20 h-20 flex items-center justify-center border-2 
            border-dashed border-olive/30 rounded-lg cursor-pointer 
            hover:border-olive transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <ImageIcon className="w-6 h-6 text-olive/50" />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-graphite text-white rounded-lg 
          hover:bg-olive transition-all duration-300 font-light"
        >
          Отправить отзыв
        </button>
      </form>

      {/* Список отзывов */}
      <div className="space-y-6">
        {paginatedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 space-y-4 
            animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-graphite">{review.author}</p>
                <p className="text-sm text-graphite/60">
                  {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {Array(5).fill(null).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < review.rating
                        ? 'fill-olive text-olive'
                        : 'text-olive/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-graphite/80">{review.text}</p>

            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {review.images.map((image, index) => (
                  <div key={index} className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={image}
                      alt={`Фото к отзыву ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => onLikeReview(review.id)}
                className="flex items-center gap-2 text-sm text-graphite/60 
                hover:text-olive transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{review.likes}</span>
              </button>
            </div>
          </div>
        ))}

        {/* Пагинация */}
        <Pagination />
      </div>
    </div>
  );
} 