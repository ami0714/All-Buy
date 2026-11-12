import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './AdminSidebar.css';
import { useAuth } from "../context/authContext";

const AdminSidebar = ({ activePage = 'dashboard' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: 'mdi:view-dashboard-outline' },
    { id: 'products', label: 'Products', path: '/admin/product-management', icon: 'mdi:tshirt-crew-outline' },
    { id: 'categories', label: 'Categories', path: '/admin/category', icon: 'mdi:shape-outline' },
    { id: 'orders', label: 'Orders', path: '/admin/order-management', icon: 'mdi:clipboard-list-outline' },
    { id: 'shipping', label: 'Shipping', path: '/admin/shipping-management', icon: 'mdi:truck-fast-outline' },
    { id: 'users', label: 'Users', path: '/admin/user-management', icon: 'mdi:account-group-outline' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="admin-sidebar-container">
      <div>
        {/* Logo Section */}
        <div className="admin-sidebar-logo-section">
          <NavLink to="/admin/dashboard" className="admin-sidebar-logo">ALL-BUY</NavLink>
          <div className="admin-sidebar-subtitle">Admin Panel</div>
        </div>

        {/* Menu Section */}
        <div className="admin-sidebar-menu-label">Workspace</div>
        <div className="admin-sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.id} 
              to={item.path}
              className={`admin-sidebar-item ${activePage === item.id ? 'active' : ''}`}
            >
              <Icon icon={item.icon} width="20" height="20" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">{user?.username?.split('')[0]}</div>
          <div className="admin-sidebar-user-info">
            <span className="admin-sidebar-user-name">{user?.username}</span>
            <span className="admin-sidebar-user-role">{user?.role}</span>
          </div>
        </div>
        <button className="admin-sidebar-logout" aria-label="Log out" title="Log out" onClick={handleLogout}>
          <Icon icon="mdi:logout" width="20" height="20" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;