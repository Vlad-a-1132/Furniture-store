'use client';

import { useState, useRef, useEffect } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URLs when component unmounts or when images change
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const data = await response.json();
      setUploadedImages((prev) => [...prev, ...data.urls]);

      // Create preview URLs
      const newPreviewUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages((prev) => [...prev, ...newPreviewUrls]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke the URL to free up memory
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          comment,
          images: uploadedImages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setRating(0);
      setComment('');
      setUploadedImages([]);
      // Cleanup preview URLs
      previewImages.forEach(url => URL.revokeObjectURL(url));
      setPreviewImages([]);
      toast.success('Thank you! Your review has been submitted for moderation');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An error occurred while submitting your review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 cursor-pointer ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
        onClick={() => setRating(index + 1)}
      />
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <div className="flex gap-1">{renderStars()}</div>
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Comment
        </label>
        <textarea
          id="comment"
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-olive focus:ring-olive sm:text-sm"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Images
        </label>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Upload Images
          </button>
        </div>

        {previewImages.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {previewImages.map((preview, index) => (
              <div key={index} className="relative">
                <div className="relative w-24 h-24">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!rating || isSubmitting}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-olive rounded-md hover:bg-olive/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
} 