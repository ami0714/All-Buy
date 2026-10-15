import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ProductCard';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import '../../css/user/Home.css';

// Data dummy untuk produk 
const dummyProducts = [
  { id: 1, title: 'Kemeja Lelaki Putih', price: 'RM20' },
  { id: 2, title: 'Kemeja Lelaki Biru', price: 'RM20' },
  { id: 3, title: 'Kemeja Lelaki Hitam', price: 'RM20' },
  { id: 4, title: 'Kemeja Lelaki Merah', price: 'RM20' },
  { id: 5, title: 'Kemeja Lelaki Kuning', price: 'RM20' },
  { id: 6, title: 'Kemeja Lelaki Hijau', price: 'RM20' },
  { id: 7, title: 'Kemeja Lelaki Ungu', price: 'RM20' },
  { id: 8, title: 'Kemeja Lelaki Abu', price: 'RM20' },
  { id: 9, title: 'Kemeja Lelaki Kelabu', price: 'RM20' },
  { id: 10, title: 'Kemeja Lelaki Coklat', price: 'RM20' },
  { id: 11, title: 'Kemeja Lelaki Oren', price: 'RM20' },
  { id: 12, title: 'Kemeja Lelaki Perak', price: 'RM20' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const Home = () => {
  return (
    <div className="home-container">
        <Navbar />
      {/* Hero Section */}
      <div className="hero-banner">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-title">SALE</div>
          <div className="hero-subtitle">50%</div>
        </motion.div>
      </div>

      {/* Produk Terkini Section 1 */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-title">
            <h2>Produk Terkini</h2>
            <p>Semua produk ALL-BUY</p>
          </div>
          <button className="btn-view-all">Lihat Semua</button>
        </div>

        <motion.div 
          className="product-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {dummyProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Produk Terkini Section 2 (Duplicate untuk memenuhi design) */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-title">
            <h2>Produk Terkini</h2>
            <p>Semua produk ALL-BUY</p>
          </div>
          <button className="btn-view-all">Lihat Semua</button>
        </div>

        <motion.div 
          className="product-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {dummyProducts.map((product, index) => (
            <motion.div key={`dup-${product.id}-${index}`} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;