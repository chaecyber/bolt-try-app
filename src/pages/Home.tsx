import { useState } from 'react';
import { ShoppingBag, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HomeProps {
  onNavigate: (page: string, productId?: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [platform, setPlatform] = useState('shopee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from('products')
        .insert({
          name,
          url,
          platform,
          price,
          image_url: imageUrl || null,
        })
        .select()
        .maybeSingle();

      if (insertError) throw insertError;

      if (data) {
        setUrl('');
        setName('');
        setPrice('');
        setImageUrl('');
        onNavigate('product', data.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Review Collector
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kumpulkan dan analisis review produk dari berbagai platform e-commerce Indonesia
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Plus className="w-6 h-6 mr-2 text-orange-500" />
            Tambah Produk Baru
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="shopee">Shopee</option>
                <option value="tokopedia">Tokopedia</option>
                <option value="bukalapak">Bukalapak</option>
                <option value="lazada">Lazada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Produk
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="Contoh: iPhone 15 Pro Max 256GB"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL Produk
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="https://shopee.co.id/..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Harga (opsional)
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Rp 15.000.000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL Gambar (opsional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? 'Menambahkan...' : 'Tambah Produk'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-orange-600 hover:text-orange-700 font-semibold text-lg hover:underline transition-all"
          >
            Lihat Semua Produk →
          </button>
        </div>
      </div>
    </div>
  );
}
