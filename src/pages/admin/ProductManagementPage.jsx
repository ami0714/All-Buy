import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../css/admin/ProductManagementPage.css';
import AdminSidebar from '../../components/AdminSidebar'; 
import {useGetProductList,useUpdateStatus} from '../../hook/admin/useProduct';

const BoxIcon = () => <Icon icon="mdi:cube-outline" width="24" height="24" aria-hidden="true" />;
const CheckCircleIcon = () => <Icon icon="mdi:check-circle-outline" width="24" height="24" aria-hidden="true" />;
const PauseCircleIcon = () => <Icon icon="mdi:pause-circle-outline" width="24" height="24" aria-hidden="true" />;
const PlusIcon = () => <Icon icon="mdi:plus" width="18" height="18" aria-hidden="true" />;
const SearchIcon = () => <Icon icon="mdi:magnify" width="18" height="18" aria-hidden="true" />;
const EditIcon = () => <Icon icon="mdi:pencil-outline" width="18" height="18" aria-hidden="true" />;
const TrashIcon = () => <Icon icon="mdi:trash-can-outline" width="18" height="18" aria-hidden="true" />;

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
            Admin <span>›</span> <span>Products</span> <span style={{ color: '#9ca3af', fontWeight: '400' }}>/admin/products</span>
          </div>
          <div className="admin-prod-header-right">
            <span className="admin-prod-badge">Admin Access</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-prod-title-section" variants={cardVariants}>
          <div className="admin-prod-title">
            <h1>Product Management</h1>
            <p>Manage the ALL-BUY product catalog, pricing, and availability.</p>
          </div>
          <button className="admin-prod-btn-add" onClick={() => navigate('/admin/product/add')}>
            <PlusIcon />
            Add Product
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="admin-prod-stats-grid" variants={cardVariants}>
          <div className="admin-prod-stat-card">
            <div className="admin-prod-stat-icon"><BoxIcon /></div>
            <div className="admin-prod-stat-info">
              <span className="admin-prod-stat-label">Total Products</span>
              <span className="admin-prod-stat-value">{totalProducts}</span>
            </div>
          </div>
          <div className="admin-prod-stat-card">
            <div className="admin-prod-stat-icon"><CheckCircleIcon /></div>
            <div className="admin-prod-stat-info">
              <span className="admin-prod-stat-label">Active Products</span>
              <span className="admin-prod-stat-value">{activeProducts}</span>
            </div>
          </div>
          <div className="admin-prod-stat-card">
            <div className="admin-prod-stat-icon"><PauseCircleIcon /></div>
            <div className="admin-prod-stat-info">
              <span className="admin-prod-stat-label">Inactive</span>
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
              All Products
            </div>
            <div 
              className={`admin-prod-tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </div>
            <div 
              className={`admin-prod-tab ${activeTab === 'inactive' ? 'active' : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              Inactive
            </div>
          </div>

          {/* Filters */}
          <div className="admin-prod-filters">
            <div className="admin-prod-search-wrapper">
              <SearchIcon />
              <input 
                type="text" 
                className="admin-prod-search-input" 
                placeholder="Search product name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <table className="admin-prod-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Base Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {isLoading ? (
                  <tr><td colSpan="5">Loading products...</td></tr>
                ) : isError ? (
                  <tr><td colSpan="5">{error.message}</td></tr>
                ) : currentItems.length === 0 ? (
                  <tr><td colSpan="5">No products found.</td></tr>
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
                          <span className="admin-prod-item-sku">ID: {product.id} · {product.variant_count ?? product.variants ?? 0} variants</span>
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
                            aria-label={`Product status for ${product.name}`}
                          />
                          <span className="admin-prod-slider"></span>
                        </label>
                        <span className="admin-prod-toggle-label">
                          {product.is_active === true || product.is_active === 1 ? 'Active' : 'Inactive'}
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
                          Manage Variants
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
              Showing {filteredProducts.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="admin-prod-pagination-controls">
              <button 
                className="admin-prod-page-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
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
                Next
              </button>
            </div>
          </div>

        </motion.div>

        {/* Footer */}
        <motion.div className="admin-prod-footer" variants={cardVariants}>
          <span>Product data from API</span>
          <span>© 2026 ALL-BUY</span>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default ProductManagementPage;