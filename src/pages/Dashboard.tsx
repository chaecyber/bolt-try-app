import { useState, useEffect } from 'react';
import { Star, ShoppingBag, Plus, ExternalLink, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface DashboardProps {
  onNavigate: (page: string, productId?: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    return product.platform === filter;
  });

  const stats = {
    total: products.length,
    avgRating:
      products.length > 0
        ? products.reduce((sum, p) => sum + p.average_rating, 0) / products.length
        : 0,
    totalReviews: products.reduce((sum, p) => sum + p.total_reviews, 0),
  };

  const platforms = ['all', 'shopee', 'tokopedia', 'bukalapak', 'lazada'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Kelola semua produk dan review Anda
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Tambah Produk
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Total Produk
                </p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Rating Rata-rata
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.avgRating.toFixed(1)}
                  </p>
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Total Review
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalReviews}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setFilter(platform)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                  filter === platform
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {platform === 'all' ? 'Semua Platform' : platform}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Memuat produk...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Belum ada produk
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai tambahkan produk untuk mengumpulkan review
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
            >
              Tambah Produk Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer border border-gray-100"
                onClick={() => onNavigate('product', product.id)}
              >
                {product.image_url && (
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold capitalize">
                      {product.platform}
                    </span>
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                  </h3>

                  {product.price && (
                    <p className="text-xl font-bold text-orange-600 mb-3">
                      {product.price}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {renderStars(Math.round(product.average_rating))}
                      <span className="text-sm font-semibold text-gray-700">
                        {product.average_rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {product.total_reviews} review
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
