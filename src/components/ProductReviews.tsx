'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { useSession } from 'next-auth/react';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <ReviewList reviews={reviews} />
      </div>
      {session ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <ReviewForm productId={productId} onSuccess={fetchReviews} />
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Please{' '}
            <a href="/auth/signin" className="text-olive hover:underline">
              sign in
            </a>{' '}
            to write a review
          </p>
        </div>
      )}
    </div>
  );
} 