import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

// Ikon SVG untuk Sidebar
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const ProductsIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg>
);
const CategoriesIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z"></path><path d="M4 9h16"></path><path d="M9 4v16"></path></svg>
);
const OrdersIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path></svg>
);
const ShippingIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);

const AdminSidebar = ({ activePage = 'dashboard' }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { id: 'products', label: 'Produk', path: '/admin/product-management', icon: <ProductsIcon /> },
    { id: 'categories', label: 'Kategori', path: '/admin/category', icon: <CategoriesIcon /> },
    { id: 'orders', label: 'Orders', path: '/admin/order-management', icon: <OrdersIcon /> },
    { id: 'shipping', label: 'Shipping', path: '/admin/shipping-management', icon: <ShippingIcon /> },
    { id: 'users', label: 'Users', path: '/admin/user-management', icon: <UsersIcon /> },
  ];

  return (
    <div className="admin-sidebar-container">
      <div>
        {/* Logo Section */}
        <div className="admin-sidebar-logo-section">
          <NavLink to="/admin/dashboard" className="admin-sidebar-logo">ALL-BUY</NavLink>
          <div className="admin-sidebar-subtitle">Panel Pentadbir</div>
        </div>

        {/* Menu Section */}
        <div className="admin-sidebar-menu-label">Ruangan Kerja</div>
        <div className="admin-sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.id} 
              to={item.path}
              className={`admin-sidebar-item ${activePage === item.id ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">NA</div>
          <div className="admin-sidebar-user-info">
            <span className="admin-sidebar-user-name">Nur Aina</span>
            <span className="admin-sidebar-user-role">Pentadbir kedai</span>
          </div>
        </div>
        <button className="admin-sidebar-logout" aria-label="Log keluar" title="Log keluar" onClick={() => navigate('/')}>
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;