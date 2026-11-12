import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../css/admin/ShippingManagementPage.css';
import { useGetAllCourierAdmin, useGetAllShippingMethodAdmin,useAddNewCourierAdmin,useAddShipMethod
        ,useUpdateStatus
 } from '../../hook/admin/useShipping';
import AdminSidebar from '../../components/AdminSidebar'; 

const TruckIcon = () => <Icon icon="mdi:truck-fast-outline" width="18" height="18" aria-hidden="true" />;
const BoxIcon = () => <Icon icon="mdi:cube-outline" width="18" height="18" aria-hidden="true" />;
const TagIcon = () => <Icon icon="mdi:tag-outline" width="18" height="18" aria-hidden="true" />;
const PlusIcon = () => <Icon icon="mdi:plus" width="18" height="18" aria-hidden="true" />;
const CloseIcon = () => <Icon icon="mdi:close" width="18" height="18" aria-hidden="true" />;
const CheckIcon = () => <Icon icon="mdi:check" width="18" height="18" aria-hidden="true" />;
const InfoIcon = () => <Icon icon="mdi:information-outline" width="18" height="18" aria-hidden="true" />;

const ShippingManagementPage = () => {

  
  // State untuk kawalan borang
  const [isCourierFormOpen, setIsCourierFormOpen] = useState(false);
  const {mutate: addNewCourierAdmin,isPending:isAddPending} = useAddNewCourierAdmin();
  const {mutate:addNewMethod,isPending:isMethodPending} = useAddShipMethod()
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  
  const { data: courierData = [], isLoading: isCourierLoading } = useGetAllCourierAdmin();
  const { data: serviceData, isLoading: isServiceLoading } = useGetAllShippingMethodAdmin();
  const { mutate:updateStatus} = useUpdateStatus();
  // Setup React Hook Form untuk Courier
  const { register: registerCourier, handleSubmit: handleSubmitCourier, reset: resetCourier, formState: { errors: errorsCourier } } = useForm();

  // Setup React Hook Form untuk Service
  const { register: registerService, handleSubmit: handleSubmitService, reset: resetService, formState: { errors: errorsService } } = useForm();
    
  // Fungsi Tambah Courier
  const onSubmitCourier = (data) => {
     if(!data){
      alert("error")
     }
      addNewCourierAdmin(data,{
        onSuccess:()=>{
          alert("successfuly add new courier")
        },
        onError:(err)=>{
          alert('error:'+ err)
        }
      })
    setIsCourierFormOpen(false);
    resetCourier();
   
  };

  // Fungsi Tambah Service
  const onSubmitService = (data) => {
    
    addNewMethod(data,{
      onSuccess:()=>{
        alert("successfuly added shipping method")
      }
    })
    setIsServiceFormOpen(false);
    resetService();
    
  };

  // Fungsi Toggle Active State
  const handleToggleCourier = (courier) => {
    updateStatus({statusVal:courier?.is_active,courier_id:courier?.id})
    // setCouriers(courierData?.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
  };

  // Kiraan Statistik
  const totalCouriers = courierData?.length ?? 0;
  const activeCouriers = courierData?.filter(c => c?.is_active)?.length ?? 0;
  const inactiveCouriers = totalCouriers - activeCouriers;
  const totalServices = serviceData?.length ?? 0;
  const availableServices = serviceData?.filter(s => s.is_active).length ?? 0;

  // // Cari standard delivery termurah yang aktif
  // const standardServices = services.filter(s => s.service_name === "Standard Delivery" && s.is_active);
  // const cheapestStandard = standardServices.length > 0 
  //   ? standardServices.reduce((min, s) => s.price < min.price ? s : min, standardServices[0]) 
  //   : null;

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
                  {courierData?.map((courier) => (
                    <tr key={courier.id}>
                      <td><span className="admin-ship-courier-name">{courier?.name}</span></td>
                      <td><span className="admin-ship-code">{courier?.code}</span></td>
                      <td><span className="admin-ship-url">{courier?.tracking_url_template}</span></td>
                      <td>
                        <label className="admin-ship-toggle">
                          <input 
                            type="checkbox" 
                            checked={courier?.is_active}
                            onChange={() => handleToggleCourier(courier)}
                          />
                          <span className="admin-ship-slider"></span>
                        </label>
                        <span className={`admin-ship-status ${courier?.is_active ? 'active' : 'inactive'}`} style={{ marginLeft: '8px' }}>
                          <span className="admin-ship-status-dot"></span>
                          {courier?.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="admin-ship-table-footer">
                Replace {"{tracking_number]"} with the saved shipment number. These example URL templates should be verified before use.
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
                  {serviceData?.map((service) => (
                    <tr key={service?.id}>
                      <td>
                        <div className="admin-ship-courier-name">{service?.courier_name}</div>
                        <div className="admin-ship-code">{service?.courier_code}</div>
                      </td>
                      <td>
                        <div className="admin-ship-courier-name" style={{ fontWeight: '500' }}>{service?.service_name}</div>
                        {!service?.is_active && <span style={{ fontSize: '12px', color: '#ef4444' }}>Unavailable · Courier inactive</span>}
                      </td>
                      <td><span className="admin-ship-courier-name">RM {service?.price}</span></td>
                      <td>{service?.estimated_days}</td>
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
                        placeholder="Example: DHL eCommerce"
                        {...registerCourier("name", { required: true })} 
                      />
                      {errorsCourier.name && <span style={{color: 'red', fontSize: '12px'}}>This field is required</span>}
                    </div>

                    <div className="admin-ship-form-group">
                      <label>Reference code <span>*</span></label>
                      <input 
                        type="text" 
                        className="admin-ship-input" 
                        placeholder="Example: DHLE"
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
                        <option value="">Select a courier</option>
                        {courierData?.filter(c => c?.is_active)?.map(c => (
                          <option key={c?.id} value={c?.id}>{c?.name}</option>
                        ))}
                      </select>
                      {errorsService.courier_id && <span style={{color: 'red', fontSize: '12px'}}>Please select a courier</span>}
                    </div>

                    <div className="admin-ship-form-group">
                      <label>Service name <span>*</span></label>
                      <input 
                        type="text" 
                        className="admin-ship-input" 
                        placeholder="Example: Economy Delivery"
                        {...registerService("service_name", { required: true })} 
                      />
                      {errorsService.service_name && <span style={{color: 'red', fontSize: '12px'}}>This field is required</span>}
                    </div>

                    <div className="admin-ship-form-group">
                      <label>Price (RM) <span>*</span></label>
                      <input 
                        type="number" 
                        step="0.01"
                        className="admin-ship-input" 
                        placeholder="Example: 5.00"
                        {...registerService("price", { required: true })} 
                      />
                      <span className="admin-ship-input-hint">Fixed delivery charge per order.</span>
                    </div>

                    <div className="admin-ship-form-group">
                      <label>Estimated days <span>*</span></label>
                      <input 
                        type="text" 
                        className="admin-ship-input" 
                        placeholder="Example: 4-6"
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

        

      </motion.div>
    </div>
  );
};

export default ShippingManagementPage;