import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import {useGetOrders,useGetOrderState} from '../../hook/admin/useOrder'
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

const InboxIcon = () => <Icon icon="mdi:inbox-outline" width="18" height="18" aria-hidden="true" />;
const BoxIcon = () => <Icon icon="mdi:cube-outline" width="18" height="18" aria-hidden="true" />;
const TruckIcon = () => <Icon icon="mdi:truck-fast-outline" width="18" height="18" aria-hidden="true" />;
const ExportIcon = () => <Icon icon="mdi:download-outline" width="18" height="18" aria-hidden="true" />;
const SearchIcon = () => <Icon icon="mdi:magnify" width="18" height="18" aria-hidden="true" />;
const CalendarIcon = () => <Icon icon="mdi:calendar-outline" width="18" height="18" aria-hidden="true" />;
const ChevronLeftIcon = () => <Icon icon="mdi:chevron-left" width="18" height="18" aria-hidden="true" />;
const ChevronRightIcon = () => <Icon icon="mdi:chevron-right" width="18" height="18" aria-hidden="true" />;
const InfoIcon = () => <Icon icon="mdi:information-outline" width="18" height="18" aria-hidden="true" />;

const OrderManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const { data: ordersData, isLoading, isError } = useGetOrders(activeTab);
  const { data: orderStateData,isLoading:isStateLoad } = useGetOrderState();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 10;

  // Logik Penapisan (Filtering)
  const filteredOrders = ordersData?.filter(order => {
    const matchesSearch =
      String(order?.id)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order?.username)?.toLowerCase().includes(searchTerm.toLowerCase());
    return  matchesSearch;
  });

  

  // Logik Pagination
  const totalPages = Math.ceil(filteredOrders?.length / itemPerPage);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = filteredOrders?.slice(indexOfFirstItem, indexOfLastItem);
  const firstVisibleItem = filteredOrders?.length === 0 ? 0 : indexOfFirstItem + 1;
  const lastVisibleItem = Math.min(indexOfLastItem, filteredOrders?.length);

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
            <div className="admin-order-stat-value">{orderStateData?.total_orders}</div>
            <div className="admin-order-stat-sub">8–12 Oct 2026 · All statuses</div>
          </div>
          <div className="admin-order-stat-card">
            <div className="admin-order-stat-header">
              <span className="admin-order-stat-label">Ready for fulfillment</span>
              <div className="admin-order-stat-icon"><BoxIcon /></div>
            </div>
            <div className="admin-order-stat-value">{isStateLoad ? 'Loading...' : orderStateData?.paid_orders + orderStateData?.prepare_order}</div>
            <div className="admin-order-stat-sub">{orderStateData?.paid_orders} paid · {orderStateData?.prepare_order} preparing</div>
          </div>
          <div className="admin-order-stat-card">
            <div className="admin-order-stat-header">
              <span className="admin-order-stat-label">On the way</span>
              <div className="admin-order-stat-icon"><TruckIcon /></div>
            </div>
            <div className="admin-order-stat-value">{orderStateData?.shipped_orders}</div>
            <div className="admin-order-stat-sub">Shipped and awaiting delivery</div>
          </div>
        </motion.div>

        {/* Main Table Card */}
        <motion.div className="admin-order-table-card" variants={cardVariants}>
          
          <div className="admin-order-table-header">
            <h3 className="admin-order-table-title">Order List</h3>
            <span className="admin-order-table-badge">{orderStateData?.total_orders} orders</span>
          </div>

          {/* Tabs */}
          <div className="admin-order-tabs">
            {['All', 'Pending', 'Paid', 'Prepare Order', 'Shipped', 'Completed'].map((tab) => {
              return (
                <div 
                  key={tab}
                  className={`admin-order-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                >
                  {tab}
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
                {currentItems?.length > 0 ? (
                  currentItems?.map((order) => (
                    <motion.tr 
                      key={order?.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      
                    >
                      <td>
                        <NavLink to={`/admin/order/detail/${encodeURIComponent(order?.id)}`} className="admin-order-id">
                          {order.order_number}
                        
                        </NavLink>
                      </td>
                      <td>
                        <div className="admin-order-buyer">
                          <span className="admin-order-buyer-name">{order?.username}</span>
                          <span className="admin-order-buyer-handle">{order?.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-order-date">
                          {order?.order_date}
                          
                        </div>
                      </td>
                      <td>
                        <span className="admin-order-amount">RM {order?.total_amount}</span>
                      </td>
                      <td>
                        <span className={`admin-order-status ${getStatusClass(order?.status)}`}>
                          <span className="admin-order-status-dot"></span>
                          {order?.status}
                        </span>
                      </td>
                      <td>
                        <button className="admin-order-action-btn" onClick={() => navigate(`/admin/order/detail/${encodeURIComponent(order?.id)}`)}>View details</button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      No orders found.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Table Footer */}
          <div className="admin-order-table-footer">
            <span className="admin-order-table-info">
              Showing {firstVisibleItem}–{lastVisibleItem} of {filteredOrders?.length} orders · Amounts include shipping · Times in MYT
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