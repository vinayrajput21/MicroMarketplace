import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct, deleteProduct } from '../api/product.api';
import { addFavorite, removeFavorite, getFavorites } from '../api/favorite.api'; // ← add getFavorites
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

  // Fetch product + check if it's favorited
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // 1. Get product details
        const { data: productData } = await getProduct(id);
        setProduct(productData);
        setForm({
          title: productData.title,
          price: productData.price,
          description: productData.description,
          image: productData.image || '',
        });

        // 2. Get user's favorites and check if this product is in it
        const { data: favorites } = await getFavorites();
        
        // Assuming favorites is array of product objects or IDs
        // Adjust based on what your backend actually returns
        const isFav = favorites.some(fav => 
          fav._id === id || fav.toString() === id
        );
        setIsFavorite(isFav);
      } catch (err) {
        console.error(err);
        setError('Failed to load product or favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]); // Re-run when user changes or id changes

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please login first');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
      setIsFavorite(prev => !prev); // Optimistic update
      alert(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (err) {
      console.error(err);
      alert('Failed to update favorite status');
      // Optional: revert optimistic update on error
      // setIsFavorite(prev => !prev);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data: updated } = await updateProduct(id, {
        ...form,
        price: Number(form.price),
      });
      setProduct(updated);
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
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    isFavorite
                      ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400 hover:bg-yellow-200 scale-105'
                      : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
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