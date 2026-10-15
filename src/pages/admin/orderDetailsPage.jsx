import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../css/admin/OrderDetailsPage.css';
import AdminSidebar from '../../components/AdminSidebar'; 

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================
const dummyOrderDetails = {
  order_number: "AB-2026-1048",
  order_date: "10 Oct 2026, 09:42 AM MYT",
  payment_status: "Paid",
  order_status: "Shipped",
  total_amount: 164.00,
  items_count: 3,
  variants_count: 2,
  
  buyer: {
    name: "Amir Hakim",
    handle: "@amir.hakim",
    email: "amir.hakim@example.com",
    phone: "+60 12-000 0101"
  },
  
  address: {
    recipient_name: "Amir Hakim",
    address_line1: "18, Jalan Melati 3, Taman Melati",
    postcode: "53100",
    city: "Kuala Lumpur",
    state: "Wilayah Persekutuan",
    country: "Malaysia",
    phone: "+60 12-000 0101"
  },
  
  items: [
    { id: 1, product_name: "Essential Cotton T-Shirt", variant: "Size: M · Color: Black", sku: "TEE-001-M-BLK", price: 39.00, qty: 2, subtotal: 78.00 },
    { id: 2, product_name: "Relaxed Linen Shirt", variant: "Size: L · Color: Sand", sku: "SHR-004-L-SND", price: 80.00, qty: 1, subtotal: 80.00 }
  ],
  
  payment: {
    gateway: "toyyibPay",
    billcode: "a8b3c1048",
    reference_no: "TP-20261010-1048",
    confirmed_at: "10 Oct 2026, 09:45 AM MYT",
    amount_received: 164.00,
    raw_response: `{
  "status": "1",
  "gateway": "toyyibPay",
  "billcode": "a8b3c1048",
  "reference_no": "TP-20261010-1048",
  "order_number": "AB-2026-1048",
  "amount": "164.00",
  "currency": "MYR",
  "paid_at": "2026-10-10T09:45:00+08:00"
}`
  },
  
  shipment: {
    courier: "J&T",
    tracking_number: "JT630012345678",
    service: "Standard Delivery",
    price: 6.00,
    estimated_days: "2-4 business days"
  },
  
  status_history: [
    { id: 1, status: "Shipped", date: "11 Oct 2026 · 03:20 PM", author: "Nur Aina - Store Admin", note: "J&T shipment created; tracking number saved.", is_current: true },
    { id: 2, status: "Prepare Order", date: "10 Oct 2026 · 10:30 AM", author: "Nur Aina - Store Admin", note: "Items checked and packed for dispatch." },
    { id: 3, status: "Paid", date: "10 Oct 2026 · 09:45 AM", author: "System", note: "Payment confirmed for RM 164.00." },
    { id: 4, status: "Pending", date: "10 Oct 2026 · 09:42 AM", author: "System - Checkout", note: "Order placed; awaiting payment." }
  ]
};

// Ikon SVG
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
);

