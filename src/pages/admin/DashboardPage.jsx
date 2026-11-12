import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import '../../css/admin/DashboardPage.css';
import {useGetState,useGetChart,useGetStatusOrder,useGetRecentOrders} from '../../hook/admin/useDashboard'
import {useAuth} from '../../context/authContext'
import AdminSidebar from '../../components/AdminSidebar'; // Import komponen Sidebar yang dibuat tadi

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================

// Data untuk Carta Prestasi Jualan
const salesData = {
  weekly: [
    { name: 'Isn', sales: 200 },
    { name: 'Sel', sales: 300 },
    { name: 'Rab', sales: 250 },
    { name: 'Kha', sales: 400 },
    { name: 'Jum', sales: 350 },
    { name: 'Sab', sales: 380 },
    { name: 'Ahd', sales: 420 },
  ],
  monthly: [
    { name: 'Jan', sales: 2400 },
    { name: 'Feb', sales: 2100 },
    { name: 'Mac', sales: 2800 },
    { name: 'Apr', sales: 2600 },
    { name: 'Mei', sales: 3200 },
    { name: 'Jun', sales: 3000 },
    { name: 'Jul', sales: 3500 },
    { name: 'Ogo', sales: 3300 },
    { name: 'Sep', sales: 3800 },
    { name: 'Okt', sales: 3600 },
    { name: 'Nov', sales: 4100 },
    { name: 'Dis', sales: 4400 },
  ],
  yearly: [
    { name: '2021', sales: 28000 },
    { name: '2022', sales: 34000 },
    { name: '2023', sales: 39000 },
    { name: '2024', sales: 46000 },
    { name: '2025', sales: 52000 },
  ],
};

// Data untuk Status Pesanan (Donut Chart)
const orderStatusData = [
  { name: 'Menunggu', value: 20, color: '#cbd5e1' },
  { name: 'Dibayar', value: 24, color: '#a78bfa' },
  { name: 'Dihantar', value: 38, color: '#3b82f6' },
  { name: 'Selesai', value: 158, color: '#5b3cc4' },
];



