import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../../css/admin/OrderManagementPage.css';
import AdminSidebar from '../../components/AdminSidebar'; // Pastikan komponen ini wujud

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================
// Menggabungkan data dari jadual `orders` dan `users`
const initialOrders = [
  { id: "AB-2026-1052", buyerName: "Daniel Tan", buyerHandle: "@daniel.tan", date: "12 Oct 2026", time: "10:18 AM", amount: 86.00, status: "Pending" },
  { id: "AB-2026-1051", buyerName: "Siti Farah", buyerHandle: "@siti.farah", date: "12 Oct 2026", time: "09:56 AM", amount: 124.00, status: "Paid" },
  { id: "AB-2026-1050", buyerName: "Arjun Nair", buyerHandle: "@arjun.nair", date: "11 Oct 2026", time: "04:32 PM", amount: 96.00, status: "Prepare Order" },
  { id: "AB-2026-1049", buyerName: "Mei Ling Wong", buyerHandle: "@meiling.wong", date: "11 Oct 2026", time: "11:07 AM", amount: 45.00, status: "Pending" },
  { id: "AB-2026-1048", buyerName: "Amir Hakim", buyerHandle: "@amir.hakim", date: "10 Oct 2026", time: "09:42 AM", amount: 164.00, status: "Shipped", highlighted: true },
  { id: "AB-2026-1047", buyerName: "Aisha Rahman", buyerHandle: "@aisha.rahman", date: "10 Oct 2026", time: "09:15 AM", amount: 75.00, status: "Paid" },
  { id: "AB-2026-1046", buyerName: "Jason Lim", buyerHandle: "@jason.lim", date: "09 Oct 2026", time: "03:26 PM", amount: 142.00, status: "Prepare Order" },
  { id: "AB-2026-1045", buyerName: "Priya Devi", buyerHandle: "@priya.devi", date: "09 Oct 2026", time: "10:51 AM", amount: 118.00, status: "Shipped" },
  { id: "AB-2026-1044", buyerName: "Nur Izzah", buyerHandle: "@nur.izzah", date: "08 Oct 2026", time: "02:10 PM", amount: 84.00, status: "Completed" },
  { id: "AB-2026-1043", buyerName: "Hafiz Azman", buyerHandle: "@hafiz.azman", date: "08 Oct 2026", time: "08:44 AM", amount: 206.00, status: "Completed" },
   { id: "AB-2026-1052", buyerName: "Daniel Tan", buyerHandle: "@daniel.tan", date: "12 Oct 2026", time: "10:18 AM", amount: 86.00, status: "Pending" },
  { id: "AB-2026-1051", buyerName: "Siti Farah", buyerHandle: "@siti.farah", date: "12 Oct 2026", time: "09:56 AM", amount: 124.00, status: "Paid" },
  { id: "AB-2026-1050", buyerName: "Arjun Nair", buyerHandle: "@arjun.nair", date: "11 Oct 2026", time: "04:32 PM", amount: 96.00, status: "Prepare Order" },
  { id: "AB-2026-1049", buyerName: "Mei Ling Wong", buyerHandle: "@meiling.wong", date: "11 Oct 2026", time: "11:07 AM", amount: 45.00, status: "Pending" },
  { id: "AB-2026-1048", buyerName: "Amir Hakim", buyerHandle: "@amir.hakim", date: "10 Oct 2026", time: "09:42 AM", amount: 164.00, status: "Shipped", highlighted: true },
  { id: "AB-2026-1047", buyerName: "Aisha Rahman", buyerHandle: "@aisha.rahman", date: "10 Oct 2026", time: "09:15 AM", amount: 75.00, status: "Paid" },
  { id: "AB-2026-1046", buyerName: "Jason Lim", buyerHandle: "@jason.lim", date: "09 Oct 2026", time: "03:26 PM", amount: 142.00, status: "Prepare Order" },
  { id: "AB-2026-1045", buyerName: "Priya Devi", buyerHandle: "@priya.devi", date: "09 Oct 2026", time: "10:51 AM", amount: 118.00, status: "Shipped" },
  { id: "AB-2026-1044", buyerName: "Nur Izzah", buyerHandle: "@nur.izzah", date: "08 Oct 2026", time: "02:10 PM", amount: 84.00, status: "Completed" },
  { id: "AB-2026-1043", buyerName: "Hafiz Azman", buyerHandle: "@hafiz.azman", date: "08 Oct 2026", time: "08:44 AM", amount: 206.00, status: "Completed" },
  
];

// Ikon SVG
const InboxIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"></path></svg>
);
const BoxIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);
const TruckIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
);
const ExportIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

const OrderManagementPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 10;

  // Logik Penapisan (Filtering)
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'All' ? true : order.status === activeTab;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Kiraan Statistik
  const totalOrders = orders.length;
  const readyForFulfillment = orders.filter(o => o.status === 'Paid' || o.status === 'Prepare Order').length;
  const onTheWay = orders.filter(o => o.status === 'Shipped').length;

  // Logik Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemPerPage);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const firstVisibleItem = filteredOrders.length === 0 ? 0 : indexOfFirstItem + 1;
  const lastVisibleItem = Math.min(indexOfLastItem, filteredOrders.length);

  // Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  // Fungsi pembantu untuk kelas status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Paid': return 'status-paid';
      case 'Prepare Order': return 'status-prepare';
      case 'Shipped': return 'status-shipped';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  };

  return (
    <div className="admin-order-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="orders" />

      {/* Main Content Area */}
      <motion.div 
        className="admin-order-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header */}
        <motion.div className="admin-order-top-header" variants={cardVariants}>
          <div className="admin-order-breadcrumbs">
            Admin <span>›</span> <span>Orders</span> <span style={{ color: '#9ca3af', fontWeight: '400' }}>/admin/orders</span>
          </div>
          <div className="admin-order-header-right">
            <span className="admin-order-badge">Admin access</span>
            <span className="admin-order-date">12 Oct 2026</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-order-title-section" variants={cardVariants}>
          <div className="admin-order-title">
            <h1>Order Management</h1>
            <p>Review purchases, confirm payments and manage every step of fulfillment.</p>
          </div>
          <button className="admin-order-btn-export">
            <ExportIcon />
            Export orders
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="admin-order-stats-grid" variants={cardVariants}>
          <div className="admin-order-stat-card">
            <div className="admin-order-stat-header">
              <span className="admin-order-stat-label">Total orders</span>
              <div className="admin-order-stat-icon"><InboxIcon /></div>
            </div>
            <div className="admin-order-stat-value">{totalOrders}</div>
            <div className="admin-order-stat-sub">8–12 Oct 2026 · All statuses</div>
          </div>
          <div className="admin-order-stat-card">
            <div className="admin-order-stat-header">
              <span className="admin-order-stat-label">Ready for fulfillment</span>
              <div className="admin-order-stat-icon"><BoxIcon /></div>
            </div>
            <div className="admin-order-stat-value">{readyForFulfillment}</div>
            <div className="admin-order-stat-sub">2 paid · 2 preparing</div>
          </div>
          <div className="admin-order-stat-card">
            <div className="admin-order-stat-header">
              <span className="admin-order-stat-label">On the way</span>
              <div className="admin-order-stat-icon"><TruckIcon /></div>
            </div>
            <div className="admin-order-stat-value">{onTheWay}</div>
            <div className="admin-order-stat-sub">Shipped and awaiting delivery</div>
          </div>
        </motion.div>

        {/* Main Table Card */}
        <motion.div className="admin-order-table-card" variants={cardVariants}>
          
          <div className="admin-order-table-header">
            <h3 className="admin-order-table-title">Order List</h3>
            <span className="admin-order-table-badge">{totalOrders} orders</span>
          </div>

          {/* Tabs */}
          <div className="admin-order-tabs">
            {['All', 'Pending', 'Paid', 'Prepare Order', 'Shipped', 'Completed'].map((tab) => {
              const count = tab === 'All' ? totalOrders : orders.filter(o => o.status === tab).length;
              return (
                <div 
                  key={tab}
                  className={`admin-order-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                >
                  {tab} {count}
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="admin-order-filters">
            <div className="admin-order-search-wrapper">
              <SearchIcon />
              <input 
                type="text" 
                className="admin-order-search-input" 
                placeholder="Search order number or buyer name..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button className="admin-order-filter-btn">
              <CalendarIcon />
              8–12 Oct 2026
            </button>
            <button className="admin-order-filter-btn" onClick={() => { setSearchTerm(''); setActiveTab('All'); setCurrentPage(1); }}>
              Reset filters
            </button>
          </div>

          {/* Table */}
          <table className="admin-order-table">
            <thead>
              <tr>
                <th>Order number</th>
                <th>Buyer</th>
                <th>Order date</th>
                <th>Total amount</th>
                <th>Order status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentItems.length > 0 ? (
                  currentItems.map((order) => (
                    <motion.tr 
                      key={order.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className={order.highlighted ? 'highlighted' : ''}
                    >
                      <td>
                        <NavLink to={`/admin/order/detail/${encodeURIComponent(order.id)}`} className="admin-order-id">
                          {order.id}
                          {order.highlighted && <span>Sample order details →</span>}
                        </NavLink>
                      </td>
                      <td>
                        <div className="admin-order-buyer">
                          <span className="admin-order-buyer-name">{order.buyerName}</span>
                          <span className="admin-order-buyer-handle">{order.buyerHandle}</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-order-date">
                          {order.date}
                          <span>{order.time}</span>
                        </div>
                      </td>
                      <td>
                        <span className="admin-order-amount">RM {order.amount.toFixed(2)}</span>
                      </td>
                      <td>
                        <span className={`admin-order-status ${getStatusClass(order.status)}`}>
                          <span className="admin-order-status-dot"></span>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button className="admin-order-action-btn" onClick={() => navigate(`/admin/order/detail/${encodeURIComponent(order.id)}`)}>View details</button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      Tiada pesanan dijumpai.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Table Footer */}
          <div className="admin-order-table-footer">
            <span className="admin-order-table-info">
              Showing {firstVisibleItem}–{lastVisibleItem} of {filteredOrders.length} orders · Amounts include shipping · Times in MYT
            </span>
            <div className="admin-order-pagination">
              <button
                className="admin-order-page-btn"
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                <ChevronLeftIcon />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  className={`admin-order-page-number ${currentPage === page ? 'active' : ''}`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="admin-order-page-btn"
                aria-label="Next page"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="admin-order-info-box">
            <InfoIcon />
            Select View details to see payment records, purchased variants, shipment information and status history.
          </div>

        </motion.div>

        {/* Footer */}
        <motion.div className="admin-order-footer" variants={cardVariants}>
          <span>© 2026 ALL-BUY</span>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default OrderManagementPage;