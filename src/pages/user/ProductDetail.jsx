import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {useGetDetailProduct} from '../../hook/useProducts';
import {useToCart} from '../../hook/useCart'
import '../../css/user/ProductDetail.css';
import Navbar from '../../Components/Navbar';


const ProductDetail = () => {
  const { slug } = useParams();
  const {data:products,isLoading:isProductLoad} = useGetDetailProduct(slug);
  const {mutate:addTocart ,isPending} = useToCart()
  const navigate = useNavigate();

  const { handleSubmit, setValue, watch } = useForm({
    defaultValues: { size: "", color: "", quantity: 1 }
  });
  const selectedSize = watch("size");
  const selectedColor = watch("color");
  const quantity = watch("quantity");
  const selectedVariant = products?.variants?.find(
    (variant) => variant.size === selectedSize && variant.color === selectedColor
  );
  const stock = Number(selectedVariant?.stock);

  const changeQuantity = (amount) => {
    const nextQuantity = Number(quantity) + amount;
    if (nextQuantity < 1 || (selectedVariant && nextQuantity > stock)) return;
    setValue("quantity", nextQuantity, { shouldDirty: true });
  };



  // Fungsi untuk handle Add to Cart
 const handleAddToCart = (formData) => {
    // Cari variasi yang sepadan dengan pilihan saiz dan warna pengguna
    const variant = products?.variants?.find(
      (item) => item.size === formData.size && item.color === formData.color
    );

    if (!variant || (Number.isFinite(Number(variant.stock)) && formData.quantity > Number(variant.stock))) {
      alert("Maaf, kombinasi saiz dan warna ini tiada stok.");
      return;
    }

    // Data yang siap dihantar ke API Cart
    const payload = {
      variant_id: variant.id,
      quantity: Number(formData.quantity),
    };

    

     if(payload){
      addTocart(payload,{
        onSuccess:(res)=>{
          alert(res)
          navigate('/cart')
        },
        onError:(res)=>{
          alert(res)
        }
      })
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
            src={products?.image_url || "https://via.placeholder.com/300x400?text=Product+Image"} 
            alt={products?.name} 
            className="product-detail__image" 
          />
        </div>

        {/* KANAN: Maklumat Produk */}
        <form  className="product-detail__info" onSubmit={handleSubmit(handleAddToCart)}>
          <h1 className="product-detail__title">{products?.name}</h1>
          <div className="product-detail__price">RM{products?.default_price}</div>
          <p className="product-detail__description">{products?.description}</p>

          <div className="product-detail__divider"></div>

          {/* Pilihan Saiz */}
          {/* Pilihan Saiz (Unik sahaja) */}
  <div className="product-detail__option-group">
    <span className="product-detail__option-label">Size:</span>
    <div className="product-detail__option-buttons">
      {/* Gunakan Set untuk ambil saiz yang unik */}
      {[...new Set(products?.variants?.map(item => item.size))].map((sizeValue, index) => (
        <button
          type="button"
          key={index}
          className={`product-detail__option-button ${selectedSize === sizeValue ? 'is-selected' : ''}`}
          onClick={() => setValue("size", sizeValue)}
        >
          {sizeValue}
        </button>
      ))}
    </div>
  </div>

  {/* Pilihan Warna (Unik sahaja) */}
  <div className="product-detail__option-group">
    <span className="product-detail__option-label">Color:</span>
    <div className="product-detail__option-buttons">
      {/* Gunakan Set untuk ambil warna yang unik */}
      {[...new Set(products?.variants?.map(item => item.color))].map((colorValue, index) => (
        <button
          type="button"
          key={index}
          className={`product-detail__option-button ${selectedColor === colorValue ? 'is-selected' : ''}`}
          onClick={() => setValue("color", colorValue)}
        >
          {colorValue}
        </button>
      ))}
    </div>
  </div>

  <div className="product-detail__quantity-group">
    <span className="product-detail__option-label">Quantity:</span>
    <div className="product-detail__quantity-control">
      <button
        type="button"
        aria-label="Kurangkan kuantiti"
        onClick={() => changeQuantity(-1)}
        disabled={quantity <= 1}
      >
        −
      </button>
      <output aria-live="polite">{quantity}</output>
      <button
        type="button"
        aria-label="Tambah kuantiti"
        onClick={() => changeQuantity(1)}
        disabled={Boolean(selectedVariant) && quantity >= stock}
      >
        +
      </button>
    </div>
  </div>

          {/* Butang Add to Cart */}
          <button className="product-detail__add-to-cart" type="submit">
            <svg className="product-detail__cart-icon" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="9" cy="20" r="1" fill="currentColor"/>
              <circle cx="17" cy="20" r="1" fill="currentColor"/>
            </svg>
            Add To Cart
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductDetail;