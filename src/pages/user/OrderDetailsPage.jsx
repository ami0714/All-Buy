import React from 'react';
import { motion } from 'framer-motion';
import '../../css/user/OrderDetailsPage.css';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================
// Menggabungkan data dari jadual `orders`, `order_items`, `addresses`, `couriers`, dan `shipments`
const dummyOrderDetails = {
  order_number: "ORD-12345-6789",
  total_amount: 68.00,
  shipping_fee: 8.00,
  courier_name: "Pos Laju",
  tracking_number: "2314214234",
  address: {
    recipient_name: "recipient name",
    phone: "012345654",
    address_line1: "D-1-1 Rumah pangsa, 43200 BATU 9 CHERAS SELANGOR",
    city: "Ulu Langat",
    state: "Selangor",
    postcode: "43200"
  },
  items: [
    {
      id: 1,
      product_name_at_purchase: "Kemeja Lelaki",
      variant_info_at_purchase: "variant: size:L Color :Blue",
      price: 20.00,
      quantity: 2,
      subtotal: 40.00,
      image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      product_name_at_purchase: "Kemeja Lelaki",
      variant_info_at_purchase: "variant: size:L Color :Blue",
      price: 20.00,
      quantity: 2,
      subtotal: 40.00,
      image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      product_name_at_purchase: "Kemeja Lelaki",
      variant_info_at_purchase: "variant: size:L Color :Blue",
      price: 20.00,
      quantity: 2,
      subtotal: 40.00,
      image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ]
};

const OrderDetailsPage = () => {
  // Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="order-details-page-container">
        <Navbar />
      <motion.div 
        className="order-details-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div className="order-details-header" variants={cardVariants}>
          <div className="order-details-header-left">
            <h1>Butiran Pesanan</h1>
            <p>Semak maklumat pesanan, alamat penghantaran, item dan ringkasan pembayaran.</p>
          </div>
          <button className="order-details-copy-btn">
            <svg viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            Salin nombor pesanan
          </button>
        </motion.div>

        {/* Delivery Address Card */}
        <motion.div className="order-details-address-card" variants={cardVariants}>
          <div className="order-details-address-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div className="order-details-address-info">
            <h2>Delivery Address</h2>
            <p><strong>{dummyOrderDetails.address.recipient_name}</strong></p>
            <p>{dummyOrderDetails.address.address_line1}, {dummyOrderDetails.address.city}, {dummyOrderDetails.address.postcode} {dummyOrderDetails.address.state}</p>
            <p><strong>{dummyOrderDetails.address.phone}</strong></p>
          </div>
        </motion.div>

        {/* Main Layout Grid */}
        <div className="order-details-main-layout">
          
          {/* Left Column: Order Items */}
          <div className="order-details-items-column">
            {dummyOrderDetails.items.map((item) => (
              <motion.div key={item.id} className="order-details-item-card" variants={cardVariants}>
                <div className="order-details-item-image">
                  <img src={item.image_url} alt={item.product_name_at_purchase} />
                </div>
                <div className="order-details-item-info">
                  <div className="order-details-item-title">
                    <span className="order-details-item-name">{item.product_name_at_purchase}</span>
                    <span className="order-details-item-variant">{item.variant_info_at_purchase}</span>
                  </div>
                  <div className="order-details-item-stats">
                    <div className="order-details-stat-group">
                      <span className="order-details-stat-label">Unit price</span>
                      <span className="order-details-stat-value">RM{item.price.toFixed(0)}</span>
                    </div>
                    <div className="order-details-stat-group">
                      <span className="order-details-stat-label">Quantity</span>
                      <span className="order-details-stat-value">X{item.quantity}</span>
                    </div>
                    <div className="order-details-stat-group">
                      <span className="order-details-stat-label">Item Subtotal</span>
                      <span className="order-details-stat-value">RM{item.subtotal.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <motion.div className="order-details-summary-card" variants={cardVariants}>
            <div className="order-details-summary-row">
              <span className="order-details-summary-label">Order ID</span>
              <span className="order-details-order-id">{dummyOrderDetails.order_number}</span>
            </div>
            
            <div className="order-details-summary-row">
              <span className="order-details-summary-label">Courier</span>
              <span className="order-details-summary-value">{dummyOrderDetails.courier_name}</span>
            </div>

            <div className="order-details-summary-row">
              <span className="order-details-summary-label">Tracking no</span>
              <div className="order-details-tracking-wrapper">
                <span className="order-details-summary-value">{dummyOrderDetails.tracking_number}</span>
                <span className="order-details-tracking-link">
                  <svg viewBox="0 0 24 24">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                  </svg>
                </span>
              </div>
            </div>

            <div className="order-details-divider"></div>

            <div className="order-details-total-row shipping-fee">
              <span className="order-details-summary-label">Shipping Fee</span>
              <span className="order-details-summary-value">RM{dummyOrderDetails.shipping_fee.toFixed(2)}</span>
            </div>

            <div className="order-details-total-row grand-total">
              <span className="order-details-summary-label" style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Order Total</span>
              <span className="order-details-summary-value">RM{dummyOrderDetails.total_amount.toFixed(0)}</span>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div className="order-details-footer" variants={cardVariants}>
          © 2026 ALL-BUY
        </motion.div>

      </motion.div>
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;