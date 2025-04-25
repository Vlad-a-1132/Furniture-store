'use client';

import { Star } from 'lucide-react';
import { Review } from '@/types';
import Image from 'next/image';

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  // Фильтруем только одобренные отзывы
  const approvedReviews = reviews.filter(review => review.isApproved);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (approvedReviews.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Пока нет отзывов. Будьте первым!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {approvedReviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {review.user?.name || 'Аноним'}
              </span>
              <div className="flex">
                {renderStars(review.rating)}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 mb-4">{review.comment}</p>
          {review.images && review.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {review.images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <Image
                    src={image}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 