import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../css/user/OrderPage.css';
import Navbar from '../../Components/Navbar';

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================
// Menggabungkan data dari jadual `orders`, `order_items`, dan `shipments`
const dummyOrders = [
  {
    id: 1,
    order_number: "ORD-12345-6789",
    status: "completed", // Enum: 'pending','paid','prepare order','shipped','completed'
    total_amount: 60.00,
    items: [
      { id: 1, product_name_at_purchase: "Kemeja Lelaki", variant_info_at_purchase: "size:L Color:Blue" },
      { id: 2, product_name_at_purchase: "Kemeja Lelaki", variant_info_at_purchase: "size:L Color:Blue" },
      { id: 3, product_name_at_purchase: "Kemeja Lelaki", variant_info_at_purchase: "size:L Color:Blue" }
    ]
  },
  {
    id: 2,
    order_number: "ORD-98765-4321",
    status: "paid",
    total_amount: 60.00,
    items: [
      { id: 1, product_name_at_purchase: "Kemeja Lelaki", variant_info_at_purchase: "size:L Color:Blue" },
      { id: 2, product_name_at_purchase: "Kemeja Lelaki", variant_info_at_purchase: "size:L Color:Blue" },
      { id: 3, product_name_at_purchase: "Kemeja Lelaki", variant_info_at_purchase: "size:L Color:Blue" }
    ]
  },
  {
    id: 3,
    order_number: "ORD-45678-1234",
    status: "shipped",
    total_amount: 60.00,
    tracking_number: "2314214234",
    tracking_status: "Pesanan sedang dalam perjalanan",
    items: [
      { id: 1, product_name_at_purchase: "Kemeja Lelaki", variant_info_at_purchase: "size:L Color:Blue" },
      { id: 2, product_name_at_purchase: "Kemeja Lelaki", variant_info_at_purchase: "size:L Color:Blue" },
      { id: 3, product_name_at_purchase: "Kemeja Lelaki", variant_info_at_purchase: "size:L Color:Blue" }
    ]
  },
  {
    id: 4,
    order_number: "ORD-11223-4455",
    status: "prepare order",
    total_amount: 60.00,
    items: [
      { id: 1, product_name_at_purchase: "Kemeja Lelaki", variant_info_at_purchase: "size:L Color:Blue" },
      { id: 2, product_name_at_purchase: "Kemeja Lelaki", variant_info_at_purchase: "size:L Color:Blue" },
      { id: 3, product_name_at_purchase: "Kemeja Lelaki", variant_info_at_purchase: "size:L Color:Blue" }
    ]
  }
];

// Helper untuk format status badge
const formatStatus = (status) => {
  return status.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const OrderPage = () => {
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('status')?.toLowerCase();
  const paymentReference = searchParams.get('reference');
  const isPaymentCompleted = paymentStatus === 'completed';

  // Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="order-page-container">
        <Navbar />
      <div className="order-content">
        {isPaymentCompleted ? (
          <motion.section
            className="payment-success-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            aria-live="polite"
          >
            <div className="payment-success-icon" aria-hidden="true">✓</div>
            <h1 className="payment-success-title">Pembayaran Berjaya</h1>
            <p className="payment-success-message">
              Terima kasih. Pembayaran anda telah berjaya diproses.
            </p>
            {paymentReference && (
              <p className="payment-success-reference">
                Reference: <strong>{paymentReference}</strong>
              </p>
            )}
            <Link className="payment-success-link" to="/orders" replace>
              Lihat senarai pesanan
            </Link>
          </motion.section>
        ) : (
          <>
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">Order</h1>
          <p className="page-subtitle">Senarai pesanan, status dan maklumat penghantaran.</p>
        </motion.div>

        {/* Order List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {dummyOrders.map((order) => (
            <motion.div 
              key={order.id} 
              className="order-card"
              variants={cardVariants}
            >
              {/* Card Header */}
              <div className="card-header">
                <div className="header-left">
                  <span className="order-number">{order.order_number}</span>
                  <span className={`status-badge status-${order.status.replace(' ', '-')}`}>
                    {formatStatus(order.status)}
                  </span>
                </div>
                <div className="order-total">
                  Order Total: RM{order.total_amount.toFixed(0)}
                </div>
              </div>

              {/* Tracking Info (Hanya untuk status Shipped) */}
              {order.status === 'shipped' && order.tracking_number && (
                <div className="tracking-box">
                  <div className="tracking-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    </svg>
                  </div>
                  <div className="tracking-details">
                    <span className="tracking-number">Tracking no:{order.tracking_number}</span>
                    <span className="tracking-status">{order.tracking_status}</span>
                  </div>
                </div>
              )}

              {/* Item List */}
              <div className="item-list">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-bullet"></div>
                    <div className="item-info">
                      <span className="item-name">{item.product_name_at_purchase}</span>
                      <span className="item-variant">{item.variant_info_at_purchase}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer (Hanya untuk status Shipped) */}
              {order.status === 'shipped' && (
                <div className="card-footer">
                  <button className="btn-received">Order Received</button>
                </div>
              )}

            </motion.div>
          ))}
        </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderPage;