import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import '../../css/user/OrderDetailsPage.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useParams } from 'react-router-dom';
import { useGetUserOrder } from '../../hook/useOrder';

const orderTrackingStages = [
  { status: 'pending', label: 'Order placed', icon: 'mdi:clipboard-check-outline' },
  { status: 'paid', label: 'Payment confirmed', icon: 'mdi:credit-card-check-outline' },
  { status: 'prepare order', label: 'Preparing order', icon: 'mdi:package-variant-closed-check' },
  { status: 'shipped', label: 'On the way', icon: 'mdi:truck-fast-outline' },
  { status: 'completed', label: 'Delivered', icon: 'mdi:check-circle-outline' },
];

const normalizeOrderStatus = (status) => String(status ?? '')
  .trim()
  .toLowerCase()
  .replace(/[_-]+/g, ' ')
  .replace(/\s+/g, ' ');


const OrderDetailsPage = () => {
  const { id } = useParams();
  const { data: orderDetails, isLoading, isError } = useGetUserOrder(id);
  const orderHistory = Array.isArray(orderDetails?.order_history_status)
    ? orderDetails.order_history_status
    : [];
  const currentStatus = normalizeOrderStatus(orderDetails?.order_status);
  const currentStageIndex = orderTrackingStages.findIndex((stage) => stage.status === currentStatus);

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
            <h1>Order Details</h1>
            <p>Review the order, shipping address, items, and payment summary.</p>
          </div>
          <button className="order-details-copy-btn">
            <svg viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            Copy order number
          </button>
        </motion.div>

        {isLoading && (
          <p className="order-details-loading" role="status" aria-live="polite">
            Loading order details...
          </p>
        )}
        {isError && (
          <p className="order-details-error" role="alert">
            Unable to load order details. Please try again.
          </p>
        )}

        {/* Delivery Address Card */}
        <motion.div className="order-details-address-card" variants={cardVariants}>
          <div className="order-details-address-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div className="order-details-address-info">
            <h2>Delivery Address</h2>
            <p><strong>{orderDetails?.address_snapshot?.recipient_name}</strong></p>
            <p>{orderDetails?.address_snapshot?.address_line1}, {orderDetails?.address_snapshot?.city}, {orderDetails?.address_snapshot?.postcode} {orderDetails?.address_snapshot?.state}</p>
            <p><strong>{orderDetails?.address_snapshot?.phone}</strong></p>
          </div>
        </motion.div>

        {/* Order Tracking */}
        {!isLoading && !isError && (
          <motion.section className="order-tracking-card" variants={cardVariants} aria-label="Order tracking">
            <div className="order-tracking-heading">
              <div>
                <h2>Order tracking</h2>
                <p>Follow your order from placement to delivery.</p>
              </div>
              {orderDetails?.order_status && (
                <span className="order-tracking-current-status">{orderDetails.order_status}</span>
              )}
            </div>
            <ol className="order-tracking-steps">
              {orderTrackingStages.map((stage, index) => {
                const historyEntry = orderHistory.find(
                  (entry) => normalizeOrderStatus(entry?.status) === stage.status
                );
                const isCurrent = currentStageIndex === index;
                const isComplete = currentStageIndex >= 0 && index < currentStageIndex;

                return (
                  <li
                    key={stage.status}
                    className={`order-tracking-step${isComplete ? ' is-complete' : ''}${isCurrent ? ' is-current' : ''}`}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    <div className="order-tracking-step-marker">
                      <Icon icon={stage.icon} aria-hidden="true" />
                    </div>
                    <div className="order-tracking-step-content">
                      <h3>{stage.label}</h3>
                      <p className="order-tracking-step-date">
                        {historyEntry?.changed_at || (isCurrent ? 'Current status' : 'Not reached')}
                      </p>
                      {historyEntry?.note && <p className="order-tracking-step-note">{historyEntry.note}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </motion.section>
        )}

        {/* Main Layout Grid */}
        <div className="order-details-main-layout">
          
          {/* Left Column: Order Items */}
          <div className="order-details-items-column">
            {orderDetails?.product_item?.map((item,index) => (
              <motion.div key={index} className="order-details-item-card" variants={cardVariants}>
                <div className="order-details-item-image">
                  <img src={item?.image_url} alt={item?.product_name} />
                </div>
                <div className="order-details-item-info">
                  <div className="order-details-item-title">
                    <span className="order-details-item-name">{item?.product_name}</span>
                    <span className="order-details-item-variant">{item?.variant_info}</span>
                  </div>
                  <div className="order-details-item-stats">
                    <div className="order-details-stat-group">
                      <span className="order-details-stat-label">Unit price</span>
                      <span className="order-details-stat-value">RM{item?.unit_price?.toFixed(0)}</span>
                    </div>
                    <div className="order-details-stat-group">
                      <span className="order-details-stat-label">Quantity</span>
                      <span className="order-details-stat-value">X{item?.quantity}</span>
                    </div>
                    <div className="order-details-stat-group">
                      <span className="order-details-stat-label">Item Subtotal</span>
                      <span className="order-details-stat-value">RM{item?.subtotal?.toFixed(0)}</span>
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
              <span className="order-details-order-id">{orderDetails?.order_number}</span>
            </div>
            
            <div className="order-details-summary-row">
              <span className="order-details-summary-label">Courier</span>
              <span className="order-details-summary-value">{orderDetails?.courier_name == null ? "": orderDetails?.courier_name }</span>
            </div>

            <div className="order-details-summary-row">
              <span className="order-details-summary-label">Tracking no</span>
              <div className="order-details-tracking-wrapper">
                <span className="order-details-summary-value">{orderDetails?.tracking_number == "" ? "" : orderDetails?.tracking_number}</span>
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
              <span className="order-details-summary-value">RM{orderDetails?.shipping_fee}</span>
            </div>

            <div className="order-details-total-row grand-total">
              <span className="order-details-summary-label" style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Order Total</span>
              <span className="order-details-summary-value">RM{orderDetails?.total_amount}</span>
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