import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../css/user/ProductDetail.css';
import Navbar from '../../Components/Navbar';

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================
// Menggabungkan data dari jadual `products` dan `product_variants`
const dummyProductData = {
  id: 1,
  name: "Kemeja Lelaki",
  slug: "kemeja-lelaki",
  description: "description:fdvyahgfuyewagfusdgfcixbcuesdgfvcujxbcuesgfvc udsbcyevgysbc",
  default_price: 20.00,
  image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Gambar placeholder kemeja
  variants: [
    { id: 101, size: "L", color: "Blue", stock: 10 },
    { id: 102, size: "XS", color: "Blue", stock: 5 },
    { id: 103, size: "S", color: "Blue", stock: 8 },
    { id: 104, size: "XL", color: "Blue", stock: 2 },
    { id: 105, size: "L", color: "red", stock: 4 },
  ]
};

const ProductDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const productName = location.state?.product?.title
    || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // State untuk pilihan pengguna
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("Blue");

  // Dapatkan senarai unik untuk Size dan Color dari variants
  const availableSizes = [...new Set(dummyProductData.variants.map(v => v.size))];
  const availableColors = [...new Set(dummyProductData.variants.map(v => v.color))];

  // Fungsi untuk handle Add to Cart
  const handleAddToCart = () => {
    const selectedVariant = dummyProductData.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );

    if (selectedVariant) {
      console.log("Menambah ke troli:", {
        product_id: dummyProductData.id,
        variant_id: selectedVariant.id,
        name: productName,
        size: selectedSize,
        color: selectedColor,
        price: dummyProductData.default_price,
        quantity: 1
      });
      navigate('/cart');
    } else {
      alert("Maaf, kombinasi saiz dan warna ini tiada stok.");
    }
  };

  // Animasi Framer Motion
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="product-detail__page">
        <Navbar isHome={false} />
      <motion.div 
        className="product-detail__card"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* KIRI: Gambar Produk */}
        <div className="product-detail__image-wrapper">
          <img 
            src={dummyProductData.image_url} 
            alt={dummyProductData.name} 
            className="product-detail__image" 
          />
        </div>

        {/* KANAN: Maklumat Produk */}
        <div className="product-detail__info">
          <h1 className="product-detail__title">{productName}</h1>
          <div className="product-detail__price">RM{dummyProductData.default_price}</div>
          <p className="product-detail__description">{dummyProductData.description}</p>

          <div className="product-detail__divider"></div>

          {/* Pilihan Saiz */}
          <div className="product-detail__option-group">
            <span className="product-detail__option-label">Size:</span>
            <div className="product-detail__option-buttons">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`product-detail__option-button ${selectedSize === size ? 'is-selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Pilihan Warna */}
          <div className="product-detail__option-group">
            <span className="product-detail__option-label">Color:</span>
            <div className="product-detail__option-buttons">
              {availableColors.map((color) => (
                <button
                  key={color}
                  className={`product-detail__option-button ${selectedColor === color ? 'is-selected' : ''}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Butang Add to Cart */}
          <button className="product-detail__add-to-cart" onClick={handleAddToCart}>
            <svg className="product-detail__cart-icon" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="9" cy="20" r="1" fill="currentColor"/>
              <circle cx="17" cy="20" r="1" fill="currentColor"/>
            </svg>
            Add To Cart
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;