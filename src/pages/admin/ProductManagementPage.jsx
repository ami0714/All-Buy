import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../../css/admin/ProductManagementPage.css';
import AdminSidebar from '../../components/AdminSidebar'; 
import {useGetProductList,useUpdateStatus} from '../../hook/admin/useProduct';

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
 
  const [activeTab, setActiveTab] = useState('all');
  const { data: products = [], isLoading, isError, error } = useGetProductList(activeTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Logik Penapisan (Filtering)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const name = product?.name ?? '';
      const slug = product?.slug ?? '';
      const id = String(product?.id ?? '');
      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        id.includes(searchTerm);

      return matchesSearch;
    });
  }, [products, searchTerm]);

  // Logik Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [currentItems, setCurrentItems] = useState(() => (
    filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
  ));

   const {mutate:updateStatus} = useUpdateStatus();
  const handleToggleStatus = (product) => {

    updateStatus({statusVal:product?.is_active,product_id:product?.id});
    //dalam kurungan currentItems tu amik nilai semasa dan mapping yang mreturn nilai,dan cek jika id sama maka return nilai
    //baru yang ditukarkan
    setCurrentItems((currentItems) => currentItems.map((item) => (
      item.id === product.id
        ? {
          ...item,
          is_active: item.is_active === true || item.is_active === 1 ? 0 : 1,
          status: item.is_active === true || item.is_active === 1 ? 'inactive' : 'active',
        }
        : item
    )));
     
      
    
  };

  // Reset ke halaman 1 apabila tab atau carian berubah
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  React.useEffect(() => {
    setCurrentItems(filteredProducts.slice(indexOfFirstItem, indexOfLastItem));
  }, [filteredProducts, indexOfFirstItem, indexOfLastItem]);

  // Kiraan Statistik
  const totalProducts = products.length;
  const activeProducts = products.filter((product) => {
    const displayedProduct = currentItems.find((item) => item.id === product.id);
    return displayedProduct
      ? displayedProduct.is_active === true || displayedProduct.is_active === 1
      : product.is_active === true || product.is_active === 1 || product.status === 'active';
  }).length;
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
              Semua produk 
            </div>
            <div 
              className={`admin-prod-tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Aktif 
            </div>
            <div 
              className={`admin-prod-tab ${activeTab === 'inactive' ? 'active' : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              Tidak aktif 
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
                {isLoading ? (
                  <tr><td colSpan="5">Memuatkan produk...</td></tr>
                ) : isError ? (
                  <tr><td colSpan="5">{error.message}</td></tr>
                ) : currentItems.length === 0 ? (
                  <tr><td colSpan="5">Tiada produk ditemui.</td></tr>
                ) : currentItems.map((product) => {
                  const price = Number(product.default_price ?? product.price);

                  return (
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
                          <span className="admin-prod-item-sku">ID: {product.id} · {product.variant_count ?? product.variants ?? 0} variasi</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.category ?? '-'}</td>
                    <td>{Number.isFinite(price) ? `RM${price.toFixed(2)}` : '-'}</td>
                    <td>
                      <div className="admin-prod-toggle-wrapper">
                        <label className="admin-prod-toggle">
                          <input 
                            type="checkbox" 
                            checked={product.is_active === true || product.is_active === 1}
                            onChange={() => handleToggleStatus(product)}
                            aria-label={`Status produk ${product.name}`}
                          />
                          <span className="admin-prod-slider"></span>
                        </label>
                        <span className="admin-prod-toggle-label">
                          {product.is_active === true || product.is_active === 1 ? 'Aktif' : 'Tidak aktif'}
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
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Pagination */}
          <div className="admin-prod-pagination">
            <div className="admin-prod-pagination-info">
              Memaparkan {filteredProducts.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} daripada {filteredProducts.length} produk
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
                disabled={totalPages === 0 || currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Seterusnya
              </button>
            </div>
          </div>

        </motion.div>

        {/* Footer */}
        <motion.div className="admin-prod-footer" variants={cardVariants}>
          <span>Data produk daripada API</span>
          <span>© 2026 ALL-BUY</span>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default ProductManagementPage;