import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/product.api';
import Pagination from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 600);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProducts({ 
          search: debouncedSearch, 
          page 
        });
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [debouncedSearch, page]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full max-w-lg px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {p.title}
                </h3>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  ₹{p.price.toLocaleString()}
                </p>
                <Link
                  to={`/products/${p._id}`}
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}