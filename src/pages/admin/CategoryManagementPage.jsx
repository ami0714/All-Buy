import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../css/admin/CategoryManagementPage.css';
import {useGetcategory,useAddCategory,useUpdateCategory} from '../../hook/admin/useCategory';
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

const LayersIcon = () => <Icon icon="mdi:layers-outline" width="18" height="18" aria-hidden="true" />;
const BoxIcon = () => <Icon icon="mdi:cube-outline" width="18" height="18" aria-hidden="true" />;
const TshirtIcon = () => <Icon icon="mdi:tshirt-crew-outline" width="18" height="18" aria-hidden="true" />;
const SearchIcon = () => <Icon icon="mdi:magnify" width="18" height="18" aria-hidden="true" />;
const EditIcon = () => <Icon icon="mdi:pencil-outline" width="18" height="18" aria-hidden="true" />;
const TrashIcon = () => <Icon icon="mdi:trash-can-outline" width="18" height="18" aria-hidden="true" />;
const PlusIcon = () => <Icon icon="mdi:plus" width="18" height="18" aria-hidden="true" />;
const CloseIcon = () => <Icon icon="mdi:close" width="18" height="18" aria-hidden="true" />;
const CheckIcon = () => <Icon icon="mdi:check" width="18" height="18" aria-hidden="true" />;
const InfoIcon = () => <Icon icon="mdi:information-outline" width="20" height="20" aria-hidden="true" />;

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: categoryData, isLoading: isCategoryLoad, isError: isCategoryError } = useGetcategory();
  const { mutate: addCategory,isPending:isAddPending } = useAddCategory();
  const { mutate: updateCategory,isPending:isUpdatePending } = useUpdateCategory();
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
        alert('No changes were made.');
        return;
      }

      // Logik Edit
      setCategories(categories.map(c => 
        c.id === editingCategoryId 
          ? { ...c, ...changed }
          : c
      ));
      updateCategory({body:changed,category_id:editingCategoryId},{
        onSuccess:(res)=>{
          alert(res)
        },
        onError:(res)=>{
          alert(res)
        }
      });
    } else {
      // Logik Tambah
      const newCategory = {
        id: categories.length + 1,
        ...allData,
        product_count: 0
      };
      addCategory(allData);
    }
    handleCloseForm();
  };

  // Logik Carian
  const filteredCategories = categoryData?.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Category status values from the API may be booleans, integers, or strings.
  const isCategoryActive = (category) => (
    category?.is_active === true
    || category?.is_active === 1
    || category?.is_active === '1'
    || category?.is_active === 'true'
    || category?.is_active === 'active'
  );
  const totalCategories = categories.length;
  const totalCategorizedProducts = Array.isArray(categoryData)
    ? categoryData.reduce((sum, category) => sum + (Number(category?.product_count) || 0), 0)
    : 0;
  const activeCategoryCount = Array.isArray(categoryData)
    ? categoryData.filter(isCategoryActive).length
    : 0;
  const inactiveCategoryCount = Array.isArray(categoryData)
    ? categoryData.filter((category) => !isCategoryActive(category)).length
    : 0;

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
              <span className="admin-cat-stat-label">Active Categories</span>
              <div className="admin-cat-stat-icon"><BoxIcon /></div>
            </div>
            <div className="admin-cat-stat-value">{activeCategoryCount}</div>
            <div className="admin-cat-stat-sub">
              {isCategoryLoad
                ? 'Loading categories...'
                : isCategoryError
                  ? 'Unable to load category status'
                  : 'Available in the store'}
            </div>
          </div>
          <div className="admin-cat-stat-card">
            <div className="admin-cat-stat-header">
              <span className="admin-cat-stat-label">Inactive Categories</span>
              <div className="admin-cat-stat-icon"><TshirtIcon /></div>
            </div>
            <div className="admin-cat-stat-value">{inactiveCategoryCount}</div>
            <div className="admin-cat-stat-sub">
              {isCategoryLoad
                ? 'Loading categories...'
                : isCategoryError
                  ? 'Unable to load category status'
                  : 'Hidden from the store'}
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
                  {filteredCategories?.map((category) => (
                    <motion.tr 
                      key={category?.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className={editingCategoryId === category?.id ? 'selected' : ''}
                    >
                      <td>
                        <div className="admin-cat-name-wrapper">
                          <span className="admin-cat-name">{category?.name}</span>
                          <span className="admin-cat-sku">CAT-{String(category?.id).padStart(3, '0')}</span>
                        </div>
                      </td>
                      <td>{category?.slug}</td>
                      <td><div className="admin-cat-desc">{category?.description}</div></td>
                      <td>
                        <span className={`admin-cat-status ${category?.is_active ? 'active' : 'inactive'}`}>
                          <span className="admin-cat-status-dot"></span>
                          {category?.is_active ? 'Active' : 'Inactive'}
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
              Showing all {filteredCategories?.length} categories · {totalCategorizedProducts} products
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
                      placeholder="Example: Pants"
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
                      placeholder="Example: Casual pants for everyday wear."
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

        

      </motion.div>
    </div>
  );
};

export default CategoryManagementPage;