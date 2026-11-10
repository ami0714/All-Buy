import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {useGetProductDetail, useUpdateProduct,useAddProduct} from '../../hook/admin/useProduct';
import {useGetcategory} from '../../hook/admin/useCategory'
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/admin/ProductEditPage.css';
import AdminSidebar from '../../components/AdminSidebar'; // Pastikan komponen ini wujud
import { getDirtyValues } from '../../utils/form';



// Ikon SVG
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: categories = [],
    isLoading: isCategoryLoad,
    isError: isCategoryError,
    error: categoryError,
  } = useGetcategory()
  const {
    data: product,
    isLoading: isProductLoad,
    isError: isProductError,
    error: productError,
  } = useGetProductDetail(id)
  const { mutate: updateProduct, isPending: isUpdatePending } = useUpdateProduct();
  const {mutate:addProduct,isPending:isAddPending} = useAddProduct();


  // 1. Tentukan mod Edit atau Tambah
  // Jika ada 'id' dalam URL, maka isEdit = true
  const isEdit = !!id;

  // 2. Setup React Hook Form
  const { register, handleSubmit,reset, watch, setValue, formState: { dirtyFields } } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      default_price: '',
      category_id: '',
      is_active: true,
      image_url: ''
    }
  });

  useEffect(() => {
    if (!isEdit || !product) {
      return;
    }

    

    reset({
      id: product.id ?? id,
      name: product.name ?? '',
      slug: product.slug ?? '',
      description: product.description ?? '',
      default_price: product.default_price ?? '',
      category_id: String(product.category_id ?? ''),
      is_active: product.is_active === true
        || product.is_active === 1
        || product.is_active === '1'
        || product.is_active === 'true'
        || product.is_active === 'active',
      image_url: product.image_url ?? '',
      variants_count: product.variants_count ?? product.variant_count ?? 0,
      total_stock: product.total_stock ?? 0,
      last_updated: product.last_updated ?? '',
    });
  }, [id, isEdit, product, reset,categories]);
  

  // Logik untuk auto-generate slug daripada nama produk
  const productName = watch('name');
  useEffect(() => {
    if (productName && !isEdit) {
      const generatedSlug = productName
        .toLowerCase().split(' ').join('-')
      setValue('slug', generatedSlug);
    }
  }, [productName, setValue, isEdit]);

  // Fungsi apabila borang dihantar
  const onSubmit = (allData) => {
    if (!isEdit && !product) {
      addProduct(allData,{
      onSuccess: () => navigate('/admin/product-management'),
    })
    }

    if (product && isEdit) {
       const changed = getDirtyValues(allData, dirtyFields);
    if (Object.keys(changed).length === 0) {
      alert('No changes were made.');
      return;
    }

    updateProduct({ productId: id, changed:changed }, {
      onSuccess: () => navigate('/admin/product-management'),
    });
    }

   
  };

  const handleCancel = () => {
    navigate('/admin/product-management');
  };

  // Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="admin-edit-prod-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="products" />
        
      {/* Main Content Area */}
      <motion.div 
        className="admin-edit-prod-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header */}
        <motion.div className="admin-edit-prod-top-header" variants={cardVariants}>
          <div className="admin-edit-prod-breadcrumbs">
            Admin <span>›</span> <span>Products</span> <span style={{ color: '#9ca3af', fontWeight: '400' }}>/admin/products/{isEdit ? `${product?.slug || id}/edit` : 'add'}</span>
          </div>
          <div className="admin-edit-prod-header-right">
            <span className="admin-edit-prod-badge">Admin access</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-edit-prod-title-section" variants={cardVariants}>
          <div className="admin-edit-prod-title">
            <button className="admin-edit-prod-back-btn" onClick={handleCancel}>
              <ArrowLeftIcon />
              Back to Product Management
            </button>
            <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
            <p>{isEdit ? 'Update the product information. Fields marked with * are required.' : 'Enter the new product information. Fields marked with * are required.'}</p>
          </div>
          {isEdit && (
            <div className="admin-edit-prod-sku-badge">
              ID: {product?.id ?? id}
            </div>
          )}
        </motion.div>

        {/* Grid Layout */}
        <div className="admin-edit-prod-grid">
          
          {/* Left Column: Form */}
          <motion.div className="admin-edit-prod-card" variants={cardVariants}>
            <div className="admin-edit-prod-card-header">
              <h2 className="admin-edit-prod-card-title">Product Information</h2>
              {isEdit && <span className="admin-edit-prod-mode-label">Edit Mode</span>}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {isEdit && isProductLoad && (
                <p role="status">Loading product information...</p>
              )}
              {isEdit && isProductError && (
                <p role="alert">
                  Failed to load product: {productError?.message || 'Please try again.'}
                </p>
              )}
              {isEdit && !isProductLoad && !isProductError && !product && (
                <p role="alert">
                  Product information is unavailable. Make sure your admin session is still active.
                </p>
              )}
              <fieldset
                disabled={isEdit && (isProductLoad || isProductError || !product)}
                style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
              >
              <div className="admin-edit-prod-form-group">
                <label>Product Name <span>*</span></label>
                <input 
                  type="text" 
                  className="admin-edit-prod-input" 
                  placeholder="Example: Blue Men's Shirt"
                  {...register("name", { required: true })} 
                />
              </div>

              <div className="admin-edit-prod-form-group">
                <label>Slug</label>
                <input 
                  type="text" 
                  className="admin-edit-prod-input" 
                  disabled 
                  {...register("slug")} 
                />
                <span className="admin-edit-prod-input-hint">Automatically generated from the product name for the store URL.</span>
              </div>

              <div className="admin-edit-prod-form-group">
                <label>Product Description <span>*</span></label>
                <textarea 
                  className="admin-edit-prod-textarea" 
                  placeholder="Enter a product description..."
                  {...register("description", { required: true })} 
                ></textarea>
              </div>

              <div className="admin-edit-prod-row">
                <div className="admin-edit-prod-form-group">
                  <label>Base Price (RM) <span>*</span></label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="admin-edit-prod-input" 
                    placeholder="0.00"
                    {...register("default_price", { required: true })} 
                  />
                  <span className="admin-edit-prod-input-hint">Default price for all variants.</span>
                </div>

                <div className="admin-edit-prod-form-group">
                  <label>Category <span>*</span></label>
                  <select 
                    className="admin-edit-prod-select"
                    {...register("category_id", { required: true })}
                    disabled={isCategoryLoad || isCategoryError}
                  >
                    <option value="">Select a category</option>
                    {categories?.map((cat) => 
                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                    )}
                  </select>
                  {isCategoryLoad && <span className="admin-edit-prod-input-hint">Loading categories...</span>}
                  {isCategoryError && (
                    <span className="admin-edit-prod-input-hint" role="alert">
                      Failed to load categories: {categoryError?.message || 'Please try again.'}
                    </span>
                  )}
                </div>
              </div>

              {/* Toggle Switch Box */}
              <div className="admin-edit-prod-toggle-box">
                <div className="admin-edit-prod-toggle-text">
                  <h4>Active Product</h4>
                  <p>This product is visible and available for purchase in the store. is_active = TRUE</p>
                </div>
                <label className="admin-edit-prod-toggle">
                  <input 
                    type="checkbox" 
                    {...register("is_active")} 
                  />
                  <span className="admin-edit-prod-slider"></span>
                </label>
              </div>

              {/* Form Footer */}
              <div className="admin-edit-prod-form-footer">
                <span className="admin-edit-prod-last-updated">
                  {isEdit && product?.last_updated ? `Last updated: ${product.last_updated}` : ''}
                </span>
                <div className="admin-edit-prod-actions">
                  <button 
                    type="button" 
                    className="admin-edit-prod-btn-cancel" 
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="admin-edit-prod-btn-submit"
                    disabled={isUpdatePending || (isEdit && (isProductLoad || isProductError || !product))}
                  >
                    <CheckIcon />
                    {isUpdatePending ? 'Saving...' : isEdit ? 'Save Product' : 'Add Product'}
                  </button>
                </div>
              </div>
              </fieldset>
            </form>
          </motion.div>

          {/* Right Column: Widgets */}
          <div>
            {/* Image Widget */}
            <motion.div className="admin-edit-prod-widget" variants={cardVariants}>
              <h3 className="admin-edit-prod-widget-title">Product Image</h3>
              
              <div className="admin-edit-prod-image-preview">
                <img 
                  src={watch('image_url') || product?.image_url || undefined}
                  alt="Product Preview"
                />
              </div>
              
              <span className="admin-edit-prod-image-badge">Pratonton image_url</span>

              <div className="admin-edit-prod-form-group">
                <label>URL imej <span>*</span></label>
                <input 
                  type="text" 
                  className="admin-edit-prod-input" 
                  placeholder="https://..."
                  {...register("image_url", { required: true })} 
                />
              </div>

              <div className="admin-edit-prod-widget-desc">
                <InfoIcon />
                <span>Use a publicly accessible JPG, PNG, or WebP image URL. This image appears on product cards and product detail pages.</span>
              </div>
            </motion.div>

            {/* Variants Widget (Hanya muncul dalam mod Edit) */}
            {isEdit && (
              <motion.div className="admin-edit-prod-widget" variants={cardVariants}>
                <h3 className="admin-edit-prod-widget-title">Variants & Stock</h3>
                <p className="admin-edit-prod-widget-desc" style={{ marginBottom: '16px' }}>
                  {product?.variants_count ?? product?.variant_count ?? 0} variants · {product?.total_stock ?? 0} units available. Sizes, colors, and stock are managed separately.
                </p>
                <button className="admin-edit-prod-btn-variants" onClick={() => navigate(`/admin/product/${id || product?.id}/variant`)}>
                  Manage Variants
                  <ArrowRightIcon />
                </button>
              </motion.div>
            )}
          </div>

        </div>

        {/* Footer */}
        <motion.div className="admin-edit-prod-footer" variants={cardVariants}>
          <span>Data contoh ilustratif - Bukan data langsung</span>
          <span>© 2026 ALL-BUY</span>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default ProductEditPage;