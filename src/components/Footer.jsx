import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <div className="footer-logo">ALL-BUY</div>
          <p className="footer-desc">
            Beli pakaian, aksesori, dan produk harian dengan harga terbaik. Dibuat untuk pengalaman belanja yang mudah, selamat, dan menyenangkan.
          </p>
          <div className="footer-links">
            <a href="#">Laman Utama</a>
            <a href="#">Kategori</a>
            <a href="#">Keranjang</a>
            <a href="#">Profil</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Info</h4>
          <ul>
            <li><a href="#">Bantuan</a></li>
            <li><a href="#">Syarat & Privasi</a></li>
            <li><a href="#">Hubungi Kami</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Sokongan</h4>
          <ul>
            <li><a href="#">Bayaran & Penghantaran</a></li>
            <li><a href="#">Pulangan & Pertukaran</a></li>
            <li><a href="#">Status Pesanan</a></li>
            <li><a href="#">Akaun Saya</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Berita</h4>
          <p className="footer-desc" style={{ marginBottom: '16px' }}>
            Dapatkan promo, kemas kini produk, dan tips belanja terbaru.
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Masukkan alamat e-mel" />
            <button type="submit">Daftar</button>
          </form>
          <div className="social-icons">
            <a href="#" className="social-icon">f</a>
            <a href="#" className="social-icon">i</a>
            <a href="#" className="social-icon">x</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2026 ALL-BUY. Hak cipta terpelihara.</div>
        <div className="footer-bottom-links">
          <a href="#">Syarat Penggunaan</a>
          <a href="#">Dasar Privasi</a>
          <a href="#">Peta Laman</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;