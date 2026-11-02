import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {useGetvariants,useUpdateVariant,useAddVariant} from '../../hook/admin/useVariant';
import {useGetProductDetail} from '../../hook/admin/useProduct';
import '../../css/admin/ProductVariantsPage.css';
import AdminSidebar from '../../components/AdminSidebar'; // Pastikan komponen ini wujud
import { getDirtyValues } from '../../utils/form';


const ProductVariantsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
      data: product,
      isLoading: isProductLoading,
      isError: isProductError,
      error: productError,
    } = useGetProductDetail(id)
  const {
    data: products_variants = [],
    isLoading: isProductVLoad,
    isError: isProductVError,
    error: productVError,
  } = useGetvariants(id)

  const [variants, setVariants] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);//nanti letak useQuery untuk dapatkan data one untuk variant

  useEffect(() => {
    setVariants(products_variants.map((variant) => ({
      ...variant,
      price: Number(variant.price),
      stock: Number(variant.stock),
    })));
  }, [products_variants]);

  // Setup React Hook Form
  const { register, handleSubmit, reset, formState: { errors, dirtyFields } } = useForm();

  // Buka borang untuk Tambah Variasi baru
  const handleAddNew = () => {
    setEditingVariant(null);
    reset({
      size: '',
      color: '',
      sku: '',
      price: '',
      stock: ''
    });
    setIsFormOpen(true);
  };

  // Buka borang untuk Edit Variasi sedia ada
  const handleEdit = (variant) => {
    setEditingVariant(variant);
    reset({
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
      price: variant.price || '',
      stock: variant.stock
    });
    setIsFormOpen(true);
  };

  // Tutup borang
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingVariant(null);
  };

  // Simpan Variasi (Tambah atau Edit)
  const {mutate:updateVariant,isPending:isUpdatePending} = useUpdateVariant();
  const {mutate:addVariant,isPending:isAddPending} = useAddVariant();
  const onSubmit = (allData) => {
    if (editingVariant) {
      const changed = getDirtyValues(allData, dirtyFields);
      if (Object.keys(changed).length === 0) {
        alert('No changes were made.');
        return;
      }

      if (dirtyFields.price) {
        changed.price = parseFloat(changed.price) || dummyProduct.default_price;
        changed.is_special_price = Boolean(allData.price);
      }
      if (dirtyFields.stock) {
        changed.stock = parseInt(changed.stock, 10);
      }

      updateVariant({variant_id:editingVariant.id,data:changed});

      // Logik Edit
      setVariants(variants.map(v => 
        v.id === editingVariant.id 
          ? { ...v, ...changed }
          : v
      ));

    } else {
      // Logik Tambah
      addVariant({product_id:id,data:allData});

      const newVariant = {
        id: variants.length + 1,
        ...allData,
        price: parseFloat(allData.price) || dummyProduct.default_price,
        stock: parseInt(allData.stock, 10),
        is_special_price: !!allData.price
      };
      setVariants([...variants, newVariant]);
      alert("New variant added successfully!");
    }
    handleCloseForm();
  };

  // Kiraan Statistik
  const totalVariants = variants.length;
  const totalStock = variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0);
  const lowStockVariants = variants.filter((variant) => Number(variant.stock) < 10);

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
    <div className="admin-var-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="products" />

      {/* Main Content Area */}
      <motion.main
        className="admin-var-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header */}
        <motion.header className="admin-var-top-header" variants={cardVariants}>
          <nav className="admin-var-breadcrumbs" aria-label="Breadcrumb">
            <span>Admin</span>
            <span aria-hidden="true">›</span>
            <span>Products</span>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Product Variants</span>
          </nav>
          <div className="admin-var-header-right">
            <span className="admin-var-badge">Admin Access</span>
          </div>
        </motion.header>

        {/* Page Title */}
        <motion.section className="admin-var-title-section" variants={cardVariants}>
          <div className="admin-var-title">
            <button type="button" className="admin-var-back-btn" onClick={() => navigate('/admin/product-management')}>
              <Icon icon="mdi:arrow-left" aria-hidden="true" />
              Back to Product Management
            </button>
            <h1>Product Variants</h1>
            <p>Manage the size, color, price, and stock combinations for each SKU.</p>
          </div>
          <button type="button" className="admin-var-btn-add" onClick={handleAddNew}>
            <Icon icon="mdi:plus" aria-hidden="true" />
            Add Variant
          </button>
        </motion.section>

        {/* Product Summary Card */}
        {isProductLoading ? (
          <p role="status">Loading product information...</p>
        ) : (
          <motion.section className="admin-var-product-card" variants={cardVariants} aria-label="Product summary">
          <div className="admin-var-product-info">
            <div className="admin-var-product-image">
              <img src={product?.image_url} alt={product?.name} />
            </div>
            <div className="admin-var-product-details">
              <h2>{product?.name}</h2>
              <p className="admin-var-product-meta">
                {product?.slug} · {product?.category} · Base price RM{product?.default_price.toFixed(2)}
              </p>
              <span className="admin-var-product-status">
                Active
              </span>
            </div>
          </div>
          <div className="admin-var-product-stats">
            <div className="admin-var-stat-group">
              <span className="admin-var-stat-label">Total Variants</span>
              <span className="admin-var-stat-value">{totalVariants}</span>
            </div>
            <div className="admin-var-stat-group">
              <span className="admin-var-stat-label">Total Stock</span>
              <span className="admin-var-stat-value">{totalStock} units</span>
            </div>
          </div>
        </motion.section>
        )

        }

        {/* Main Grid Layout */}
        <section className="admin-var-grid" aria-label="Product variant management">
          
          {/* Left Column: Table */}
          <motion.section className="admin-var-table-card" variants={cardVariants} aria-labelledby="admin-var-table-title">
            <div className="admin-var-table-header">
              <h2 id="admin-var-table-title" className="admin-var-table-title">Variant List</h2>
              <span className="admin-var-table-badge">
                {new Set(variants.map(v => v.size)).size} sizes · {new Set(variants.map(v => v.color)).size} colors
              </span>
            </div>

            <div className="admin-var-table-scroll" role="region" aria-label="Product variant list" tabIndex="0">
            <table className="admin-var-table">
              <caption className="admin-var-sr-only">Size, color, SKU, price, stock, and actions for each product variant.</caption>
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">Color</th>
                  <th scope="col">SKU</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {isProductVLoad ? (
                    <tr><td colSpan="6">Loading variants...</td></tr>
                  ) : isProductVError ? (
                    <tr><td colSpan="6" role="alert">Failed to load variants: {productVError?.message || 'Please try again.'}</td></tr>
                  ) : variants.length === 0 ? (
                    <tr><td colSpan="6">This product has no variants.</td></tr>
                  ) : variants.map((variant) => (
                    <motion.tr 
                      key={variant.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className={editingVariant?.id === variant?.id ? 'selected' : ''}
                    >
                      <td>{variant?.size}</td>
                      <td>
                        <span
                          className={`admin-var-color-dot ${variant.color?.toLowerCase() || ''}`}
                          style={{ backgroundColor: variant.color || 'transparent' }}
                          aria-hidden="true"
                        ></span>
                        {variant?.color}
                      </td>
                      <td>{variant?.sku}</td>
                      <td>
                        <div className="admin-var-price-wrapper">
                          <span>RM{Number(variant.price).toFixed(2)}</span>
                          {variant?.is_special_price && (
                            <span className="admin-var-price-special">Special Price</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`admin-var-stock-badge ${variant?.stock < 10 ? 'low-stock' : ''}`}>
                          <span className="admin-var-stock-dot"></span>
                          {variant?.stock}
                        </span>
                      </td>
                      <td>
                        <div className="admin-var-actions">
                          <button type="button" className="admin-var-action-btn" aria-label={`Edit variant ${variant.size} ${variant.color}`} onClick={() => handleEdit(variant)}>
                            <Icon icon="mdi:pencil-outline" aria-hidden="true" />
                          </button>
                          <button type="button" className="admin-var-action-btn delete" aria-label={`Delete variant ${variant.size} ${variant.color}`}>
                            <Icon icon="mdi:trash-can-outline" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            </div>

            {/* Warning Box */}
            {lowStockVariants?.length > 0 && (
              <motion.div 
                className="admin-var-warning-box"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Icon icon="mdi:alert-outline" aria-hidden="true" />
                <div className="admin-var-warning-content">
                  <h4>{lowStockVariants.length} variants are low in stock</h4>
                  <p>
                    {lowStockVariants.map((v, i) => (
                      <span key={v.id}>
                        Size {v.size} / {v.color}: {v.stock} units in stock.
                        {i < lowStockVariants.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                    Check stock when the quantity falls below 10.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.section>

          {/* Right Column: Form (Conditional Rendering) */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.section
                className="admin-var-form-card"
                aria-labelledby="admin-var-form-title"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="admin-var-form-header">
                  <h2 id="admin-var-form-title" className="admin-var-form-title">
                    {editingVariant ? 'Edit Variant' : 'Add Variant'}
                  </h2>
                  <button type="button" className="admin-var-close-btn" aria-label="Close form" onClick={handleCloseForm}>
                    <Icon icon="mdi:close" aria-hidden="true" />
                  </button>
                </div>

                {editingVariant && (
                  <span className="admin-var-form-badge">
                    {editingVariant.size} / {editingVariant.color}
                  </span>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="admin-var-row">
                    <div className="admin-var-form-group">
                      <label htmlFor="admin-var-size">Size <span>*</span></label>
                      <input
                        id="admin-var-size"
                        type="text"
                        className="admin-var-input"
                        placeholder="Example: S, M, L, XL"
                        {...register("size", { required: true })}
                      />
                    </div>

                    <div className="admin-var-form-group">
                      <label htmlFor="admin-var-color">Color <span>*</span></label>
                      <input
                        id="admin-var-color"
                        type="text"
                        className="admin-var-input"
                        placeholder="Example: Blue"
                        {...register("color", { required: true })}
                      />
                    </div>
                  </div>

                  <div className="admin-var-form-group">
                    <label htmlFor="admin-var-sku">SKU <span>*</span></label>
                    <input 
                      id="admin-var-sku"
                      type="text" 
                      className="admin-var-input" 
                      placeholder="Example: KLB-BLU-L"
                      {...register("sku", { required: true })} 
                    />
                    <span className="admin-var-input-hint">Each variant must have a unique SKU.</span>
                  </div>

                  <div className="admin-var-form-group">
                    <label htmlFor="admin-var-price">Variant Price (RM) · Optional</label>
                    <input 
                      id="admin-var-price"
                      type="number" 
                      step="0.01"
                      className="admin-var-input" 
                      placeholder={`Leave blank to use the base price of RM${product?.default_price.toFixed(2)}.`}
                      {...register("price")} 
                    />
                  </div>

                  <div className="admin-var-form-group">
                    <label htmlFor="admin-var-stock">Stock Quantity <span>*</span></label>
                    <input 
                      id="admin-var-stock"
                      type="number" 
                      className="admin-var-input" 
                      placeholder="Example: 10"
                      {...register("stock", { required: true })} 
                    />
                    <span className="admin-var-input-hint">Total units available for purchase.</span>
                  </div>

                  <div className="admin-var-form-actions">
                    <button
                      type="button" 
                      className="admin-var-btn-cancel" 
                      onClick={handleCloseForm}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" 
                      className="admin-var-btn-submit"
                    >
                      <Icon icon="mdi:check" aria-hidden="true" />
                      {editingVariant ? 'Save Variant' : 'Add Variant'}
                    </button>
                  </div>
                </form>

                <div className="admin-var-form-footer">
                  To add a new combination, select Add Variant above.
                </div>
              </motion.section>
            )}
          </AnimatePresence>

        </section>

        {/* Footer */}
        <motion.footer className="admin-var-footer" variants={cardVariants}>
          <span>© 2026 ALL-BUY</span>
        </motion.footer>

      </motion.main>
    </div>
  );
};

export default ProductVariantsPage;