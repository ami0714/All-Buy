import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../../css/admin/ProductManagementPage.css';
import AdminSidebar from '../../components/AdminSidebar'; // Pastikan komponen ini wujud

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================
// Menggabungkan data dari jadual `products`, `product_variants`, dan `categories`
const initialProducts = [
  { id: 1, name: "Kemeja Lelaki Biru", sku: "PRD-001", variants: 6, category: "Kemeja", price: 20.00, is_active: true, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 2, name: "Kemeja Lelaki Putih", sku: "PRD-002", variants: 3, category: "Kemeja", price: 20.00, is_active: true, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 3, name: "Kemeja Lelaki Hitam", sku: "PRD-003", variants: 3, category: "Kemeja", price: 20.00, is_active: true, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 4, name: "Kemeja Lelaki Merah", sku: "PRD-004", variants: 3, category: "Kemeja", price: 20.00, is_active: true, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 5, name: "Kemeja Lelaki Kuning", sku: "PRD-005", variants: 3, category: "Kemeja", price: 20.00, is_active: false, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 6, name: "Kemeja Lelaki Hijau", sku: "PRD-006", variants: 3, category: "Kemeja", price: 20.00, is_active: true, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 7, name: "Kemeja Lelaki Ungu", sku: "PRD-007", variants: 3, category: "Kemeja", price: 20.00, is_active: true, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 8, name: "Kemeja Lelaki Kelabu", sku: "PRD-008", variants: 3, category: "Kemeja", price: 20.00, is_active: false, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 9, name: "Kemeja Lelaki Coklat", sku: "PRD-009", variants: 3, category: "Kemeja", price: 20.00, is_active: true, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 10, name: "Kemeja Lelaki Oren", sku: "PRD-010", variants: 3, category: "Kemeja", price: 20.00, is_active: true, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 11, name: "Kemeja Lelaki Perak", sku: "PRD-011", variants: 3, category: "Kemeja", price: 20.00, is_active: true, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 12, name: "Kemeja Lelaki Emas", sku: "PRD-012", variants: 3, category: "Kemeja", price: 20.00, is_active: true, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
];

// Ikon SVG
const BoxIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const PauseCircleIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line></svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const ProductManagementPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fungsi untuk toggle status aktif/tidak aktif
  const handleToggleStatus = (id) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, is_active: !p.is_active } : p
    ));
  };

  // Logik Penapisan (Filtering)
  //gantikan guna tasntak query untuk change category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesTab = 
        activeTab === 'all' ? true :
        activeTab === 'active' ? product.is_active :
        !product.is_active;
      
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [products, activeTab, searchTerm]);

  // Logik Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Reset ke halaman 1 apabila tab atau carian berubah
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Kiraan Statistik
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_active).length;
  const inactiveProducts = totalProducts - activeProducts;

  // Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="admin-prod-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="products" />

      {/* Main Content Area */}
      <motion.div 
        className="admin-prod-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header */}
        <motion.div className="admin-prod-top-header" variants={cardVariants}>
          <div className="admin-prod-breadcrumbs">
            Admin <span>›</span> <span>Produk</span> <span style={{ color: '#9ca3af', fontWeight: '400' }}>/admin/products</span>
          </div>
          <div className="admin-prod-header-right">
            <span className="admin-prod-badge">Akses pentadbir</span>
            <span className="admin-prod-date">12 Okt 2026</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-prod-title-section" variants={cardVariants}>
          <div className="admin-prod-title">
            <h1>Pengurusan Produk</h1>
            <p>Urus katalog, harga dan ketersediaan produk ALL-BUY.</p>
          </div>
          <button className="admin-prod-btn-add" onClick={() => navigate('/admin/product/add')}>
            <PlusIcon />
            Tambah Produk
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="admin-prod-stats-grid" variants={cardVariants}>
          <div className="admin-prod-stat-card">
            <div className="admin-prod-stat-icon"><BoxIcon /></div>
            <div className="admin-prod-stat-info">
              <span className="admin-prod-stat-label">Jumlah produk</span>
              <span className="admin-prod-stat-value">{totalProducts}</span>
            </div>
          </div>
          <div className="admin-prod-stat-card">
            <div className="admin-prod-stat-icon"><CheckCircleIcon /></div>
            <div className="admin-prod-stat-info">
              <span className="admin-prod-stat-label">Produk aktif</span>
              <span className="admin-prod-stat-value">{activeProducts}</span>
            </div>
          </div>
          <div className="admin-prod-stat-card">
            <div className="admin-prod-stat-icon"><PauseCircleIcon /></div>
            <div className="admin-prod-stat-info">
              <span className="admin-prod-stat-label">Tidak aktif</span>
              <span className="admin-prod-stat-value">{inactiveProducts}</span>
            </div>
          </div>
        </motion.div>

        {/* Main Table Card */}
        <motion.div className="admin-prod-table-card" variants={cardVariants}>
          
          {/* Tabs */}
          <div className="admin-prod-tabs">
            <div 
              className={`admin-prod-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Semua produk ({totalProducts})
            </div>
            <div 
              className={`admin-prod-tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Aktif ({activeProducts})
            </div>
            <div 
              className={`admin-prod-tab ${activeTab === 'inactive' ? 'active' : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              Tidak aktif ({inactiveProducts})
            </div>
          </div>

          {/* Filters */}
          <div className="admin-prod-filters">
            <div className="admin-prod-search-wrapper">
              <SearchIcon />
              <input 
                type="text" 
                className="admin-prod-search-input" 
                placeholder="Cari nama produk atau ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="admin-prod-filter-select">
              <option>Semua kategori</option>
              <option>Kemeja</option>
            </select>
            <select className="admin-prod-filter-select">
              <option>Semua status</option>
              <option>Aktif</option>
              <option>Tidak aktif</option>
            </select>
          </div>

          {/* Table */}
          <table className="admin-prod-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga asas</th>
                <th>Status</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentItems.map((product) => (
                  <motion.tr 
                    key={product.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <td>
                      <div className="admin-prod-item-info">
                        <div className="admin-prod-item-image">
                          <img src={product.image_url} alt={product.name} />
                        </div>
                        <div className="admin-prod-item-details">
                          <span className="admin-prod-item-name">{product.name}</span>
                          <span className="admin-prod-item-sku">{product.sku} · {product.variants} variasi</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>RM{product.price.toFixed(2)}</td>
                    <td>
                      <div className="admin-prod-toggle-wrapper">
                        <label className="admin-prod-toggle">
                          <input 
                            type="checkbox" 
                            checked={product.is_active}
                            onChange={() => handleToggleStatus(product.id)}
                          />
                          <span className="admin-prod-slider"></span>
                        </label>
                        <span className="admin-prod-toggle-label">
                          {product.is_active ? 'Aktif' : 'Tidak aktif'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-prod-actions">
                        <button className="admin-prod-action-btn" onClick={() => navigate(`/admin/product/edit/${product.id}`)}>
                          <EditIcon />
                          Edit
                        </button>
                        <button className="admin-prod-btn-variants" onClick={() => navigate(`/admin/product/${product.id}/variant`)}>
                          Urus Variasi
                        </button>
                        <button className="admin-prod-action-delete">
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Pagination */}
          <div className="admin-prod-pagination">
            <div className="admin-prod-pagination-info">
              Memaparkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} daripada {filteredProducts.length} produk
            </div>
            <div className="admin-prod-pagination-controls">
              <button 
                className="admin-prod-page-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Sebelumnya
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`admin-prod-page-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button 
                className="admin-prod-page-btn" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Seterusnya
              </button>
            </div>
          </div>

        </motion.div>

        {/* Footer */}
        <motion.div className="admin-prod-footer" variants={cardVariants}>
          <span>Data contoh ilustratif - Bukan data langsung</span>
          <span>© 2026 ALL-BUY</span>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default ProductManagementPage;