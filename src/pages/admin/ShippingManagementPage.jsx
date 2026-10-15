import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import '../../css/admin/ShippingManagementPage.css';
import AdminSidebar from '../../components/AdminSidebar'; // Pastikan komponen ini wujud

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================
const initialCouriers = [
  { id: 1, name: "J&T", code: "JNT", tracking_url_template: "https://www.jtexpress.my/tracking?billcode={tracking_number}", is_active: true },
  { id: 2, name: "PosLaju", code: "POSLAJU", tracking_url_template: "https://tracking.pos.com.my/tracking/{tracking_number}", is_active: true },
  { id: 3, name: "NinjaVan", code: "NINJAVAN", tracking_url_template: "https://www.ninjavan.co/en-my/tracking?id={tracking_number}", is_active: false },
];

const initialServices = [
  { id: 1, courier_id: 1, courier_name: "J&T", courier_code: "JNT", service_name: "Standard Delivery", price: 6.00, estimated_days: "2–4 days", is_active: true },
  { id: 2, courier_id: 1, courier_name: "J&T", courier_code: "JNT", service_name: "Express", price: 12.00, estimated_days: "1–2 days", is_active: true },
  { id: 3, courier_id: 2, courier_name: "PosLaju", courier_code: "POSLAJU", service_name: "Standard Delivery", price: 7.00, estimated_days: "2–5 days", is_active: true },
  { id: 4, courier_id: 2, courier_name: "PosLaju", courier_code: "POSLAJU", service_name: "Express", price: 14.00, estimated_days: "1–2 days", is_active: true },
  { id: 5, courier_id: 3, courier_name: "NinjaVan", courier_code: "NINJAVAN", service_name: "Standard Delivery", price: 5.50, estimated_days: "3–5 days", is_active: false },
];

// Ikon SVG
const TruckIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
);
const BoxIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);
const TagIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

