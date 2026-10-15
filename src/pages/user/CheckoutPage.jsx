import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import '../../css/user/CheckoutPage.css';
import Navbar from '../../Components/Navbar';

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================

// 1. Alamat Penghantaran (Jadual `addresses`)
const dummyAddress = {
  recipient_name: "recipient name",
  phone: "012345654",
  address_line1: "D-1-1 Rumah pangsa, 43200 BATU 9 CHERAS SELANGOR",
  city: "Ulu Langat",
  state: "Selangor",
  postcode: "43200"
};

// 2. Item Pesanan (Gabungan `order_items` dan `products`)
const dummyOrderItems = [
  {
    id: 1,
    product_name_at_purchase: "Kemeja Lelaki",
    variant_info_at_purchase: "variant: size:L Color :Blue",
    price: 20.00,
    quantity: 2,
    subtotal: 40.00,
    image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    product_name_at_purchase: "Kemeja Lelaki",
    variant_info_at_purchase: "variant: size:L Color :Blue",
    price: 20.00,
    quantity: 2,
    subtotal: 40.00,
    image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 3,
    product_name_at_purchase: "Kemeja Lelaki",
    variant_info_at_purchase: "variant: size:L Color :Blue",
    price: 20.00,
    quantity: 2,
    subtotal: 40.00,
    image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  }
];

// 3. Kurier (Jadual `couriers`)
const dummyCouriers = [
  { id: 1, name: "J&T" },
  { id: 2, name: "Pos laju" },
  { id: 3, name: "Ninja Van" }
];

// 4. Kaedah Penghantaran (Jadual `shipping_methods`)
const dummyShippingMethods = [
  { id: 1, service_name: "Standard Delivery", price: 8.00 },
  { id: 2, service_name: "Next Day Delivery", price: 18.00 },
  { id: 3, service_name: "Same Day Delivery", price: 28.00 }
];

const CheckoutPage = () => {
  const navigate = useNavigate();

  const { register } = useForm({
    defaultValues: dummyAddress
  });

  // State untuk Kurier dan Kaedah Penghantaran
  const [selectedCourier, setSelectedCourier] = useState(dummyCouriers[0].id);
  const [selectedMethod, setSelectedMethod] = useState(dummyShippingMethods[0].id);

  // Kiraan Harga
  const orderSubtotal = dummyOrderItems.reduce((total, item) => total + item.subtotal, 0);
  const selectedShippingMethod = dummyShippingMethods.find(m => m.id === selectedMethod);
  const shippingFee = selectedShippingMethod ? selectedShippingMethod.price : 0;
  
  // Nota: Dalam design, Grand Total adalah RM60 walaupun Subtotal RM120 + Shipping RM8.
  // Ini mungkin kerana terdapat diskaun atau hanya placeholder dalam design. 
  // Saya akan mengira secara logik: Subtotal + Shipping Fee.
  // Jika anda mahu ia tepat RM60 seperti design, anda boleh hardcode nilainya.
  const grandTotal = orderSubtotal + shippingFee; 

  // Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="checkout-page-container">
      <Navbar />
      <motion.div 
        className="checkout-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="checkout-page-title" variants={cardVariants}>
          Checkout
        </motion.h1>

        {/* 1. Delivery Address Card */}
        <motion.div className="checkout-card" variants={cardVariants}>
          <div className="checkout-address-header">
            <div>
              <h2 className="checkout-address-title">Delivery Address</h2>
            </div>
            <button className="checkout-btn-change" onClick={() => navigate('/profile/address/edit/1')}>Change</button>
          </div>
          
          <div className="checkout-address-content">
            <div className="checkout-address-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            {/* Menggunakan useForm register untuk paparan (boleh dijadikan input jika perlu) */}
            <div className="checkout-address-details">
              <strong {...register("recipient_name")}>{dummyAddress.recipient_name}</strong>
              <strong {...register("phone")}>{dummyAddress.phone}</strong>
              <span>
                {dummyAddress.address_line1}, {dummyAddress.city}, {dummyAddress.postcode} {dummyAddress.state}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 2. Order Summary Card */}
        <motion.div className="checkout-card" variants={cardVariants}>
          <h2 className="checkout-summary-title">Order summary</h2>
          
          <div className="checkout-item-list">
            {dummyOrderItems.map((item) => (
              <div key={item.id} className="checkout-item">
                <div className="checkout-item-left">
                  <div className="checkout-item-image">
                    <img src={item.image_url} alt={item.product_name_at_purchase} />
                  </div>
                  <div className="checkout-item-details">
                    <span className="checkout-item-name">{item.product_name_at_purchase}</span>
                    <span className="checkout-item-variant">{item.variant_info_at_purchase}</span>
                  </div>
                </div>
                <div className="checkout-item-right">
                  <span>Unit price: RM{item.price.toFixed(2)}</span>
                  <span>Quantity: X{item.quantity}</span>
                  <span className="checkout-item-subtotal">
                    Item Subtotal: RM{item.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3. Courier & Shipping Method Card */}
        <motion.div className="checkout-card" variants={cardVariants}>
          <div className="checkout-shipping-layout">
            
            {/* Courier Selection */}
            <div className="checkout-shipping-col">
              <h3 className="checkout-shipping-label">Courier</h3>
              <div className="checkout-courier-list">
                {dummyCouriers.map((courier) => (
                  <button
                    key={courier.id}
                    className={`checkout-courier-btn ${selectedCourier === courier.id ? 'active' : ''}`}
                    onClick={() => setSelectedCourier(courier.id)}
                  >
                    {courier.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Shipping Method Selection */}
            <div className="checkout-shipping-col">
              <h3 className="checkout-shipping-label">Shipping Method</h3>
              <div className="checkout-method-list">
                {dummyShippingMethods.map((method) => (
                  <label 
                    key={method.id} 
                    className={`checkout-method-label ${selectedMethod === method.id ? 'active' : ''}`}
                  >
                    <div className="checkout-method-left">
                      <input
                        type="radio"
                        name="shippingMethod"
                        className="checkout-radio-input"
                        checked={selectedMethod === method.id}
                        onChange={() => setSelectedMethod(method.id)}
                      />
                      <span>{method.service_name}</span>
                    </div>
                    <span className="checkout-method-price">RM {method.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

        {/* 4. Grand Total & Place Order Card */}
        <motion.div className="checkout-card" variants={cardVariants}>
          <div className="checkout-total-layout">
            <div className="checkout-total-details">
              <div className="checkout-total-row">
                <span>Order Subtotal:</span>
                <span>RM{orderSubtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-total-row">
                <span>Shipping Fee:</span>
                <span>RM{shippingFee.toFixed(2)}</span>
              </div>
              <div className="checkout-grand-total">
                Grand total: RM{grandTotal.toFixed(2)}
              </div>
            </div>
            
            <button className="checkout-btn-place-order" onClick={() => navigate('/orders')}>
              place order
            </button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default CheckoutPage;