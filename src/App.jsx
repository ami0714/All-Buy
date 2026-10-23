import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthContextProvider from './context/authContext';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

import Auth from './pages/auth';
import Home from './pages/user/Home';
import ProductDetail from './pages/user/ProductDetail';
import OrderPage from './pages/user/OrderPage';
import PaymentSuccess from './pages/user/PaymentSuccess';
import CartPage from './pages/user/CartPage';
import ProfilePage from './pages/user/ProfilePage';
import AddressForm from './pages/user/AddressForm';
import CheckoutPage from './pages/user/CheckoutPage';
import OrderDetailsPage from './pages/user/OrderDetailsPage';

import DashboardPage from './pages/admin/DashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import ProductVariantsPage from './pages/admin/ProductVariantsPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import AdminOrderDetailsPage from './pages/admin/orderDetailsPage'
import ShippingManagementPage from './pages/admin/ShippingManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';

function App() {
  const queryclient = new QueryClient()
  return (
      <QueryClientProvider client={queryclient} >
    <AuthContextProvider >
    <Router>
      <Routes>
        
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/address/add" element={<AddressForm />} />
        <Route path="/profile/address/edit/:id" element={<AddressForm />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path='order/detail/:id' element={<OrderDetailsPage />} />
     


         <Route path='admin/dashboard' element={<DashboardPage />} />
         <Route path='admin/product-management' element={<ProductManagementPage />} />
         <Route path='admin/product/add' element={<ProductEditPage />} />
         <Route path='admin/product/edit/:id' element={<ProductEditPage />} />
         <Route path='admin/product/:id/variant' element={<ProductVariantsPage />} />
         <Route path='admin/category'element={<CategoryManagementPage/>} />
        <Route path='admin/order-management' element={<OrderManagementPage/>} />
        <Route path='admin/order/detail/:id' element={<AdminOrderDetailsPage />} />
        <Route path='admin/shipping-management' element={<ShippingManagementPage />} />
        <Route path='admin/user-management' element={<UserManagementPage />} />
      </Routes>
    </Router>
    </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;