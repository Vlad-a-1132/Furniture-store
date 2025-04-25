'use client';

import { useState, useEffect } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Review } from '@/types';
import { toast } from 'sonner';

interface ExtendedReview extends Review {
  product?: {
    id: string;
    name: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ExtendedReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      toast.error('Failed to load reviews');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: true }),
      });

      if (!response.ok) throw new Error('Failed to approve review');
      
      setReviews(reviews.map(review => 
        review.id === id ? { ...review, isApproved: true } : review
      ));
      toast.success('Review approved');
    } catch (error) {
      toast.error('Failed to approve review');
      console.error(error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: false }),
      });

      if (!response.ok) throw new Error('Failed to reject review');
      
      setReviews(reviews.map(review => 
        review.id === id ? { ...review, isApproved: false } : review
      ));
      toast.success('Review rejected');
    } catch (error) {
      toast.error('Failed to reject review');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete review');
      
      setReviews(reviews.filter(review => review.id !== id));
      toast.success('Review deleted');
    } catch (error) {
      toast.error('Failed to delete review');
      console.error(error);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className={`border rounded-lg p-4 ${
              review.isApproved ? 'bg-green-50' : 'bg-yellow-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {review.user?.name || 'Anonymous'}
                  </span>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                {review.product && (
                  <Link
                    href={`/products/${review.product.id}`}
                    className="text-sm text-olive hover:underline"
                  >
                    {review.product.name}
                  </Link>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 mb-4">{review.comment}</p>
            {review.images && review.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
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
            
            <div className="flex gap-2">
              {!review.isApproved && (
                <button
                  onClick={() => handleApprove(review.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
              )}
              {review.isApproved && (
                <button
                  onClick={() => handleReject(review.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              )}
              <button
                onClick={() => handleDelete(review.id)}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reviews to moderate
          </div>
        )}
      </div>
    </div>
  );
} 