const ShippingManagementPage = () => {
  const [couriers, setCouriers] = useState(initialCouriers);
  const [services, setServices] = useState(initialServices);
  
  // State untuk kawalan borang
  const [isCourierFormOpen, setIsCourierFormOpen] = useState(false);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);

  // Setup React Hook Form untuk Courier
  const { register: registerCourier, handleSubmit: handleSubmitCourier, reset: resetCourier, formState: { errors: errorsCourier } } = useForm();

  // Setup React Hook Form untuk Service
  const { register: registerService, handleSubmit: handleSubmitService, reset: resetService, formState: { errors: errorsService } } = useForm();

  // Fungsi Tambah Courier
  const onSubmitCourier = (data) => {
    const newCourier = {
      id: couriers.length + 1,
      name: data.name,
      code: data.code,
      tracking_url_template: data.tracking_url_template,
      is_active: data.is_active
    };
    setCouriers([...couriers, newCourier]);
    setIsCourierFormOpen(false);
    resetCourier();
    alert("Kurier berjaya ditambah!");
  };

  // Fungsi Tambah Service
  const onSubmitService = (data) => {
    const selectedCourier = couriers.find(c => c.id === parseInt(data.courier_id));
    const newService = {
      id: services.length + 1,
      courier_id: parseInt(data.courier_id),
      courier_name: selectedCourier ? selectedCourier.name : "Unknown",
      courier_code: selectedCourier ? selectedCourier.code : "UNK",
      service_name: data.service_name,
      price: parseFloat(data.price),
      estimated_days: data.estimated_days,
      is_active: true
    };
    setServices([...services, newService]);
    setIsServiceFormOpen(false);
    resetService();
    alert("Servis penghantaran berjaya ditambah!");
  };

  // Fungsi Toggle Active State
  const handleToggleCourier = (id) => {
    setCouriers(couriers.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
  };

  // Kiraan Statistik
  const totalCouriers = couriers.length;
  const activeCouriers = couriers.filter(c => c.is_active).length;
  const inactiveCouriers = totalCouriers - activeCouriers;
  const totalServices = services.length;
  const availableServices = services.filter(s => s.is_active).length;
  
  // Cari standard delivery termurah yang aktif
  const standardServices = services.filter(s => s.service_name === "Standard Delivery" && s.is_active);
  const cheapestStandard = standardServices.length > 0 
    ? standardServices.reduce((min, s) => s.price < min.price ? s : min, standardServices[0]) 
    : null;

  // Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, type: 'spring', stiffness: 200, damping: 25 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
  };

  return (
    <div className="admin-ship-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="shipping" />

      {/* Main Content Area */}
      <motion.div 
        className="admin-ship-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header */}
        <motion.div className="admin-ship-top-header" variants={cardVariants}>
          <div className="admin-ship-breadcrumbs">
            Admin <span>›</span> <span>Shipping</span> <span style={{ color: '#9ca3af', fontWeight: '400' }}>/admin/shipping</span>
          </div>
          <div className="admin-ship-header-right">
            <span className="admin-ship-badge">Admin access</span>
            <span className="admin-ship-date">12 Oct 2026</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-ship-title-section" variants={cardVariants}>
          <div className="admin-ship-title">
            <h1>Shipping Management</h1>
            <p>Manage courier availability, tracking links and delivery prices at checkout.</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="admin-ship-stats-grid" variants={cardVariants}>
          <div className="admin-ship-stat-card">
            <div className="admin-ship-stat-header">
              <span className="admin-ship-stat-label">Courier companies</span>
              <div className="admin-ship-stat-icon"><TruckIcon /></div>
            </div>
            <div className="admin-ship-stat-value">{totalCouriers}</div>
            <div className="admin-ship-stat-sub">{activeCouriers} active · {inactiveCouriers} inactive</div>
          </div>
          <div className="admin-ship-stat-card">
            <div className="admin-ship-stat-header">
              <span className="admin-ship-stat-label">Shipping services</span>
              <div className="admin-ship-stat-icon"><BoxIcon /></div>
            </div>
            <div className="admin-ship-stat-value">{totalServices}</div>
            <div className="admin-ship-stat-sub">{availableServices} available at checkout</div>
          </div>
          <div className="admin-ship-stat-card">
            <div className="admin-ship-stat-header">
              <span className="admin-ship-stat-label">Standard delivery from</span>
              <div className="admin-ship-stat-icon"><TagIcon /></div>
            </div>
            <div className="admin-ship-stat-value">
              {cheapestStandard ? `RM ${cheapestStandard.price.toFixed(2)}` : 'N/A'}
            </div>
            <div className="admin-ship-stat-sub">
              {cheapestStandard ? `Lowest active standard service · ${cheapestStandard.courier_name}` : 'No active standard service'}
            </div>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="admin-ship-grid">
          
          {/* Left Column: Tables */}
          <div className="admin-ship-left-column">
            
            {/* Courier Companies Table */}
            <motion.div className="admin-ship-card" variants={cardVariants}>
              <div className="admin-ship-card-header">
                <div>
                  <h3 className="admin-ship-card-title">Courier Companies</h3>
                  <p className="admin-ship-card-subtitle">Reference codes and templates used to create shipment tracking links.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="admin-ship-badge-sm">{totalCouriers} couriers</span>
                  <button className="admin-ship-btn-add" onClick={() => { setIsCourierFormOpen(true); setIsServiceFormOpen(false); }}>
                    <PlusIcon />
                    Add Courier
                  </button>
                </div>
              </div>

              <table className="admin-ship-table">
                <thead>
                  <tr>
                    <th>Courier</th>
                    <th>Code</th>
                    <th>Tracking URL template</th>
                    <th>Active state</th>
                  </tr>
                </thead>
                <tbody>
                  {couriers.map((courier) => (
                    <tr key={courier.id}>
                      <td><span className="admin-ship-courier-name">{courier.name}</span></td>
                      <td><span className="admin-ship-code">{courier.code}</span></td>
                      <td><span className="admin-ship-url">{courier.tracking_url_template}</span></td>
                      <td>
                        <label className="admin-ship-toggle">
                          <input 
                            type="checkbox" 
                            checked={courier.is_active}
                            onChange={() => handleToggleCourier(courier.id)}
                          />
                          <span className="admin-ship-slider"></span>
                        </label>
                        <span className={`admin-ship-status ${courier.is_active ? 'active' : 'inactive'}`} style={{ marginLeft: '8px' }}>
                          <span className="admin-ship-status-dot"></span>
                          {courier.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="admin-ship-table-footer">
                Replace {"{tracking_number}"} with the saved shipment number. These example URL templates should be verified before use.
              </div>

              <div className="admin-ship-info-box">
                <InfoIcon />
                <div className="admin-ship-info-content">
                  <h4>Inactive couriers stay on record</h4>
                  <p>Their services are hidden at checkout. Existing shipments keep their courier and tracking information.</p>
                </div>
              </div>
            </motion.div>

            {/* Shipping Services & Prices Table */}
            <motion.div className="admin-ship-card" variants={cardVariants}>
              <div className="admin-ship-card-header">
                <div>
                  <h3 className="admin-ship-card-title">Shipping Services & Prices</h3>
                  <p className="admin-ship-card-subtitle">Prices in RM · Estimated delivery in business days.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="admin-ship-badge-sm">{totalServices} services</span>
                  <button className="admin-ship-btn-add" onClick={() => { setIsServiceFormOpen(true); setIsCourierFormOpen(false); }}>
                    <PlusIcon />
                    Add Service
                  </button>
                </div>
              </div>

              <table className="admin-ship-table">
                <thead>
                  <tr>
                    <th>Courier</th>
                    <th>Service name</th>
                    <th>Price</th>
                    <th>Estimated days</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>
                        <div className="admin-ship-courier-name">{service.courier_name}</div>
                        <div className="admin-ship-code">{service.courier_code}</div>
                      </td>
                      <td>
                        <div className="admin-ship-courier-name" style={{ fontWeight: '500' }}>{service.service_name}</div>
                        {!service.is_active && <span style={{ fontSize: '12px', color: '#ef4444' }}>Unavailable · Courier inactive</span>}
                      </td>
                      <td><span className="admin-ship-courier-name">RM {service.price.toFixed(2)}</span></td>
                      <td>{service.estimated_days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="admin-ship-table-footer">
                Showing all {totalServices} services · The selected service price is saved with each order.
              </div>
            </motion.div>

          </div>

          {/* Right Column: Forms (Conditional Rendering) */}
          <div className="admin-ship-right-column">
            <AnimatePresence mode="wait">
              
              {/* Form Add Courier */}
              {isCourierFormOpen && (
                <motion.div 
                  key="courier-form"
                  className="admin-ship-form-card"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="admin-ship-form-header">
                    <h3 className="admin-ship-form-title">Add Courier</h3>
                    <button className="admin-ship-close-btn" onClick={() => setIsCourierFormOpen(false)}>
                      <CloseIcon />
                    </button>
                  </div>
                  <p className="admin-ship-form-subtitle">Create a courier company and its tracking link template.</p>

                  <form onSubmit={handleSubmitCourier(onSubmitCourier)}>
                    <div className="admin-ship-form-group">
                      <label>Courier name <span>*</span></label>
                      <input 
                        type="text" 
                        className="admin-ship-input" 
                        placeholder="Contoh: DHL eCommerce"
                        {...registerCourier("name", { required: true })} 
                      />
                      {errorsCourier.name && <span style={{color: 'red', fontSize: '12px'}}>Ruangan ini diperlukan</span>}
                    </div>

                    <div className="admin-ship-form-group">
                      <label>Reference code <span>*</span></label>
                      <input 
                        type="text" 
                        className="admin-ship-input" 
                        placeholder="Contoh: DHLE"
                        {...registerCourier("code", { required: true })} 
                      />
                      <span className="admin-ship-input-hint">Use a unique, short code for this courier.</span>
                    </div>

                    <div className="admin-ship-form-group">
                      <label>Tracking URL template <span>*</span></label>
                      <textarea 
                        className="admin-ship-textarea" 
                        placeholder="https://www.dhl.com/my-en/home/tracking.html?tracking-id={tracking_number}"
                        {...registerCourier("tracking_url_template", { required: true })} 
                      ></textarea>
                      <span className="admin-ship-input-hint">Include {"{tracking_number}"} as the placeholder.</span>
                    </div>

                    <div className="admin-ship-toggle-box">
                      <div className="admin-ship-toggle-text">
                        <h4>Active state</h4>
                        <p>Enable this courier for new shipping services.</p>
                      </div>
                      <label className="admin-ship-toggle">
                        <input 
                          type="checkbox" 
                          defaultChecked={true}
                          {...registerCourier("is_active")} 
                        />
                        <span className="admin-ship-slider"></span>
                      </label>
                    </div>

                    <div className="admin-ship-form-actions">
                      <button 
                        type="button" 
                        className="admin-ship-btn-cancel" 
                        onClick={() => setIsCourierFormOpen(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="admin-ship-btn-submit">
                        <CheckIcon />
                        Save courier
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Form Add Shipping Service */}
              {isServiceFormOpen && (
                <motion.div 
                  key="service-form"
                  className="admin-ship-form-card"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="admin-ship-form-header">
                    <h3 className="admin-ship-form-title">Add Shipping Service</h3>
                    <button className="admin-ship-close-btn" onClick={() => setIsServiceFormOpen(false)}>
                      <CloseIcon />
                    </button>
                  </div>
                  <p className="admin-ship-form-subtitle">Set a delivery option and price for an active courier.</p>

                  <form onSubmit={handleSubmitService(onSubmitService)}>
                    <div className="admin-ship-form-group">
                      <label>Courier <span>*</span></label>
                      <select 
                        className="admin-ship-select"
                        {...registerService("courier_id", { required: true })}
                      >
                        <option value="">Pilih kurier</option>
                        {couriers.filter(c => c.is_active).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      {errorsService.courier_id && <span style={{color: 'red', fontSize: '12px'}}>Sila pilih kurier</span>}
                    </div>

                    <div className="admin-ship-form-group">
                      <label>Service name <span>*</span></label>
                      <input 
                        type="text" 
                        className="admin-ship-input" 
                        placeholder="Contoh: Economy Delivery"
                        {...registerService("service_name", { required: true })} 
                      />
                      {errorsService.service_name && <span style={{color: 'red', fontSize: '12px'}}>Ruangan ini diperlukan</span>}
                    </div>

                    <div className="admin-ship-form-group">
                      <label>Price (RM) <span>*</span></label>
                      <input 
                        type="number" 
                        step="0.01"
                        className="admin-ship-input" 
                        placeholder="Contoh: 5.00"
                        {...registerService("price", { required: true })} 
                      />
                      <span className="admin-ship-input-hint">Fixed delivery charge per order.</span>
                    </div>

                    <div className="admin-ship-form-group">
                      <label>Estimated days <span>*</span></label>
                      <input 
                        type="text" 
                        className="admin-ship-input" 
                        placeholder="Contoh: 4-6"
                        {...registerService("estimated_days", { required: true })} 
                      />
                      <span className="admin-ship-input-hint">Business days after dispatch, e.g. 2–4.</span>
                    </div>

                    <div className="admin-ship-form-actions">
                      <button 
                        type="button" 
                        className="admin-ship-btn-cancel" 
                        onClick={() => setIsServiceFormOpen(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="admin-ship-btn-submit">
                        <CheckIcon />
                        Save service
                      </button>
                    </div>
                  </form>
                  <div className="admin-ship-form-footer">
                    This draft is not yet included in the service list.
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

        {/* Footer */}
        <motion.div className="admin-ship-footer" variants={cardVariants}>
          <span>Illustrative sample data only - Not live data</span>
          <span>© 2026 ALL-BUY</span>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default ShippingManagementPage;