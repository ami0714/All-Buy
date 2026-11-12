import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import './Navbar.css';
import {useAuth} from '../context/authContext'

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/home';
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  
  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-top">
        <NavLink to="/home" className="navbar-logo" aria-label="ALL-BUY, home">ALL-BUY</NavLink>
        <div className="navbar-actions">
          <NavLink to="/orders" className="icon-btn" title="Orders" aria-label="Orders">
            <Icon className="icon-svg" icon="mdi:package-variant-closed" width="18" height="18" aria-hidden="true" />
          </NavLink>
          <NavLink to="/cart" className="icon-btn" title="Cart" aria-label="Cart">
            <Icon className="icon-svg" icon="mdi:cart-outline" width="18" height="18" aria-hidden="true" />
          </NavLink>
          <NavLink to="/profile" className="user-btn">{isLoading ? 'user' : user?.username}</NavLink>
          <NavLink to="/profile" className="icon-btn" title="Profile" aria-label="Profile">
            <Icon className="icon-svg" icon="mdi:account-circle-outline" width="18" height="18" aria-hidden="true" />
          </NavLink>
          <button className="icon-btn navbar-logout" type="button" title="Log out" aria-label="Log out" onClick={handleLogout}>
            <Icon className="icon-svg" icon="mdi:logout" width="18" height="18" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="navbar-bottom">
        {isHomePage && (
          <button className="category-btn">
          Category
          <Icon className="icon-svg" icon="mdi:chevron-down" width="12" height="12" aria-hidden="true" />
        </button>
        )}
      {isHomePage && (
           <div className="search-bar">
          <input type="text" placeholder="Search products, brands, or promotions..." />
          <Icon className="icon-svg" icon="mdi:magnify" width="18" height="18" aria-hidden="true" />
        </div>

       )
       }
      </div>
    </motion.nav>
  );
};

export default Navbar;