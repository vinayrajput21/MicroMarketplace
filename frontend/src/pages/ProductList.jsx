import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/product.api';
import Pagination from '../components/common/Pagination';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProducts({ search, page });
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [search, page]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      <div className="product-grid">
        {products.map(p => (
          <div key={p._id} className="product-card">
            <img src={p.image} alt={p.title} width="200" />
            <h3>{p.title}</h3>
            <p>₹{p.price}</p>
            <Link to={`/products/${p._id}`}>View Details</Link>
          </div>
        ))}
      </div>

      <Pagination current={page} total={totalPages} onChange={setPage} />
    </div>
  );
}