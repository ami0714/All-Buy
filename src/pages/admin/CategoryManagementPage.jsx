import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import '../../css/admin/CategoryManagementPage.css';
import AdminSidebar from '../../components/AdminSidebar'; // Pastikan komponen ini wujud
import { getDirtyValues } from '../../utils/form';

// ==========================================
// DUMMY DATA (Berdasarkan db.sql - Jadual categories)
// ==========================================
const initialCategories = [
  { id: 1, name: "Shirts", slug: "shirts", description: "Everyday shirts for men.", is_active: true, product_count: 8 },
  { id: 2, name: "T-Shirts", slug: "t-shirts", description: "Casual wear for everyday comfort.", is_active: true, product_count: 4 },
  { id: 3, name: "Accessories", slug: "accessories", description: "Style complements and daily essentials.", is_active: false, product_count: 0 },
];

// Ikon SVG
const LayersIcon = () => (
  <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
);
const BoxIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);
const TshirtIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z"></path><path d="M4 9h16"></path><path d="M9 4v16"></path></svg>
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
const PlusIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Setup React Hook Form
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, dirtyFields } } = useForm({
    defaultValues: {
      id: null,
      name: '',
      slug: '',
      description: '',
      is_active: true
    }
  });

  // Auto-generate slug daripada nama kategori
  const categoryName = watch('name');
  useEffect(() => {
    if (categoryName) {
      const generatedSlug = categoryName
        .toLowerCase()
        .split(' ').join('-');
      setValue('slug', generatedSlug, { shouldDirty: true });
    }
  }, [categoryName, setValue]);

  // Buka borang untuk Tambah Kategori baru
  const handleAddNew = () => {
    setEditingCategoryId(null);
    reset({
      id: null,
      name: '',
      slug: '',
      description: '',
      is_active: true
    });
    setIsFormOpen(true);
  };

  // Buka borang untuk Edit Kategori sedia ada
  const handleEdit = (category) => {
    setEditingCategoryId(category.id);
    //nanti fetch data kategpry guna useQuery
    reset({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      is_active: category.is_active
    });
    setIsFormOpen(true);
  };

  // Tutup borang
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategoryId(null);
  };

  // Simpan Kategori (Tambah atau Edit)
  const onSubmit = (allData) => {
    if (editingCategoryId) {
      const changed = getDirtyValues(allData, dirtyFields);
      if (Object.keys(changed).length === 0) {
        alert('Tiada perubahan');
        return;
      }

      // Logik Edit
      setCategories(categories.map(c => 
        c.id === editingCategoryId 
          ? { ...c, ...changed }
          : c
      ));
      alert("Kategori berjaya dikemas kini!");
    } else {
      // Logik Tambah
      const newCategory = {
        id: categories.length + 1,
        ...allData,
        product_count: 0
      };
      setCategories([...categories, newCategory]);
      alert("Kategori baru berjaya ditambah!");
    }
    handleCloseForm();
  };

  // Logik Carian
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Kiraan Statistik
  const totalCategories = categories.length;
  const totalCategorizedProducts = categories.reduce((sum, cat) => sum + cat.product_count, 0);
  const largestCategory = categories.reduce((max, cat) => cat.product_count > max.product_count ? cat : max, categories[0]);

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

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, type: 'spring', stiffness: 200, damping: 25 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
  };

  return (
    <div className="admin-cat-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="categories" />

      {/* Main Content Area */}
      <motion.div 
        className="admin-cat-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header */}
        <motion.div className="admin-cat-top-header" variants={cardVariants}>
          <div className="admin-cat-breadcrumbs">
            Admin <span>›</span> <span>Categories</span> <span style={{ color: '#9ca3af', fontWeight: '400' }}>/admin/categories</span>
          </div>
          <div className="admin-cat-header-right">
            <span className="admin-cat-badge">Admin access</span>
            <span className="admin-cat-date">12 Oct 2026</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-cat-title-section" variants={cardVariants}>
          <div className="admin-cat-title">
            <h1>Category Management</h1>
            <p>Organize product types so your store catalog is easier to explore.</p>
          </div>
          <button className="admin-cat-btn-add" onClick={handleAddNew}>
            <PlusIcon />
            Add Category
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="admin-cat-stats-grid" variants={cardVariants}>
          <div className="admin-cat-stat-card">
            <div className="admin-cat-stat-header">
              <span className="admin-cat-stat-label">Categories</span>
              <div className="admin-cat-stat-icon"><LayersIcon /></div>
            </div>
            <div className="admin-cat-stat-value">{totalCategories}</div>
            <div className="admin-cat-stat-sub">Product types in the catalog</div>
          </div>
          <div className="admin-cat-stat-card">
            <div className="admin-cat-stat-header">
              <span className="admin-cat-stat-label">Categorized Products</span>
              <div className="admin-cat-stat-icon"><BoxIcon /></div>
            </div>
            <div className="admin-cat-stat-value">{totalCategorizedProducts}</div>
            <div className="admin-cat-stat-sub">All products have a category</div>
          </div>
          <div className="admin-cat-stat-card">
            <div className="admin-cat-stat-header">
              <span className="admin-cat-stat-label">Largest Category</span>
              <div className="admin-cat-stat-icon"><TshirtIcon /></div>
            </div>
            <div className="admin-cat-stat-value">{largestCategory ? largestCategory.name : '-'}</div>
            <div className="admin-cat-stat-sub">
              {largestCategory ? `${largestCategory.product_count} products · ${Math.round((largestCategory.product_count / totalCategorizedProducts) * 100)}% of the catalog` : '-'}
            </div>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="admin-cat-grid">
          
          {/* Left Column: Table */}
          <motion.div className="admin-cat-table-card" variants={cardVariants}>
            <div className="admin-cat-table-header">
              <h3 className="admin-cat-table-title">Category List</h3>
              <span className="admin-cat-table-badge">{totalCategories} categories</span>
            </div>
            
            <div className="admin-cat-search-wrapper">
              <SearchIcon />
              <input 
                type="text" 
                className="admin-cat-search-input" 
                placeholder="Search categories..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <table className="admin-cat-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredCategories.map((category) => (
                    <motion.tr 
                      key={category.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className={editingCategoryId === category.id ? 'selected' : ''}
                    >
                      <td>
                        <div className="admin-cat-name-wrapper">
                          <span className="admin-cat-name">{category.name}</span>
                          <span className="admin-cat-sku">CAT-{String(category.id).padStart(3, '0')}</span>
                        </div>
                      </td>
                      <td>{category.slug}</td>
                      <td><div className="admin-cat-desc">{category.description}</div></td>
                      <td>
                        <span className={`admin-cat-status ${category.is_active ? 'active' : 'inactive'}`}>
                          <span className="admin-cat-status-dot"></span>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-cat-actions">
                          <button className="admin-cat-action-btn" onClick={() => handleEdit(category)}>
                            <EditIcon />
                            Edit
                          </button>
                          <button className="admin-cat-action-btn delete">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            <div className="admin-cat-table-footer">
              Showing all {filteredCategories.length} categories · {totalCategorizedProducts} products
            </div>

            {/* Info Box */}
            <motion.div 
              className="admin-cat-info-box"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <InfoIcon />
              <div className="admin-cat-info-content">
                <h4>Before deleting a category</h4>
                <p>Move products to another category first. Categories with products cannot be deleted.</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Form (Conditional Rendering) */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div 
                className="admin-cat-form-card"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="admin-cat-form-header">
                  <h3 className="admin-cat-form-title">
                    {editingCategoryId ? 'Edit Category' : 'Add Category'}
                  </h3>
                  <button className="admin-cat-close-btn" onClick={handleCloseForm}>
                    <CloseIcon />
                  </button>
                </div>

                <p className="admin-cat-form-subtitle">
                  {editingCategoryId 
                    ? 'Update this category to keep your product organization accurate.' 
                    : 'Create a new category to organize your products.'}
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Hidden input untuk ID (untuk edit) */}
                  <input type="hidden" {...register("id")} />

                  <div className="admin-cat-form-group">
                    <label>Category Name <span>*</span></label>
                    <input 
                      type="text" 
                      className="admin-cat-input" 
                      placeholder="Contoh: Pants"
                      {...register("name", { required: true })} 
                    />
                  </div>

                  <div className="admin-cat-form-group">
                    <label>Slug</label>
                    <input 
                      type="text" 
                      className="admin-cat-input" 
                      disabled 
                      {...register("slug")} 
                    />
                    <span className="admin-cat-input-hint">Generated automatically from the category name.</span>
                  </div>

                  <div className="admin-cat-form-group">
                    <label>Short Description</label>
                    <textarea 
                      className="admin-cat-textarea" 
                      placeholder="Contoh: Casual pants for everyday wear."
                      {...register("description")} 
                    ></textarea>
                  </div>

                  <div className="admin-cat-toggle-box">
                    <div className="admin-cat-toggle-text">
                      <h4>Active Status</h4>
                      <p>Visible in the catalog and available for new products.</p>
                    </div>
                    <label className="admin-cat-toggle">
                      <input 
                        type="checkbox" 
                        {...register("is_active")} 
                      />
                      <span className="admin-cat-slider"></span>
                    </label>
                  </div>

                  <div className="admin-cat-form-actions">
                    <button 
                      type="button" 
                      className="admin-cat-btn-cancel" 
                      onClick={handleCloseForm}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="admin-cat-btn-submit"
                    >
                      <CheckIcon />
                      Save Category
                    </button>
                  </div>
                </form>

                <div className="admin-cat-form-footer">
                  Choose Edit in the list to update an existing category.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer */}
        <motion.div className="admin-cat-footer" variants={cardVariants}>
          <span>Sample data only - Not live data</span>
          <span>© 2026 ALL-BUY</span>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default CategoryManagementPage;