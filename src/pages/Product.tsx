import { useState, useEffect } from 'react';
import { Star, ArrowLeft, User, ThumbsUp, Plus, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

interface ProductProps {
  productId: string;
  onNavigate: (page: string) => void;
}

export default function Product({ productId, onNavigate }: ProductProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    reviewer_name: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .maybeSingle();

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (productData) setProduct(productData);
      if (reviewsData) setReviews(reviewsData);

      if (productData && reviewsData) {
        const avgRating = reviewsData.length > 0
          ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length
          : 0;

        await supabase
          .from('products')
          .update({
            average_rating: avgRating,
            total_reviews: reviewsData.length,
            updated_at: new Date().toISOString(),
          })
          .eq('id', productId);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('reviews').insert({
        product_id: productId,
        reviewer_name: newReview.reviewer_name,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      setNewReview({ reviewer_name: '', rating: 5, comment: '' });
      setShowAddReview(false);
      loadProduct();
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    return distribution;
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Memuat produk...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Produk tidak ditemukan</div>
      </div>
    );
  }

  const distribution = getRatingDistribution();
  const maxCount = Math.max(...distribution);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {product.image_url && (
              <div className="flex-shrink-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full md:w-64 h-64 object-cover rounded-xl"
                />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-3 capitalize">
                    {product.platform}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  {product.price && (
                    <p className="text-2xl font-bold text-orange-600 mb-4">
                      {product.price}
                    </p>
                  )}
                </div>
              </div>

              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold mb-6"
              >
                Lihat di {product.platform}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>

              <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {product.average_rating.toFixed(1)}
                  </div>
                  {renderStars(Math.round(product.average_rating), 'md')}
                </div>

                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = distribution[rating - 1];
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm font-medium text-gray-700">
                            {rating}
                          </span>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {product.total_reviews}
                  </div>
                  <div className="text-sm text-gray-600">Review</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Review Pelanggan
            </h2>
            <button
              onClick={() => setShowAddReview(!showAddReview)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tambah Review
            </button>
          </div>

          {showAddReview && (
            <form
              onSubmit={handleAddReview}
              className="mb-8 p-6 bg-gray-50 rounded-xl"
            >
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Reviewer
                </label>
                <input
                  type="text"
                  value={newReview.reviewer_name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, reviewer_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= newReview.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Komentar
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Simpan Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddReview(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Belum ada review untuk produk ini
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {review.reviewer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.review_date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    {renderStars(review.rating, 'sm')}
                  </div>

                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {review.comment}
                  </p>

                  <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Membantu ({review.helpful_count})
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
