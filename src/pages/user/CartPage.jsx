import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../../css/user/CartPage.css';
import Navbar from '../../Components/Navbar';
import {useGetCart,useDeleteCart,useChangeQuantityCart} from '../../hook/useCart'


const CartPage = () => {
  const navigate = useNavigate();
 
  const {data:cart,isLoading:isCartLoad,isError:isCartError,error:cartError} = useGetCart();
  const {mutate:deleteCartItem} =useDeleteCart()
  const {mutate:changeQuantity} = useChangeQuantityCart()
  // Fungsi untuk tambah kuantiti
const ChangeQuantity = (cartId,currentQuantity,type) =>{
    const newQuantity = type == 'increase' ? currentQuantity + 1 : currentQuantity - 1;
    const payload = {
      newQuantity:newQuantity
    }

    if(payload){
      changeQuantity({cartId:cartId,payload:payload})
    }
}

  // Fungsi untuk buang item
  const handleRemove = (id) => {
    if(!id){
       alert("tak bole remove kerana tiada cart id")
    }

    if(id){
      deleteCartItem(id);
    }
  };

  // Kira jumlah harga
  const cartItems = Array.isArray(cart) ? cart : [];
  const totalAmount = cartItems.reduce((total, item) => total + (Number(item.total_price) || 0), 0);

  // Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.2 } }
  };

  return (
    <div className="cart-page-container">
        <Navbar />
      <div className="cart-content">
        
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">Cart</h1>
          <p className="page-subtitle">{cartItems.length} items ready for checkout</p>
        </motion.div>

        {/* Cart Item List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {isCartLoad ? <p>Loading cart...</p> : isCartError ? (
              <p role="alert">{cartError?.message || 'Unable to load cart.'}</p>
            ) : cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : cartItems.map((item) => (
              <motion.div 
                key={`${item.cart_id}-${item.variant_id}`} 
                className="cart-item-card"
                variants={itemVariants}
                layout
                exit="exit"
              >
                <div className="item-left">
                  <div className="item-image-wrapper">
                    <img src={item?.image_url || 'https://via.placeholder.com/120x120?text=Product'} alt={item?.product_name} className="item-image" />
                  </div>
                  <div className="item-details">
                    <span className="item-name">{item?.product_name}</span>
                    <span className="item-variant">variant:{item?.size},{item?.color}</span>
                    <span className="item-price">RM{(Number(item?.total_price) || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="item-actions">
                  <div className="quantity-selector">
                    <button className="qty-btn" onClick={() => ChangeQuantity(item?.cart_id,item?.quantity,'decrease')}>−</button>
                    <span className="qty-value">{item?.quantity}</span>
                    <button className="qty-btn" onClick={() => ChangeQuantity(item?.cart_id,item?.quantity,'increase')}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemove(item?.cart_id)}>
                    <svg className="trash-icon" viewBox="0 0 24 24">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Checkout Footer */}
        <motion.div 
          className="checkout-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="total-section">
            <span className="total-label">Total</span>
            <span className="total-amount">RM{totalAmount.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={() => navigate('/checkout')}>Checkout</button>
        </motion.div>

      </div>
    </div>
  );
};

export default CartPage;