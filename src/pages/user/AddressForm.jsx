import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {useAddAddress,useEditAddress,useGetAddressById} from '../../hook/useAddress';
import {useAuth} from '../../context/authContext';
import '../../css/user/AddressForm.css';
import Navbar from '../../components/Navbar';
import { getDirtyValues } from '../../utils/form';

// ==========================================
// DUMMY DATA (Berdasarkan db.sql - Jadual addresses)
// ==========================================
const dummyAddressData = {
  id: 1,
  label: "Home",
  recipient_name: "Aina Ahmad",
  phone: "+60 12-345 6789",
  address_line1: "No. 14, Jalan Meru 2",
  address_line2: "Bandar Meru Raya",
  city: "Klang",
  state: "Selangor",
  postcode: "41050",
  is_default: true
};

const dummyUser = {
  name: "Aina Ahmad",
  email: "aina.ahmad@example.com"
};

const AddressForm = () => {
  // 1. Dapatkan params dari URL (contoh: /address/edit/1)
  const { id } = useParams();
  const {user,isLoading:isUser} = useAuth();
  console.log(id)
  const navigate = useNavigate();
//data untuk edit
const {data:addressData,isLoading:isAddressLoad} = useGetAddressById(id);


  const {mutate:newAddress,isPending:isAddPending} = useAddAddress()
  const {mutate:editAddress,isPending:isEditPending} = useEditAddress()

  // 2. Tentukan mod Edit atau Tambah
  // Jika ada 'id' dalam URL, maka isEdit = true
  const isEdit = !!id; 

  // 3. Setup React Hook Form
  const { register, handleSubmit,reset, formState: { errors, dirtyFields } } = useForm({
    defaultValues:  {
      label: '',
      recipient_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postcode: '',
      is_default: false
    }
  });

  useEffect(() => {
    
  const getAddressData = ()=>{
      reset({
        label:addressData?.label ,
      recipient_name: addressData?.recipient_name,
      phone: addressData?.phone,
      address_line1: addressData?.address_line1,
      address_line2: addressData?.address_line2,
      city: addressData?.city,
      state: addressData?.state,
      postcode: addressData?.postcode,
      is_default: addressData?.is_default
      }
      )
  }
getAddressData()
  }, [isAddressLoad])
  

  // Fungsi apabila borang dihantar
  const onSubmit = (allData) => {
    if(!isEdit){
       newAddress(allData,{
        onSuccess:(res)=>{
            navigate('/profile');
        }
       })
    }

    if(isEdit){
      const changed = getDirtyValues(allData, dirtyFields);
      if (Object.keys(changed).length === 0) {
        alert('No changes were made.');
        return;
      }

      editAddress({body:changed,id:id},{
       onSuccess:(res)=>{
            navigate('/profile');
        }
      })
    }
   
  };

  // Fungsi Batal
  const handleCancel = () => {
     navigate('/profile');
  
  };

  // Animasi Framer Motion
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="address-form-container">
        <Navbar />
      <div className="address-form-content">
        
        {/* Header Section */}
        <motion.div 
          className="address-form-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button className="address-form-back-btn" onClick={handleCancel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to My Profile
          </button>
          
          <h1 className="address-form-title">
            {isEdit ? "Edit Address" : "Add Address"}
          </h1>
          <p className="address-form-subtitle">
            {isEdit 
              ? "Update your shipping address and default address settings."
              : "Save a new address to make order delivery easier."}
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div 
          className="address-form-card"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Sidebar */}
          <div className="address-form-sidebar">
            <div className="address-form-sidebar-icon">
              <svg viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            
            <h2 className="address-form-sidebar-title">
              {isEdit ? dummyAddressData.label : "Shipping Address"}
            </h2>

            {isEdit && dummyAddressData.is_default && (
              <span className="address-form-badge">Default</span>
            )}

            <p className="address-form-sidebar-desc">
              {isEdit 
                ? "Make sure the recipient and address details are accurate for your next order."
                : "Enter the complete address and recipient's phone number to ensure smooth delivery."}
            </p>

            <div className="address-form-divider"></div>

            <div className="address-form-user-info">
              <span>Address book for</span>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>

            <div className="address-form-note">
              <strong>Check before saving</strong>
              Include the correct house or unit number, street name, and postal code.
            </div>
          </div>

          {/* Right Form Area */}
          <div className="address-form-main">
            <form onSubmit={handleSubmit(onSubmit)}>
              
              {/* Section 1: Maklumat Penerima */}
              <h3 className="address-form-section-title">Recipient Information</h3>
              <div className="address-form-grid">
                <div className="address-form-group">
                  <label>Address label <small>(Optional)</small></label>
                  <select 
                  {...register("label", { required: "A label is required" })}
                  className='address-form-select' >
                    <option value="">Select a label</option>
                    <option value="Rumah">Home</option>
                    <option value="Pejabat">Office</option>
                    <option value="Lain-lain">Other</option>
                  </select>
                </div>

                <div className="address-form-group">
                  <label>Recipient Name <span>*</span></label>
                  <input 
                    type="text" 
                    className="address-form-input" 
                    placeholder="Recipient's full name"
                    {...register("recipient_name", { required: "Recipient name is required" })}
                  />
                  {errors.recipient_name && <span style={{color: 'red', fontSize: '12px'}}>{errors.recipient_name.message}</span>}
                </div>

                <div className="address-form-group full-width">
                  <label>Phone Number <span>*</span></label>
                  <input 
                    type="text" 
                    className="address-form-input" 
                    placeholder="Example: +60 12-345 6789"
                    {...register("phone", { required: "Phone number is required" })}
                  />
                  {errors.phone && <span style={{color: 'red', fontSize: '12px'}}>{errors.phone.message}</span>}
                </div>
              </div>

              {/* Section 2: Alamat Penghantaran */}
              <h3 className="address-form-section-title">Shipping Address</h3>
              <div className="address-form-grid">
                <div className="address-form-group full-width">
                  <label>Address Line 1 <span>*</span></label>
                  <input 
                    type="text" 
                    className="address-form-input" 
                    placeholder="House/unit number and street name"
                    {...register("address_line1", { required: "Address line 1 is required" })}
                  />
                  {errors.address_line1 && <span style={{color: 'red', fontSize: '12px'}}>{errors.address_line1.message}</span>}
                </div>

                <div className="address-form-group full-width">
                  <label>Address Line 2 <small>(Optional)</small></label>
                  <input 
                    type="text" 
                    className="address-form-input" 
                    placeholder="Building, neighborhood, or area"
                    {...register("address_line2")} 
                  />
                </div>

                <div className="address-form-group">
                  <label>City <span>*</span></label>
                  <input 
                    type="text" 
                    className="address-form-input" 
                    placeholder="Example: Klang"
                    {...register("city", { required: "City is required" })}
                  />
                  {errors.city && <span style={{color: 'red', fontSize: '12px'}}>{errors.city.message}</span>}
                </div>

                <div className="address-form-group">
                  <label>State <span>*</span></label>
                  <select 
                    className="address-form-select"
                    {...register("state", { required: "State is required" })}
                  >
                    <option value="">Select a state</option>
                    <option value="Johor">Johor</option>
                    <option value="Kedah">Kedah</option>
                    <option value="Kelantan">Kelantan</option>
                    <option value="Melaka">Melaka</option>
                    <option value="Negeri Sembilan">Negeri Sembilan</option>
                    <option value="Pahang">Pahang</option>
                    <option value="Perak">Perak</option>
                    <option value="Perlis">Perlis</option>
                    <option value="Pulau Pinang">Penang</option>
                    <option value="Sabah">Sabah</option>
                    <option value="Sarawak">Sarawak</option>
                    <option value="Selangor">Selangor</option>
                    <option value="Terengganu">Terengganu</option>
                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                    <option value="Labuan">Labuan</option>
                    <option value="Putrajaya">Putrajaya</option>
                  </select>
                  {errors.state && <span style={{color: 'red', fontSize: '12px'}}>{errors.state.message}</span>}
                </div>

                <div className="address-form-group">
                  <label>Postal Code <span>*</span></label>
                  <input 
                    type="text" 
                    className="address-form-input" 
                    placeholder="Example: 41050"
                    {...register("postcode", { required: "Postal code is required" })}
                  />
                  {errors.postcode && <span style={{color: 'red', fontSize: '12px'}}>{errors.postcode.message}</span>}
                </div>

                {/* Toggle Default Address */}
                <div className="address-form-toggle-wrapper">
                  <div className="address-form-toggle-text">
                    <h4>Set as Default Address</h4>
                    <p>Only one address can be set as the default. Selecting this address will replace the previous default address.</p>
                  </div>
                  <label className="address-form-toggle">
                    <input 
                      type="checkbox" 
                      {...register("is_default")} 
                    />
                    <span className="address-form-slider"></span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="address-form-actions">
                <button 
                  type="button" 
                  className="address-form-btn-cancel" 
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="address-form-btn-submit"
                >
                  {isEdit ? "Save Changes" : "Add Address"}
                </button>
              </div>

            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AddressForm;