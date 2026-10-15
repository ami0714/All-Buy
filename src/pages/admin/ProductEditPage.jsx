import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/admin/ProductEditPage.css';
import AdminSidebar from '../../components/AdminSidebar'; // Pastikan komponen ini wujud

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================
// Menggabungkan data dari jadual `products` dan `product_variants`
const dummyProduct = {
  id: 1,
  name: "Kemeja Lelaki Biru",
  slug: "kemeja-lelaki-biru",
  description: "Kemeja lelaki berlenan panjang dengan potongan santai. Fabrik ringan dan selesa untuk pemakaian harian. Tersedia dalam saiz S, M dan L.",
  default_price: 20.00,
  category: "Kemeja",
  is_active: true,
  image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  variants_count: 6,
  total_stock: 84,
  last_updated: "11 Okt 2026"
};

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

  // 1. Tentukan mod Edit atau Tambah
  // Jika ada 'id' dalam URL, maka isEdit = true
  const isEdit = !!id;

  // 2. Setup React Hook Form
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: isEdit ? dummyProduct : {
      name: '',
      slug: '',
      description: '',
      default_price: '',
      category: '',
      is_active: true,
      image_url: ''
    }
  });

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
  const onSubmit = (data) => {
    console.log("Data dihantar:", data);
    console.log("Mod:", isEdit ? "EDIT" : "TAMBAH");
    
    // Di sini anda akan panggil API untuk simpan ke database
    // Selepas berjaya, redirect kembali ke halaman pengurusan produk
    alert(`Produk berjaya ${isEdit ? 'dikemaskini' : 'ditambah'}!`);
    navigate('/admin/product-management');
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
            Admin <span>›</span> <span>Produk</span> <span style={{ color: '#9ca3af', fontWeight: '400' }}>/admin/products/{isEdit ? `${dummyProduct.slug || 'PRD-001'}/edit` : 'add'}</span>
          </div>
          <div className="admin-edit-prod-header-right">
            <span className="admin-edit-prod-badge">Akses pentadbir</span>
            <span className="admin-edit-prod-date">12 Okt 2026</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-edit-prod-title-section" variants={cardVariants}>
          <div className="admin-edit-prod-title">
            <button className="admin-edit-prod-back-btn" onClick={handleCancel}>
              <ArrowLeftIcon />
              Kembali ke Pengurusan Produk
            </button>
            <h1>{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h1>
            <p>{isEdit ? 'Kemas kini maklumat produk. Medan bertanda * wajib diisi.' : 'Masukkan maklumat produk baru. Medan bertanda * wajib diisi.'}</p>
          </div>
          {isEdit && (
            <div className="admin-edit-prod-sku-badge">
              PRD-001
            </div>
          )}
        </motion.div>

        {/* Grid Layout */}
        <div className="admin-edit-prod-grid">
          
          {/* Left Column: Form */}
          <motion.div className="admin-edit-prod-card" variants={cardVariants}>
            <div className="admin-edit-prod-card-header">
              <h2 className="admin-edit-prod-card-title">Maklumat produk</h2>
              {isEdit && <span className="admin-edit-prod-mode-label">Mod edit</span>}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="admin-edit-prod-form-group">
                <label>Nama produk <span>*</span></label>
                <input 
                  type="text" 
                  className="admin-edit-prod-input" 
                  placeholder="Contoh: Kemeja Lelaki Biru"
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
                <span className="admin-edit-prod-input-hint">Dijana automatik daripada nama produk untuk pautan kedai.</span>
              </div>

              <div className="admin-edit-prod-form-group">
                <label>Penerangan produk <span>*</span></label>
                <textarea 
                  className="admin-edit-prod-textarea" 
                  placeholder="Masukkan penerangan produk..."
                  {...register("description", { required: true })} 
                ></textarea>
              </div>

              <div className="admin-edit-prod-row">
                <div className="admin-edit-prod-form-group">
                  <label>Harga asas (RM) <span>*</span></label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="admin-edit-prod-input" 
                    placeholder="0.00"
                    {...register("default_price", { required: true })} 
                  />
                  <span className="admin-edit-prod-input-hint">Harga lalai untuk semua variasi.</span>
                </div>

                <div className="admin-edit-prod-form-group">
                  <label>Kategori <span>*</span></label>
                  <select 
                    className="admin-edit-prod-select"
                    {...register("category", { required: true })}
                  >
                    <option value="">Pilih kategori</option>
                    <option value="Kemeja">Kemeja</option>
                    <option value="Seluar">Seluar</option>
                    <option value="Aksesori">Aksesori</option>
                  </select>
                </div>
              </div>

              {/* Toggle Switch Box */}
              <div className="admin-edit-prod-toggle-box">
                <div className="admin-edit-prod-toggle-text">
                  <h4>Produk aktif</h4>
                  <p>Produk ini dipaparkan dan boleh dibeli di kedai. is_active = TRUE</p>
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
                  {isEdit ? `Terakhir dikemas kini: ${dummyProduct.last_updated}` : ''}
                </span>
                <div className="admin-edit-prod-actions">
                  <button 
                    type="button" 
                    className="admin-edit-prod-btn-cancel" 
                    onClick={handleCancel}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="admin-edit-prod-btn-submit"
                  >
                    <CheckIcon />
                    {isEdit ? 'Simpan Produk' : 'Tambah Produk'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Right Column: Widgets */}
          <div>
            {/* Image Widget */}
            <motion.div className="admin-edit-prod-widget" variants={cardVariants}>
              <h3 className="admin-edit-prod-widget-title">Imej produk</h3>
              
              <div className="admin-edit-prod-image-preview">
                <img 
                  src={watch('image_url') || dummyProduct.image_url} 
                  alt="Pratonton Produk" 
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
                <span>Gunakan URL imej JPG, PNG atau WebP yang boleh diakses umum. Imej ini digunakan pada kad produk dan halaman butiran kedai.</span>
              </div>
            </motion.div>

            {/* Variants Widget (Hanya muncul dalam mod Edit) */}
            {isEdit && (
              <motion.div className="admin-edit-prod-widget" variants={cardVariants}>
                <h3 className="admin-edit-prod-widget-title">Variasi & stok</h3>
                <p className="admin-edit-prod-widget-desc" style={{ marginBottom: '16px' }}>
                  {dummyProduct.variants_count} variasi · {dummyProduct.total_stock} unit tersedia. Saiz, warna dan stok diurus secara berasingan.
                </p>
                <button className="admin-edit-prod-btn-variants" onClick={() => navigate(`/admin/product/${id || dummyProduct.id}/variant`)}>
                  Urus Variasi
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