const DashboardPage = () => {
  const [salesPeriod, setSalesPeriod] = useState('monthly');
  const {user,isLoading} = useAuth
  const {data:stats,isLoading:isStateLoad} = useGetState(); 
  const {data:chart,isLoading:isChartLoad} = useGetChart(salesPeriod);
  const {data:orderStatus,isLoading:isOrderStatus} = useGetStatusOrder()
  const{data:recentOrders,isLoading:isOrdersLoad}=useGetRecentOrders()
  const totalOrder = orderStatus?.reduce((acc,val) => acc + val.value,0)
  
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
    <div className="admin-dash-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="dashboard" />

      {/* Main Content Area */}
      <motion.div 
        className="admin-dash-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header (Breadcrumbs & Info) */}
        <motion.div className="admin-dash-top-header" variants={cardVariants}>
          <div className="admin-dash-breadcrumbs">
            Admin <span>›</span> <span>Dashboard</span> <span style={{ color: '#9ca3af', fontWeight: '400' }}>/admin/dashboard</span>
          </div>
          <div className="admin-dash-header-right">
            <span className="admin-dash-badge">Admin access</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-dash-title-section" variants={cardVariants}>
          <div className="admin-dash-title">
            <h1>Dashboard Utama</h1>
            <p>Welcome back, {user?.username}. Here is your store operations overview.</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="admin-dash-stats-grid" variants={cardVariants}>
          {/* Card 1 */}
          <div className="admin-dash-stat-card">
            <div className="admin-dash-stat-header">
              <span className="admin-dash-stat-label">Total Revenue</span>
              <div className="admin-dash-stat-icon"><Icon icon="mdi:cash-multiple" width="18" height="18" aria-hidden="true" /></div>
            </div>
            <div className="admin-dash-stat-value">RM{stats?.total_revenue ?? 'loading'}</div>
            <div className="admin-dash-stat-sub">paid • prepare order • shipped • completed</div>
          </div>

          {/* Card 2 */}
          <div className="admin-dash-stat-card">
            <div className="admin-dash-stat-header">
              <span className="admin-dash-stat-label">Orders Requiring Action</span>
              <div className="admin-dash-stat-icon"><Icon icon="mdi:package-variant-closed" width="18" height="18" aria-hidden="true" /></div>
            </div>
            <div className="admin-dash-stat-value">{stats?.total_orders}</div>
            <div className="admin-dash-stat-sub">{stats?.paid_orders} paid • {stats?.preparing_orders} being prepared</div>
            <div className="admin-dash-stat-sub" style={{ marginTop: '4px' }}><NavLink to="/admin/order-management">Prepare orders for shipping</NavLink></div>
          </div>

          {/* Card 3 */}
          <div className="admin-dash-stat-card">
            <div className="admin-dash-stat-header">
              <span className="admin-dash-stat-label">Registered Users</span>
              <div className="admin-dash-stat-icon"><Icon icon="mdi:account-group-outline" width="18" height="18" aria-hidden="true" /></div>
            </div>
            <div className="admin-dash-stat-value">{stats?.registered_users}</div>
            <div className="admin-dash-stat-sub">Total customer accounts</div>
          </div>

          {/* Card 4 */}
          <div className="admin-dash-stat-card">
            <div className="admin-dash-stat-header">
              <span className="admin-dash-stat-label">Active Products</span>
              <div className="admin-dash-stat-icon"><Icon icon="mdi:tshirt-crew-outline" width="18" height="18" aria-hidden="true" /></div>
            </div>
            <div className="admin-dash-stat-value">{stats?.active_products}</div>
            <div className="admin-dash-stat-sub">{stats?.inactive_products} inactive products</div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <motion.div className="admin-dash-charts-grid" variants={cardVariants}>
          
          {/* Line Chart: Prestasi Jualan */}
          <div className="admin-dash-chart-card">
            <div className="admin-dash-chart-header">
              <span className="admin-dash-chart-title">Prestasi jualan</span>
              <div className="admin-dash-chart-toggle">
                <button
                  className={`admin-dash-toggle-btn${salesPeriod === 'weekly' ? ' active' : ''}`}
                  type="button"
                  aria-pressed={salesPeriod === 'weekly'}
                  onClick={() => setSalesPeriod('weekly')}
                >
                  Mingguan
                </button>
                <button
                  className={`admin-dash-toggle-btn${salesPeriod === 'monthly' ? ' active' : ''}`}
                  type="button"
                  aria-pressed={salesPeriod === 'monthly'}
                  onClick={() => setSalesPeriod('monthly')}
                >
                  Bulanan
                </button>
                <button
                  className={`admin-dash-toggle-btn${salesPeriod === 'yearly' ? ' active' : ''}`}
                  type="button"
                  aria-pressed={salesPeriod === 'yearly'}
                  onClick={() => setSalesPeriod('yearly')}
                >
                  Tahunan
                </button>
              </div>
            </div>
            <div className="admin-dash-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `RM${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`RM${value}`, 'Sales']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#5b3cc4" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#5b3cc4', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart: Status Pesanan */}
          <div className="admin-dash-chart-card">
            <div className="admin-dash-chart-header">
              <span className="admin-dash-chart-title">Order Status</span>
            </div>
            
            <div className="admin-dash-donut-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    //bulatan donat
                    {orderStatus?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="admin-dash-donut-center">
                <h3>{totalOrder}</h3>
                <p>orders</p>
              </div>
            </div>

            <div className="admin-dash-legend">
              {orderStatus?.map((item, index) => (
                <div key={index} className="admin-dash-legend-item">
                  <div className="admin-dash-legend-left">
                    <span className="admin-dash-legend-color" style={{ backgroundColor: item?.color }}></span>
                    <span>{item?.status}</span>
                  </div>
                  <span className="admin-dash-legend-value">{item?.value}</span>
                </div>
              ))}
            </div>

            <div className="admin-dash-info-box">
              <Icon icon="mdi:package-variant-closed" width="18" height="18" aria-hidden="true" />
              <span>18 more orders are being prepared. Total orders: 258.</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders Table */}
        <motion.div className="admin-dash-table-card" variants={cardVariants}>
          <div className="admin-dash-table-header">
            <span className="admin-dash-table-title">Recent Orders</span>
            <span className="admin-dash-table-badge">{recentOrders?.length} orders</span>
          </div>
          
          <table className="admin-dash-table">
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Pelanggan</th>
                <th>Tarikh</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order, index) => (
                <tr key={index}>
                  <td><NavLink to={`/admin/order/detail/${encodeURIComponent(order?.order_number)}`} className="admin-dash-order-id">{order?.order_number}</NavLink></td>
                  <td>
                    <div className="admin-dash-customer-info">
                      <span className="admin-dash-customer-name">{order?.username}</span>
                      <span className="admin-dash-customer-email">{order?.email}</span>
                    </div>
                  </td>
                  <td>{order?.order_date}</td>
                  <td>{order?.total_amount}</td>
                  <td>
                    <span className={`admin-dash-status status-${order?.status.toLowerCase().replace(' ', '')}`}>
                      <span className="admin-dash-status-dot"></span>
                      {order?.status}
                    </span>
                  </td>
                  <td>
                    <NavLink to={`/admin/order/detail/${encodeURIComponent(order?.order_number)}`} className="admin-dash-action-btn" aria-label={`View order ${order?.order_number}`}>
                      <Icon icon="mdi:chevron-right" width="18" height="18" aria-hidden="true" />
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Footer */}
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '20px' }}>
          © 2026 ALL-BUY
        </div>

      </motion.div>
    </div>
  );
};

export default DashboardPage;