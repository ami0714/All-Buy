import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../css/user/CheckoutPage.css';
import {useGetCourier} from '../../hook/useShipping';
import {useGetCart} from '../../hook/useCart';
import {useGetAddress} from '../../hook/useAddress';
import {useCreateOrder} from '../../hook/useCreateOrder';
import Navbar from '../../Components/Navbar';

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

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {data:shipping_courier,isLoading:isShipLoad} = useGetCourier();
  const {data:cart,isLoading:isCartLoad} = useGetCart();
  const {data:address,isLoading:isAddressLoad} = useGetAddress();
  const defaultAddress = Array.isArray(address)
    ? address.find((item) => Number(item.is_default) === 1)
    : null;

  // State untuk Kurier dan Kaedah Penghantaran
  const [selectedCourierId, setSelectedCourierId] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const {mutate:createOrder,isPending} = useCreateOrder();
  const couriers = Array.isArray(shipping_courier) ? shipping_courier : [];
  //cari courier yang sama dengan selectedCourier id dan digunakan untuk cari shipping method
  const selectedCourier = couriers.find((courier) => courier.id === selectedCourierId);
  //apabila dah jumpa maka bole amikdata shipping method tu
  const shippingMethods = selectedCourier?.shipping_methods ?? [];

  // Kiraan Harga
  const orderSubtotal = !isCartLoad && Array.isArray(cart)
    ? cart.reduce((total, item) => total + (Number(item?.total_price) || 0), 0)
    : 0;
  const selectedShippingMethod = shippingMethods?.find((method) => method.id === selectedMethod);
  const shippingFee = Number(selectedShippingMethod?.price) || 0;
  
 
  const grandTotal = orderSubtotal + shippingFee; 



  const handlePayment = () => {
  // 1. Validation — OR + return awal
  if (!selectedCourierId || !selectedMethod) {
    alert('Sila pilih courier dan shipping method');
    return;
  }

  const payload = {
    courier_id: Number(selectedCourierId),
    shipping_method_id: Number(selectedMethod),
  };

  createOrder(payload, {
    onSuccess: (data) => {
      
      const checkoutUrl = data?.checkout_url?.replace(/\/+$/, '');

      if (!checkoutUrl) {
        console.error('checkout_url tiada dalam response:', data);
        alert('Ralat: URL pembayaran tidak diterima');
        setIsLoading(false);
        return;
      }

      // 4. Redirect
      window.location.replace(checkoutUrl);
    },
    onError: (error) => {
      // 5. Handle error
      console.error('createOrder gagal:', error);
      alert('Gagal cipta order. Sila cuba lagi.');
      setIsLoading(false);
    },
  });
};

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
            
            <button
              className="checkout-btn-change"
              onClick={() => navigate(defaultAddress ? `/profile/address/edit/${defaultAddress.id}` : '/profile/address/add')}
            >
              {defaultAddress ? 'Change' : 'Add address'}
            </button>
          </div>
          
          <div className="checkout-address-content">
            <div className="checkout-address-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div className="checkout-address-details">
              {isAddressLoad ? (
                <span>Loading address...</span>
              ) : defaultAddress ? (
                <>
                  <strong>{defaultAddress.recipient_name}</strong>
                  <strong>{defaultAddress.phone}</strong>
                  <span>
                    {[
                      defaultAddress.address_line1,
                      defaultAddress.address_line2,
                      defaultAddress.city,
                      defaultAddress.state,
                      defaultAddress.postcode
                    ].filter(Boolean).join(', ')}
                  </span>
                </>
              ) : (
                <span>Tiada alamat default. Sila tambah alamat penghantaran.</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* 2. Order Summary Card */}
        <motion.div className="checkout-card" variants={cardVariants}>
          <h2 className="checkout-summary-title">Order summary</h2>
          
          <div className="checkout-item-list">
            {cart?.map((item,index) => (
              <div key={index} className="checkout-item">
                <div className="checkout-item-left">
                  <div className="checkout-item-image">
                    <img src={item?.image_url} alt={item?.product_name} />
                  </div>
                  <div className="checkout-item-details">
                    <span className="checkout-item-name">{item?.product_name}</span>
                    <span className="checkout-item-variant">{`variant:${item?.size},${item?.color}`}</span>
                  </div>
                </div>
                <div className="checkout-item-right">
                  <span>Unit price: RM{(Number(item?.unit_price) || 0).toFixed(2)}</span>
                  <span>Quantity: X{item?.quantity}</span>
                  <span className="checkout-item-subtotal">
                    Item Subtotal: RM{(Number(item?.total_price) || 0).toFixed(2)}
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
                {isShipLoad ? (
                  <span>Loading courier...</span>
                ) : couriers.length > 0 ? couriers.map((courier) => (
                  <button
                    key={courier.id}
                    type="button"
                    className={`checkout-courier-btn ${selectedCourierId === courier.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCourierId(courier.id);
                      setSelectedMethod(null);
                    }}
                  >
                    {courier.name}
                  </button>
                )) : (
                  <span>{shipping_courier?.message || 'Courier tidak tersedia.'}</span>
                )}
              </div>
            </div>

            {/* Shipping Method Selection */}
            <div className="checkout-shipping-col">
              <h3 className="checkout-shipping-label">Shipping Method</h3>
              {!selectedCourier ? (
                <span>Pilih courier untuk melihat pilihan shipping.</span>
              ) : shippingMethods.length === 0 ? (
                <span>Tiada pilihan shipping untuk courier ini.</span>
              ) : (
                <div className="checkout-method-list">
                  {shippingMethods.map((method) => (
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
                      <span className="checkout-method-price">RM {Number(method.price || 0).toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              )}
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
            
            <button
              className="checkout-btn-place-order"
              disabled={!defaultAddress || !selectedCourier || !selectedShippingMethod || isPending}
              onClick={handlePayment}
            >
              place order
            </button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default CheckoutPage;