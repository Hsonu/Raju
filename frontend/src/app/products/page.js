'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { Laptop, Search } from 'lucide-react';
import styles from './page.module.css';

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ brand: '', minPrice: '', maxPrice: '', sort: '-createdAt' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      if (search) params.search = search;
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const data = await api.getProducts(params);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      // Use demo data for now
      setProducts(getDemoProducts());
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Page Header */}
        <section className={styles.pageHeader}>
          <div className="container">
            <nav className={styles.breadcrumb}>
              <Link href="/">Home</Link> / <span>Products</span>
            </nav>
            <h1 className={styles.pageTitle}>Laptops & Computers</h1>
            <p className={styles.pageDesc}>Browse our collection of laptops, desktops, and accessories</p>
          </div>
        </section>

        <div className={`container ${styles.content}`}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </form>
            <select
              className={styles.sortSelect}
              value={filters.sort}
              onChange={(e) => setFilters({...filters, sort: e.target.value})}
            >
              <option value="-createdAt">Newest First</option>
              <option value="sellingPrice">Price: Low to High</option>
              <option value="-sellingPrice">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="-rating.average">Top Rated</option>
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className={styles.grid}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={styles.skelCard}>
                  <div className={`skeleton ${styles.skelImage}`} />
                  <div className={styles.skelBody}>
                    <div className="skeleton" style={{height: 14, width: '60%', marginBottom: 8}} />
                    <div className="skeleton" style={{height: 18, width: '90%', marginBottom: 12}} />
                    <div className="skeleton" style={{height: 24, width: '50%'}} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon} style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <Search size={44} color="#94a3b8" />
              </div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map((product) => (
                <Link key={product._id} href={`/products/${product.slug || product._id}`} className={styles.productCard}>
                  <div className={styles.productImage}>
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt={product.name} loading="lazy" />
                    ) : (
                      <div className={styles.productImagePlaceholder}>
                        <Laptop size={36} color="#94a3b8" />
                      </div>
                    )}
                    {product.discountPercentage > 0 && (
                      <span className={styles.discountBadge}>{product.discountPercentage}% OFF</span>
                    )}
                  </div>
                  <div className={styles.productBody}>
                    <span className={styles.productBrand}>{product.brand}</span>
                    <h3 className={styles.productName}>{product.name}</h3>
                    {product.specifications?.ram && (
                      <p className={styles.productSpecs}>
                        {product.specifications.ram} RAM • {product.specifications.storage} • {product.specifications.processor}
                      </p>
                    )}
                    <div className={styles.productPricing}>
                      <span className={styles.productPrice}>{formatPrice(product.sellingPrice)}</span>
                      {product.mrp > product.sellingPrice && (
                        <span className={styles.productMrp}>{formatPrice(product.mrp)}</span>
                      )}
                    </div>
                    <div className={styles.productMeta}>
                      <span className={`badge ${product.stockQuantity > 0 ? 'badge-success' : 'badge-error'}`}>
                        {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {product.gstPercentage > 0 && (
                        <span className={styles.gstTag}>GST Included</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >Previous</button>
              <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
              <button
                className={styles.pageBtn}
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >Next</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function getDemoProducts() {
  return [
    { _id: '1', name: 'Dell Inspiron 15 3520', brand: 'Dell', slug: 'dell-inspiron-15-3520', mrp: 55999, sellingPrice: 47999, gstPercentage: 18, stockQuantity: 5, discountPercentage: 14, specifications: { ram: '8GB', storage: '512GB SSD', processor: 'Intel i5 12th Gen' }, images: [], rating: { average: 4.5, count: 12 } },
    { _id: '2', name: 'HP Pavilion 14', brand: 'HP', slug: 'hp-pavilion-14', mrp: 65000, sellingPrice: 57999, gstPercentage: 18, stockQuantity: 3, discountPercentage: 11, specifications: { ram: '16GB', storage: '512GB SSD', processor: 'Intel i5 13th Gen' }, images: [], rating: { average: 4.3, count: 8 } },
    { _id: '3', name: 'Lenovo IdeaPad Slim 3', brand: 'Lenovo', slug: 'lenovo-ideapad-slim-3', mrp: 42999, sellingPrice: 38999, gstPercentage: 18, stockQuantity: 8, discountPercentage: 9, specifications: { ram: '8GB', storage: '256GB SSD', processor: 'AMD Ryzen 5' }, images: [], rating: { average: 4.2, count: 15 } },
    { _id: '4', name: 'ASUS VivoBook 15', brand: 'ASUS', slug: 'asus-vivobook-15', mrp: 48000, sellingPrice: 41999, gstPercentage: 18, stockQuantity: 0, discountPercentage: 12, specifications: { ram: '8GB', storage: '512GB SSD', processor: 'Intel i3 12th Gen' }, images: [], rating: { average: 4.0, count: 6 } },
  ];
}
