import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../css/user/OrderPage.css';
import Navbar from '../../Components/Navbar';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <div className="order-page-container">
      <Navbar />
      <div className="order-content">
        <motion.section
          className="payment-success-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          aria-live="polite"
        >
          <div className="payment-success-icon" aria-hidden="true">✓</div>
          <h1 className="payment-success-title">Pembayaran Berjaya</h1>
          <p className="payment-success-message">
            Terima kasih. Pembayaran anda telah berjaya diproses.
          </p>
          {reference && (
            <p className="payment-success-reference">
              Reference: <strong>{reference}</strong>
            </p>
          )}
          <Link className="payment-success-link" to="/orders" replace>
            Lihat senarai pesanan
          </Link>
        </motion.section>
      </div>
    </div>
  );
};

export default PaymentSuccess;
