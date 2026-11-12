import React from 'react';
import { Icon } from '@iconify/react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <div className="footer-logo">ALL-BUY</div>
          <p className="footer-desc">
            Shop clothing, accessories, and everyday products at great prices. Enjoy a convenient, safe, and pleasant shopping experience.
          </p>
          <div className="footer-links">
            <a href="#">Home</a>
            <a href="#">Categories</a>
            <a href="#">Cart</a>
            <a href="#">Profile</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Info</h4>
          <ul>
            <li><a href="#">Help</a></li>
            <li><a href="#">Terms & Privacy</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Payment & Shipping</a></li>
            <li><a href="#">Returns & Exchanges</a></li>
            <li><a href="#">Order Status</a></li>
            <li><a href="#">My Account</a></li>
          </ul>
        </div>

        <div className="footer-col">
    
          <div className="social-icons">
            <a href="#" className="social-icon" aria-label="Facebook"><Icon icon="simple-icons:facebook" width="16" height="16" aria-hidden="true" /></a>
            <a href="#" className="social-icon" aria-label="Instagram"><Icon icon="simple-icons:instagram" width="16" height="16" aria-hidden="true" /></a>
            <a href="#" className="social-icon" aria-label="X"><Icon icon="simple-icons:x" width="16" height="16" aria-hidden="true" /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2026 ALL-BUY. All rights reserved.</div>
        <div className="footer-bottom-links">
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;