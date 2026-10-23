import React,{useEffect} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../css/user/OrderPage.css';
import {useGetAllOrder} from '../../hook/useOrder';
import {useQueryClient} from '@tanstack/react-query';
import Navbar from '../../Components/Navbar';

// Helper untuk format status badge
const formatStatus = (status) => {
  return String(status || 'unknown')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const OrderPage = () => {
  const queryclient = useQueryClient();
  const [searchParams] = useSearchParams();
  const {
    data: orders,
    isLoading: isOrdersLoad,
    isError: isOrdersError,
    error: ordersError
  } = useGetAllOrder();
  const paymentStatus = searchParams.get('status')?.toLowerCase();
  const paymentReference = searchParams.get('reference');
  const isPaymentCompleted = paymentStatus === 'completed';
  const orderList = Array.isArray(orders) ? orders : [];

  useEffect(()=>{
    const invalidated = ()=>{
      queryclient.invalidateQueries({queryKey:['all-order-user']});
    }
    invalidated()
  },[]);

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
          {isOrdersLoad ? (
            <p className="order-message">Loading orders...</p>
          ) : isOrdersError ? (
            <p className="order-message order-message-error">
              {ordersError?.message || 'Gagal mendapatkan senarai pesanan.'}
            </p>
          ) : typeof orders === 'string' ? (
            <p className="order-message order-message-error">{orders}</p>
          ) : orders?.status === false ? (
            <p className="order-message order-message-error">
              {orders.message || 'Gagal mendapatkan senarai pesanan.'}
            </p>
          ) : orderList.length === 0 ? (
            <p className="order-message">Tiada pesanan untuk dipaparkan.</p>
          ) : orderList.map((order) => {
            const status = String(order?.order_status || 'unknown').toLowerCase();
            const items = Array.isArray(order?.product_item) ? order?.product_item : [];
            const totalAmount = Number(order?.total_amount) || 0;

            return (
            <motion.div 
              key={order?.order_id}
              className="order-card"
              variants={cardVariants}
            >
              {/* Card Header */}
              <div className="card-header">
                <div className="header-left">
                  <span className="order-number">{order?.order_number}</span>
                  <span className={`status-badge status-${status.replaceAll(' ', '-')}`}>
                    {formatStatus(status)}
                  </span>
                </div>
                <div className="order-total">
                  Order Total: RM{totalAmount.toFixed(2)}
                </div>
              </div>

              {status === 'shipped' && (
                <div className="tracking-box">
                  <div className="tracking-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    </svg>
                  </div>
                  <div className="tracking-details">
                    <span className="tracking-number">
                      Tracking no: {order.tracking_number || 'Belum tersedia'}
                    </span>
                    {order.shipping_status && (
                      <span className="tracking-status">{formatStatus(order.shipping_status)}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Item List */}
              <div className="item-list">
                {items?.map((item, index) => (
                  <div key={`${order?.order_id}-${item?.variant_id}-${index}`} className="order-item">
                    <div className="item-bullet"></div>
                    <div className="item-info">
                      <span className="item-name">{item?.product_name}</span>
                      <span className="item-variant">
                        {item?.variant_info} · Qty: {item?.quantity} · RM{(Number(item?.subtotal) || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {(status === 'pending' && order?.checkout_url) || status === 'shipped' ? (
                <div className="card-footer">
                  {status === 'pending' && order?.checkout_url && (
                    <a className="btn-pay" href={order.checkout_url}>
                      Pay now
                    </a>
                  )}
                  {status === 'shipped' && (
                    <button className="btn-received" type="button">
                      Received
                    </button>
                  )}
                </div>
              ) : null}

            </motion.div>
            );
          })}
        </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderPage;