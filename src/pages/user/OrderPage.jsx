import React,{useEffect} from 'react';
import {Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import '../../css/user/OrderPage.css';
import {useGetAllOrder,useReceiveOrder} from '../../hook/useOrder';
import {useQueryClient} from '@tanstack/react-query';
import Navbar from '../../components/Navbar';

// Helper untuk format status badge
const formatStatus = (status) => {
  return String(status || 'unknown')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const OrderPage = () => {
  const queryclient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    data: orders,
    isLoading: isOrdersLoad,
    isError: isOrdersError,
    error: ordersError
  } = useGetAllOrder();
  const { mutate: receiveOrder } = useReceiveOrder();
  const paymentStatus = searchParams.get('status')?.toLowerCase();
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

  const handleReceiveOrder = (order_id) => {
    if (!order_id) {
      alert('Invalid order ID.');
      return;
    }
     receiveOrder(order_id)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    isPaymentCompleted ? (
      <Navigate to={`/payment-success?${searchParams.toString()}`} replace />
    ) : (
    <div className="order-page-container">
        <Navbar />
      <div className="order-content">
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">Order</h1>
          <p className="page-subtitle">Your orders, their status, and shipping information.</p>
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
              {ordersError?.message || 'Unable to retrieve your orders.'}
            </p>
          ) : typeof orders === 'string' ? (
            <p className="order-message order-message-error">{orders}</p>
          ) : orders?.status === false ? (
            <p className="order-message order-message-error">
              {orders.message || 'Unable to retrieve your orders.'}
            </p>
          ) : orderList.length === 0 ? (
            <p className="order-message">There are no orders to display.</p>
          ) : orderList.map((order) => {
            const status = String(order?.order_status || 'unknown').toLowerCase();
            const items = Array.isArray(order?.product_item) ? order?.product_item : [];
            const totalAmount = Number(order?.total_amount) || 0;

            return (
            <motion.div 
             onClick={()=> navigate(`/order/detail/${order?.order_id }`)}
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
                    <Icon icon="mdi:truck-fast-outline" width="16" height="16" aria-hidden="true" />
                  </div>
                  <div className="tracking-details">
                    <span className="tracking-number">
                      Tracking number: {order.tracking_number || 'Not available yet'}
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
                  <div  key={`${order?.order_id}-${item?.variant_id}-${index}`} className="order-item">
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
                    <button onClick={()=> handleReceiveOrder(order?.order_id)} className="btn-received" type="button">
                      Received
                    </button>
                  )}
                </div>
              ) : null}

            </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
    )
  );
};

export default OrderPage;