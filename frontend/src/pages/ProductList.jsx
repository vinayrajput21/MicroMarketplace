import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/product.api';
import Pagination from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import Loader from '../components/common/Loader';
import ProductCard from '../components/ProductCard'; // ← assuming you created this

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 500); // 500ms is usually enough

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await getProducts({
          search: debouncedSearch.trim(),
          page,
          limit: 12, // you can make this configurable if needed
        });

        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(
          err.response?.data?.message ||
            'Failed to load products. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // reset to first page on new search
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search Bar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>

          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-blue-500 transition-shadow shadow-sm"
              aria-label="Search products"
            />
          </div>
        </div>

        {/* Loading / Error / Content */}
        {loading ? (
          <Loader size="large" message="Loading products..." />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium mb-3">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
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
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  // Optional: if you want favorite toggle directly from list
                  // isFavorited={...}
                  // onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>

            {/* Pagination */}
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
    </div>
  );
}