const AdminOrderDetailsPage = () => {
  const navigate = useNavigate();
  // Setup React Hook Form untuk Status & Shipment
  const { register, handleSubmit } = useForm({
    defaultValues: {
      orderStatus: dummyOrderDetails.order_status,
      courier: dummyOrderDetails.shipment.courier,
      trackingNumber: dummyOrderDetails.shipment.tracking_number
    }
  });

  const onSubmit = (data) => {
    console.log("Status & Shipment disimpan:", data);
    alert("Status & Shipment berjaya dikemas kini!");
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
    <div className="admin-od-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="orders" />

      {/* Main Content Area */}
      <motion.div 
        className="admin-od-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header */}
        <motion.div className="admin-od-top-header" variants={cardVariants}>
          <div className="admin-od-breadcrumbs">
            Admin <span>›</span> <span>Orders</span> <span>›</span> <span>Order details</span> <span style={{ color: '#9ca3af', fontWeight: '400' }}>/admin/orders/{dummyOrderDetails.order_number}</span>
          </div>
          <div className="admin-od-header-right">
            <span className="admin-od-badge">Admin access</span>
            <span className="admin-od-date">12 Oct 2026</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-od-title-section" variants={cardVariants}>
          <div className="admin-od-title">
            <h1>Order Details</h1>
            <p>{dummyOrderDetails.order_number} · Placed {dummyOrderDetails.order_date}</p>
          </div>
          <button className="admin-od-btn-back" onClick={() => navigate('/admin/order-management')}>
            <ArrowLeftIcon />
            Back to orders
          </button>
        </motion.div>

        {/* Summary Header Card */}
        <motion.div className="admin-od-summary-card" variants={cardVariants}>
          <div className="admin-od-summary-left">
            <h2>{dummyOrderDetails.order_number}</h2>
            <p>{dummyOrderDetails.items_count} units · {dummyOrderDetails.variants_count} purchased variants</p>
          </div>
          <div className="admin-od-summary-stats">
            <div className="admin-od-stat-group">
              <span className="admin-od-stat-label">Payment status</span>
              <span className={`admin-od-status status-${dummyOrderDetails.payment_status.toLowerCase()}`}>
                <span className="admin-od-status-dot"></span>
                {dummyOrderDetails.payment_status}
              </span>
            </div>
            <div className="admin-od-stat-group">
              <span className="admin-od-stat-label">Order status</span>
              <span className={`admin-od-status status-${dummyOrderDetails.order_status.toLowerCase()}`}>
                <span className="admin-od-status-dot"></span>
                {dummyOrderDetails.order_status}
              </span>
            </div>
            <div className="admin-od-stat-group">
              <span className="admin-od-stat-label">Total paid</span>
              <span className="admin-od-stat-value admin-od-total-paid">RM {dummyOrderDetails.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Top Grid Layout */}
        <div className="admin-od-top-grid">
          {/* Buyer Info */}
          <motion.div className="admin-od-card" variants={cardVariants}>
            <h3 className="admin-od-card-title">Buyer Information</h3>
            <div className="admin-od-info-text">
              <strong>{dummyOrderDetails.buyer.name}</strong>
              <span>{dummyOrderDetails.buyer.handle}</span>
              <span>{dummyOrderDetails.buyer.email}</span>
              <span>{dummyOrderDetails.buyer.phone}</span>
            </div>
          </motion.div>

          {/* Checkout Address */}
          <motion.div className="admin-od-card" variants={cardVariants}>
            <h3 className="admin-od-card-title">Checkout Address</h3>
            <div className="admin-od-info-text">
              <strong>{dummyOrderDetails.address.recipient_name}</strong>
              <span>{dummyOrderDetails.address.address_line1}</span>
              <span>{dummyOrderDetails.address.postcode} {dummyOrderDetails.address.city}</span>
              <span>{dummyOrderDetails.address.state}, {dummyOrderDetails.address.country}</span>
              <span>{dummyOrderDetails.address.phone}</span>
            </div>
            <p className="admin-od-note">Saved at checkout. Profile changes do not alter this address.</p>
          </motion.div>

          
         
        </div>
        {/* Status & Shipment Form */}*
          <motion.div className="admin-od-card" variants={cardVariants}>
            <h3 className="admin-od-card-title">Status & Shipment</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>Current order status: {dummyOrderDetails.order_status}</p>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="admin-od-form-group">
                <label>Order status</label>
                <select className="admin-od-select" {...register("orderStatus")}>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Prepare Order">Prepare Order</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                </select>
                <span className="admin-od-input-hint">Workflow: Pending → Paid → Prepare Order → Shipped → Completed.</span>
              </div>

              <div className="admin-od-form-group" style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Shipment information</h4>
                
                <label>Courier <span>*</span></label>
                <select className="admin-od-select" {...register("courier")}>
                  <option value="J&T">J&T</option>
                  <option value="Pos Laju">Pos Laju</option>
                  <option value="Ninja Van">Ninja Van</option>
                </select>
              </div>

              <div className="admin-od-form-group">
                <label>Tracking number <span>*</span></label>
                <input type="text" className="admin-od-input" {...register("trackingNumber")} />
                <span className="admin-od-input-hint">Illustrative tracking number · Saved 11 Oct 2026</span>
              </div>

              <div className="admin-od-shipping-details">
                <div className="admin-od-shipping-row">
                  <span>Service</span>
                  <span>{dummyOrderDetails.shipment.service}</span>
                </div>
                <div className="admin-od-shipping-row">
                  <span>Shipping price</span>
                  <span>RM {dummyOrderDetails.shipment.price.toFixed(2)}</span>
                </div>
                <div className="admin-od-shipping-row">
                  <span>Estimated delivery</span>
                  <span>{dummyOrderDetails.shipment.estimated_days}</span>
                </div>
              </div>

              <a href="#" className="admin-od-track-link">
              
                Track with {dummyOrderDetails.shipment.courier}
              </a>
              <button type="submit" className="admin-od-btn-save">
                Save status & shipment
              </button>
              <p className="admin-od-input-hint" style={{ textAlign: 'center', marginTop: '8px' }}>
                Every status update is recorded in the order status history with its time and actor.
              </p>
            </form>
          </motion.div>
        {/* Bottom Grid Layout */}
        <div className="admin-od-bottom-grid">
          {/* Left Column: Items & Payment */}
          <div className="admin-od-left-column">
            
            {/* Purchased Items */}
            <motion.div className="admin-od-card" variants={cardVariants}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="admin-od-card-title" style={{ marginBottom: 0 }}>Purchased Items</h3>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 12px', borderRadius: '20px' }}>
                  {dummyOrderDetails.items_count} units
                </span>
              </div>
              
              <table className="admin-od-table">
                <thead>
                  <tr>
                    <th>Product / purchased variant</th>
                    <th>Qty</th>
                    <th>Unit price</th>
                    <th>Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyOrderDetails.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="admin-od-product-info">
                          <span className="admin-od-product-name">{item.product_name}</span>
                          <span className="admin-od-product-variant">{item.variant}</span>
                          <span className="admin-od-product-sku">{item.sku}</span>
                        </div>
                      </td>
                      <td>{item.qty}</td>
                      <td>RM {item.price.toFixed(2)}</td>
                      <td>RM {item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                Product names, variants and prices are snapshots from checkout.
              </p>

              <div className="admin-od-totals">
                <div className="admin-od-total-row">
                  <span>Items subtotal</span>
                  <span>RM 158.00</span>
                </div>
                <div className="admin-od-total-row">
                  <span>Shipping · {dummyOrderDetails.shipment.courier} Standard Delivery</span>
                  <span>RM {dummyOrderDetails.shipment.price.toFixed(2)}</span>
                </div>
                <div className="admin-od-total-row grand-total">
                  <span>Total paid</span>
                  <span>RM {dummyOrderDetails.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Payment Information */}
            <motion.div className="admin-od-card" variants={cardVariants}>
              <h3 className="admin-od-card-title">Payment Information</h3>
              
              <div className="admin-od-payment-row">
                <span className="admin-od-payment-label">Payment gateway</span>
                <span className="admin-od-payment-value">{dummyOrderDetails.payment.gateway}</span>
              </div>
              <div className="admin-od-payment-row">
                <span className="admin-od-payment-label">Billcode</span>
                <span className="admin-od-payment-value">{dummyOrderDetails.payment.billcode}</span>
              </div>
              <div className="admin-od-payment-row">
                <span className="admin-od-payment-label">Reference number</span>
                <span className="admin-od-payment-value">{dummyOrderDetails.payment.reference_no}</span>
              </div>
              <div className="admin-od-payment-row">
                <span className="admin-od-payment-label">Confirmed at</span>
                <span className="admin-od-payment-value">{dummyOrderDetails.payment.confirmed_at}</span>
              </div>
              <div className="admin-od-payment-row">
                <span className="admin-od-payment-label">Amount received</span>
                <span className="admin-od-payment-value">RM {dummyOrderDetails.payment.amount_received.toFixed(2)}</span>
              </div>

              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Raw Response Audit</h4>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  Illustrative gateway callback - Received 10 Oct 2026, 09:45 AM MYT
                </p>
                <div className="admin-od-json-box">
                  <pre>{dummyOrderDetails.payment.raw_response}</pre>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Status History */}
          <motion.div className="admin-od-right-column">
            <div className="admin-od-card">
              <h3 className="admin-od-card-title">Order Status History</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                4 recorded changes · All times in MYT
              </p>

              <div className="admin-od-timeline">
                {dummyOrderDetails.status_history.map((history) => (
                  <div key={history.id} className="admin-od-timeline-item">
                    <div className={`admin-od-timeline-dot ${history.is_current ? 'active' : ''}`}></div>
                    <div className="admin-od-timeline-header">
                      <span className="admin-od-timeline-title">{history.status}</span>
                      <span className="admin-od-timeline-date">{history.date}</span>
                    </div>
                    <span className="admin-od-timeline-author">{history.author}</span>
                    <p className="admin-od-timeline-note">{history.note}</p>
                    {history.is_current && (
                      <span className="admin-od-timeline-current">Current</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div className="admin-od-footer" variants={cardVariants}>
          <span>Illustrative sample data only · Not live data</span>
          <span>© 2026 ALL-BUY</span>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default AdminOrderDetailsPage;