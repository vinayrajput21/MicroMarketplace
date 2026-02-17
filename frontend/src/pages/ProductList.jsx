import { useState, useEffect } from 'react';
import { getProducts, createProduct } from '../api/product.api'; // ← add createProduct import
import Pagination from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import Loader from '../components/common/Loader';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../hooks/useAuth'; // ← to check if user is logged in

export default function ProductList() {
  const { user } = useAuth(); // to show "Add Product" only to logged-in users

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state for adding product
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await getProducts({
        search: debouncedSearch.trim(),
        page,
        limit: 12,
      });

      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Handle form input change in modal
  const handleNewProductChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  // Submit new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);

    try {
      await createProduct({
        ...newProduct,
        price: Number(newProduct.price),
      });

      alert('Product added successfully!');
      setShowAddModal(false);
      setNewProduct({ title: '', price: '', description: '', image: '' });

      // Refresh the list
      fetchProducts();
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header with Add Product button */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-80">
              <input
                type="text"
                placeholder="Search products by name..."
                value={search}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm"
                aria-label="Search products"
              />
            </div>

            {user && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                + Add New Product
              </button>
            )}
          </div>
        </div>

        {/* Loading / Error / Empty / Content */}
        {loading ? (
          <Loader size="large" message="Loading products..." />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium mb-3">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchProducts();
              }}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              No products found
            </h2>
            <p className="text-gray-500 mb-6">
              {debouncedSearch
                ? `No results for "${debouncedSearch}"`
                : 'There are no products available at the moment.'}
            </p>
            {debouncedSearch && (
              <button
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Product</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>
              </div>

              {addError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
                  {addError}
                </div>
              )}

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newProduct.title}
                    onChange={handleNewProductChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleNewProductChange}
                    required
                    min="1"
                    step="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleNewProductChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={newProduct.image}
                    onChange={handleNewProductChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={addLoading}
                    className={`flex-1 py-3 px-6 bg-green-600 text-white font-medium rounded-lg 
                      ${addLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                  >
                    {addLoading ? 'Adding...' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 px-6 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}