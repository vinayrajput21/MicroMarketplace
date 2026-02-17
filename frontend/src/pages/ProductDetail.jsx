// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct, deleteProduct } from '../api/product.api';
import { addFavorite, removeFavorite } from '../api/favorite.api';
import { useAuth } from '../hooks/useAuth';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ title: '', price: '', description: '', image: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProduct(id);
        setProduct(data);
        setForm({
          title: data.title,
          price: data.price,
          description: data.description,
          image: data.image || '',
        });
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) return alert('Please login first');
    try {
      if (isFavorite) await removeFavorite(id);
      else await addFavorite(id);
      setIsFavorite(!isFavorite);
    } catch (err) {
      alert('Failed to update favorite');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProduct(id, {
        ...form,
        price: Number(form.price),
      });
      setProduct(updated.data);
      setIsEditing(false);
      alert('Product updated successfully');
    } catch (err) {
      alert('Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await deleteProduct(id);
      alert('Product deleted');
      navigate('/products');
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-red-600 text-center py-20">{error}</div>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {isEditing ? (
          // Edit Form
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleUpdate} className="space-y-5">
              <input
                name="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 border rounded"
                required
              />
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-3 border rounded"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 border rounded"
                rows={4}
                required
              />
              <input
                name="image"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="Image URL"
                className="w-full p-3 border rounded"
              />
              <div className="flex gap-4">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          // View mode
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="h-80 w-full object-cover md:w-96"
              />
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-4xl font-bold text-blue-600 mb-6">
                ₹{Number(product.price).toLocaleString()}
              </p>
              <p className="text-gray-700 text-lg mb-8">{product.description}</p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={toggleFavorite}
                  className={`px-6 py-3 rounded-full font-medium ${
                    isFavorite
                      ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400'
                      : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                  }`}
                >
                  {isFavorite ? '★ Favorited' : '☆ Favorite'}
                </button>

                {user && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit Product
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete Product
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}