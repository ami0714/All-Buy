import React from 'react';
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
          <h4>Newsletter</h4>
          <p className="footer-desc" style={{ marginBottom: '16px' }}>
            Get the latest promotions, product updates, and shopping tips.
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" />
            <button type="submit">Subscribe</button>
          </form>
          <div className="social-icons">
            <a href="#" className="social-icon">f</a>
            <a href="#" className="social-icon">i</a>
            <a href="#" className="social-icon">x</a>
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