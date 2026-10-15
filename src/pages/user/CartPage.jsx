import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../../css/user/CartPage.css';
import Navbar from '../../Components/Navbar';

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================
// Menggabungkan data dari jadual `cart_items`, `product_variants`, dan `products`
const initialCartItems = [
  {
    id: 1,
    variant_id: 101,
    product_name: "Kemeja Lelaki",
    size: "L",
    color: "Blue",
    price: 20.00,
    quantity: 1,
    image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    variant_id: 102,
    product_name: "Kemeja Lelaki",
    size: "L",
    color: "Blue",
    price: 20.00,
    quantity: 1,
    image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    variant_id: 103,
    product_name: "Kemeja Lelaki",
    size: "L",
    color: "Blue",
    price: 20.00,
    quantity: 1,
    image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Fungsi untuk tambah kuantiti
  const handleIncrease = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // Fungsi untuk kurangkan kuantiti (minima 1)
  const handleDecrease = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // Fungsi untuk buang item
  const handleRemove = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Kira jumlah harga
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.2 } }
  };

  return (
    <div className="cart-page-container">
        <Navbar />
      <div className="cart-content">
        
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">Cart</h1>
          <p className="page-subtitle">{cartItems.length} items ready for checkout</p>
        </motion.div>

        {/* Cart Item List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div 
                key={item.id} 
                className="cart-item-card"
                variants={itemVariants}
                layout
                exit="exit"
              >
                <div className="item-left">
                  <div className="item-image-wrapper">
                    <img src={item.image_url} alt={item.product_name} className="item-image" />
                  </div>
                  <div className="item-details">
                    <span className="item-name">{item.product_name}</span>
                    <span className="item-variant">variant: size:{item.size} Color:{item.color}</span>
                    <span className="item-price">RM{item.price.toFixed(0)}</span>
                  </div>
                </div>

                <div className="item-actions">
                  <div className="quantity-selector">
                    <button className="qty-btn" onClick={() => handleDecrease(item.id)}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => handleIncrease(item.id)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                    <svg className="trash-icon" viewBox="0 0 24 24">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Checkout Footer */}
        <motion.div 
          className="checkout-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="total-section">
            <span className="total-label">Total</span>
            <span className="total-amount">RM{totalAmount.toFixed(0)}</span>
          </div>
          <button className="checkout-btn" onClick={() => navigate('/checkout')}>Checkout</button>
        </motion.div>

      </div>
    </div>
  );
};

export default CartPage;