import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';
  
  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-top">
        <NavLink to="/home" className="navbar-logo" aria-label="ALL-BUY, laman utama">ALL-BUY</NavLink>
        <div className="navbar-actions">
          <NavLink to="/orders" className="icon-btn" title="Pesanan" aria-label="Pesanan">
            <svg className="icon-svg" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          </NavLink>
          <NavLink to="/cart" className="icon-btn" title="Troli" aria-label="Troli">
            <svg className="icon-svg" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </NavLink>
          <NavLink to="/profile" className="user-btn">User</NavLink>
          <NavLink to="/profile" className="icon-btn" title="Profil" aria-label="Profil">
            <svg className="icon-svg" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </NavLink>
        </div>
      </div>
      <div className="navbar-bottom">
        {isHomePage && (
          <button className="category-btn">
          Category
          <svg className="icon-svg" style={{ width: '12px' }} viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
        </button>
        )}
      {isHomePage && (
           <div className="search-bar">
          <input type="text" placeholder="Cari produk, brand, atau promo..." />
          <svg className="icon-svg" style={{ color: '#6b7280' }} viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>

       )
       }
      </div>
    </motion.nav>
  );
};

export default Navbar;