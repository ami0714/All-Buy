import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import '../../css/admin/DashboardPage.css';
import AdminSidebar from '../../components/AdminSidebar'; // Import komponen Sidebar yang dibuat tadi

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================

// Data untuk Carta Prestasi Jualan
const salesData = [
  { name: 'Isn', sales: 200 },
  { name: 'Sel', sales: 300 },
  { name: 'Rab', sales: 250 },
  { name: 'Kha', sales: 400 },
  { name: 'Jum', sales: 350 },
  { name: 'Sab', sales: 380 },
  { name: 'Ahd', sales: 420 },
];

// Data untuk Status Pesanan (Donut Chart)
const orderStatusData = [
  { name: 'Menunggu', value: 20, color: '#cbd5e1' },
  { name: 'Dibayar', value: 24, color: '#a78bfa' },
  { name: 'Dihantar', value: 38, color: '#3b82f6' },
  { name: 'Selesai', value: 158, color: '#5b3cc4' },
];

// Data untuk Jadual Pesanan Terkini
const recentOrders = [
  { id: "AB-1028", customer: "Aina Ahmad", email: "aina.ahmad@example.com", date: "12 Okt, 10:42", amount: "RM60.00", status: "Dibayar" },
  { id: "AB-1027", customer: "Muhammad Hakim", email: "hakim.m@example.com", date: "12 Okt, 10:18", amount: "RM40.00", status: "Disediakan" },
  { id: "AB-1026", customer: "Siti Nurhaliza", email: "siti.nur@example.com", date: "12 Okt, 09:56", amount: "RM22.00", status: "Menunggu" },
  { id: "AB-1025", customer: "Daniel Lim", email: "daniel.lim@example.com", date: "12 Okt, 09:32", amount: "RM80.00", status: "Dihantar" },
  { id: "AB-1024", customer: "Nur Farah", email: "farah.nur@example.com", date: "11 Okt, 17:24", amount: "RM44.00", status: "Selesai" },
  { id: "AB-1023", customer: "Amir Roslan", email: "amir.r@example.com", date: "11 Okt, 16:50", amount: "RM20.00", status: "Dibayar" },
];

const DashboardPage = () => {
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
            <span className="admin-dash-badge">Akses pentadbir</span>
            <span className="admin-dash-date">12 Okt 2026</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-dash-title-section" variants={cardVariants}>
          <div className="admin-dash-title">
            <h1>Dashboard Utama</h1>
            <p>Selamat kembali, Aina. Ini ringkasan operasi kedai anda.</p>
          </div>
          <button className="admin-dash-filter-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            1–12 Okt 2026
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="admin-dash-stats-grid" variants={cardVariants}>
          {/* Card 1 */}
          <div className="admin-dash-stat-card">
            <div className="admin-dash-stat-header">
              <span className="admin-dash-stat-label">Jumlah hasil</span>
              <div className="admin-dash-stat-icon"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/></svg></div>
            </div>
            <div className="admin-dash-stat-value">RM12,840</div>
            <div className="admin-dash-stat-sub">paid • prepare order • shipped • completed</div>
          </div>

          {/* Card 2 */}
          <div className="admin-dash-stat-card">
            <div className="admin-dash-stat-header">
              <span className="admin-dash-stat-label">Pesanan perlu tindakan</span>
              <div className="admin-dash-stat-icon"><svg viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>
            </div>
            <div className="admin-dash-stat-value">42</div>
            <div className="admin-dash-stat-sub">24 dibayar • 18 sedang disediakan</div>
            <div className="admin-dash-stat-sub" style={{ marginTop: '4px' }}><NavLink to="/admin/order-management">Sediakan pesanan untuk penghantaran</NavLink></div>
          </div>

          {/* Card 3 */}
          <div className="admin-dash-stat-card">
            <div className="admin-dash-stat-header">
              <span className="admin-dash-stat-label">Pengguna berdaftar</span>
              <div className="admin-dash-stat-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg></div>
            </div>
            <div className="admin-dash-stat-value">386</div>
            <div className="admin-dash-stat-sub">Jumlah akaun pelanggan</div>
          </div>

          {/* Card 4 */}
          <div className="admin-dash-stat-card">
            <div className="admin-dash-stat-header">
              <span className="admin-dash-stat-label">Produk aktif</span>
              <div className="admin-dash-stat-icon"><svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg></div>
            </div>
            <div className="admin-dash-stat-value">10</div>
            <div className="admin-dash-stat-sub">2 produk tidak aktif</div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <motion.div className="admin-dash-charts-grid" variants={cardVariants}>
          
          {/* Line Chart: Prestasi Jualan */}
          <div className="admin-dash-chart-card">
            <div className="admin-dash-chart-header">
              <span className="admin-dash-chart-title">Prestasi jualan</span>
              <div className="admin-dash-chart-toggle">
                <button className="admin-dash-toggle-btn active">Mingguan</button>
                <button className="admin-dash-toggle-btn">Bulanan</button>
              </div>
            </div>
            <div className="admin-dash-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
              <span className="admin-dash-chart-title">Status pesanan</span>
              <span className="admin-dash-date">Oktober</span>
            </div>
            
            <div className="admin-dash-donut-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="admin-dash-donut-center">
                <h3>240</h3>
                <p>pesanan</p>
              </div>
            </div>

            <div className="admin-dash-legend">
              {orderStatusData.map((item, index) => (
                <div key={index} className="admin-dash-legend-item">
                  <div className="admin-dash-legend-left">
                    <span className="admin-dash-legend-color" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name}</span>
                  </div>
                  <span className="admin-dash-legend-value">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="admin-dash-info-box">
              <svg viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              <span>18 lagi sedang disediakan (prepare order). Jumlah keseluruhan: 258 pesanan.</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders Table */}
        <motion.div className="admin-dash-table-card" variants={cardVariants}>
          <div className="admin-dash-table-header">
            <span className="admin-dash-table-title">Pesanan terkini</span>
            <span className="admin-dash-table-badge">6 pesanan</span>
          </div>
          
          <table className="admin-dash-table">
            <thead>
              <tr>
                <th>No. pesanan</th>
                <th>Pelanggan</th>
                <th>Tarikh</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index}>
                  <td><NavLink to={`/admin/order/detail/${encodeURIComponent(order.id)}`} className="admin-dash-order-id">{order.id}</NavLink></td>
                  <td>
                    <div className="admin-dash-customer-info">
                      <span className="admin-dash-customer-name">{order.customer}</span>
                      <span className="admin-dash-customer-email">{order.email}</span>
                    </div>
                  </td>
                  <td>{order.date}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`admin-dash-status status-${order.status.toLowerCase().replace(' ', '')}`}>
                      <span className="admin-dash-status-dot"></span>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <NavLink to={`/admin/order/detail/${encodeURIComponent(order.id)}`} className="admin-dash-action-btn" aria-label={`Lihat pesanan ${order.id}`}>
                      <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
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