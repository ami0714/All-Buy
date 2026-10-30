import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {useGetvariants} from '../../hook/admin/useVariant';
import {useGetProductDetail} from '../../hook/admin/useProduct';
import '../../css/admin/ProductVariantsPage.css';
import AdminSidebar from '../../components/AdminSidebar'; // Pastikan komponen ini wujud
import { getDirtyValues } from '../../utils/form';


// Ikon SVG
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const WarningIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);

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
  const onSubmit = (allData) => {
    if (editingVariant) {
      const changed = getDirtyValues(allData, dirtyFields);
      if (Object.keys(changed).length === 0) {
        alert('Tiada perubahan');
        return;
      }

      if (dirtyFields.price) {
        changed.price = parseFloat(changed.price) || dummyProduct.default_price;
        changed.is_special_price = Boolean(allData.price);
      }
      if (dirtyFields.stock) {
        changed.stock = parseInt(changed.stock, 10);
      }

      // Logik Edit
      setVariants(variants.map(v => 
        v.id === editingVariant.id 
          ? { ...v, ...changed }
          : v
      ));
      alert("Variasi berjaya dikemas kini!");
    } else {
      // Logik Tambah
      const newVariant = {
        id: variants.length + 1,
        ...allData,
        price: parseFloat(allData.price) || dummyProduct.default_price,
        stock: parseInt(allData.stock, 10),
        is_special_price: !!allData.price
      };
      setVariants([...variants, newVariant]);
      alert("Variasi baru berjaya ditambah!");
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
      <motion.div 
        className="admin-var-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header */}
        <motion.div className="admin-var-top-header" variants={cardVariants}>
          <div className="admin-var-breadcrumbs">
            Admin <span>›</span> <span>Produk</span> <span style={{ color: '#9ca3af', fontWeight: '400' }}>/admin/products/PRD-001/variants</span>
          </div>
          <div className="admin-var-header-right">
            <span className="admin-var-badge">Akses pentadbir</span>
            <span className="admin-var-date">12 Okt 2026</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-var-title-section" variants={cardVariants}>
          <div className="admin-var-title">
            <button className="admin-var-back-btn" onClick={() => navigate('/admin/product-management')}>
              <ArrowLeftIcon />
              Kembali ke Pengurusan Produk
            </button>
            <h1>Variasi Produk</h1>
            <p>Urus kombinasi saiz, warna, harga dan stok bagi setiap SKU.</p>
          </div>
          <button className="admin-var-btn-add" onClick={handleAddNew}>
            <PlusIcon />
            Tambah Variasi
          </button>
        </motion.div>

        {/* Product Summary Card */}
        {isProductLoading ? (
          <p>loading product data</p>
        ) : (
          <motion.div className="admin-var-product-card" variants={cardVariants}>
          <div className="admin-var-product-info">
            <div className="admin-var-product-image">
              <img src={product?.image_url} alt={product?.name} />
            </div>
            <div className="admin-var-product-details">
              <h2>{product?.name}</h2>
              <p className="admin-var-product-meta">
                {product?.slug} · {product?.category} · Harga asas RM{product?.default_price.toFixed(2)}
              </p>
              <span className="admin-var-product-status">
                Aktif
              </span>
            </div>
          </div>
          <div className="admin-var-product-stats">
            <div className="admin-var-stat-group">
              <span className="admin-var-stat-label">Jumlah variasi</span>
              <span className="admin-var-stat-value">{totalVariants}</span>
            </div>
            <div className="admin-var-stat-group">
              <span className="admin-var-stat-label">Jumlah stok</span>
              <span className="admin-var-stat-value">{totalStock} unit</span>
            </div>
          </div>
        </motion.div>
        )

        }

        {/* Main Grid Layout */}
        <div className="admin-var-grid">
          
          {/* Left Column: Table */}
          <motion.div className="admin-var-table-card" variants={cardVariants}>
            <div className="admin-var-table-header">
              <h3 className="admin-var-table-title">Senarai variasi</h3>
              <span className="admin-var-table-badge">
                {new Set(variants.map(v => v.size)).size} saiz · {new Set(variants.map(v => v.color)).size} warna
              </span>
            </div>
            
            <table className="admin-var-table">
              <thead>
                <tr>
                  <th>Saiz</th>
                  <th>Warna</th>
                  <th>SKU</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {isProductVLoad ? (
                    <tr><td colSpan="6">Sedang memuatkan variasi...</td></tr>
                  ) : isProductVError ? (
                    <tr><td colSpan="6" role="alert">Gagal memuatkan variasi: {productVError?.message || 'Sila cuba lagi.'}</td></tr>
                  ) : variants.length === 0 ? (
                    <tr><td colSpan="6">Tiada variasi untuk produk ini.</td></tr>
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
                        ></span>
                        {variant?.color}
                      </td>
                      <td>{variant?.sku}</td>
                      <td>
                        <div className="admin-var-price-wrapper">
                          <span>RM{Number(variant.price).toFixed(2)}</span>
                          {variant?.is_special_price && (
                            <span className="admin-var-price-special">Harga khas</span>
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
                          <button className="admin-var-action-btn" onClick={() => handleEdit(variant)}>
                            <EditIcon />
                          </button>
                          <button className="admin-var-action-btn delete">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {/* Warning Box */}
            {lowStockVariants?.length > 0 && (
              <motion.div 
                className="admin-var-warning-box"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <WarningIcon />
                <div className="admin-var-warning-content">
                  <h4>{lowStockVariants.length} variasi mempunyai stok rendah</h4>
                  <p>
                    {lowStockVariants.map((v, i) => (
                      <span key={v.id}>
                        Saiz {v.size} / {v.color} berbek {v.stock} unit. 
                        {i < lowStockVariants.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                    Semak stok apabila kuantiti di bawah 10.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column: Form (Conditional Rendering) */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div 
                className="admin-var-form-card"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="admin-var-form-header">
                  <h3 className="admin-var-form-title">
                    {editingVariant ? 'Edit variasi' : 'Tambah variasi'}
                  </h3>
                  <button className="admin-var-close-btn" onClick={handleCloseForm}>
                    <CloseIcon />
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
                      <label>Saiz <span>*</span></label>
                      <select 
                        className="admin-var-select"
                        {...register("size", { required: true })}
                      >
                        <option value="">Pilih saiz</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                    </div>

                    <div className="admin-var-form-group">
                      <label>Warna <span>*</span></label>
                      <select 
                        className="admin-var-select"
                        {...register("color", { required: true })}
                      >
                        <option value="">Pilih warna</option>
                        {[...new Set([
                          'Biru',
                          'Merah',
                          'Hitam',
                          'Putih',
                          ...(editingVariant?.color ? [editingVariant.color] : []),
                        ])].map((color) => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="admin-var-form-group">
                    <label>SKU <span>*</span></label>
                    <input 
                      type="text" 
                      className="admin-var-input" 
                      placeholder="Contoh: KLB-BLU-L"
                      {...register("sku", { required: true })} 
                    />
                    <span className="admin-var-input-hint">SKU mesti unik bagi setiap variasi.</span>
                  </div>

                  <div className="admin-var-form-group">
                    <label>Harga variasi (RM) · Pilihan</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="admin-var-input" 
                      placeholder={`Kosongkan untuk guna harga asas RM${dummyProduct.default_price.toFixed(2)}.`}
                      {...register("price")} 
                    />
                  </div>

                  <div className="admin-var-form-group">
                    <label>Kuantiti stok <span>*</span></label>
                    <input 
                      type="number" 
                      className="admin-var-input" 
                      placeholder="Contoh: 10"
                      {...register("stock", { required: true })} 
                    />
                    <span className="admin-var-input-hint">Jumlah unit tersedia untuk dibeli.</span>
                  </div>

                  <div className="admin-var-form-actions">
                    <button 
                      type="button" 
                      className="admin-var-btn-cancel" 
                      onClick={handleCloseForm}
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="admin-var-btn-submit"
                    >
                      <CheckIcon />
                      {editingVariant ? 'Simpan Variasi' : 'Tambah Variasi'}
                    </button>
                  </div>
                </form>

                <div className="admin-var-form-footer">
                  Untuk kombinasi baru, pilih Tambah Variasi di atas.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer */}
        <motion.div className="admin-var-footer" variants={cardVariants}>
          <span>Data contoh ilustratif - Bukan data langsung</span>
          <span>© 2026 ALL-BUY</span>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default ProductVariantsPage;