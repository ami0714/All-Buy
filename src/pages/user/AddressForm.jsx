import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/user/AddressForm.css';
import Navbar from '../../Components/Navbar';

// ==========================================
// DUMMY DATA (Berdasarkan db.sql - Jadual addresses)
// ==========================================
const dummyAddressData = {
  id: 1,
  label: "Rumah",
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
  const navigate = useNavigate();

  // 2. Tentukan mod Edit atau Tambah
  // Jika ada 'id' dalam URL, maka isEdit = true
  const isEdit = !!id; 

  // 3. Setup React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: isEdit ? dummyAddressData : {
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

  // Fungsi apabila borang dihantar
  const onSubmit = (data) => {
    console.log("Data dihantar:", data);
    console.log("Mod:", isEdit ? "EDIT" : "TAMBAH");
    
    // Di sini anda akan panggil API untuk simpan ke database
    // Selepas berjaya, redirect kembali ke halaman profil
    // navigate('/profile');
    alert(`Alamat berjaya ${isEdit ? 'dikemaskini' : 'ditambah'}!`);
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
            Kembali ke Profil Saya
          </button>
          
          <h1 className="address-form-title">
            {isEdit ? "Edit Alamat" : "Tambah Alamat"}
          </h1>
          <p className="address-form-subtitle">
            {isEdit 
              ? "Kemas kini alamat penghantaran anda dan tetapan alamat lalai." 
              : "Simpan alamat baru untuk memudahkan penghantaran pesanan anda."}
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
              {isEdit ? dummyAddressData.label : "Alamat penghantaran"}
            </h2>

            {isEdit && dummyAddressData.is_default && (
              <span className="address-form-badge">Lalai</span>
            )}

            <p className="address-form-sidebar-desc">
              {isEdit 
                ? "Pastikan maklumat penerima dan alamat masih tepat untuk pesanan seterusnya."
                : "Masukkan alamat lengkap dan nombor telefon penerima supaya pesanan sampai dengan lancar."}
            </p>

            <div className="address-form-divider"></div>

            <div className="address-form-user-info">
              <span>Buku alamat untuk</span>
              <strong>{dummyUser.name}</strong>
              <span>{dummyUser.email}</span>
            </div>

            <div className="address-form-note">
              <strong>Semak sebelum menyimpan</strong>
              Sertakan nombor rumah atau unit, nama jalan dan poskod yang betul.
            </div>
          </div>

          {/* Right Form Area */}
          <div className="address-form-main">
            <form onSubmit={handleSubmit(onSubmit)}>
              
              {/* Section 1: Maklumat Penerima */}
              <h3 className="address-form-section-title">Maklumat penerima</h3>
              <div className="address-form-grid">
                <div className="address-form-group">
                  <label>Label alamat <small>(Pilihan)</small></label>
                  <select 
                  {...register("label", { required: "Label diperlukan" })}
                  className='address-form-select' >
                    <option value="">Pilih label</option>
                    <option value="Rumah">Rumah</option>
                    <option value="Pejabat">Pejabat</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>

                <div className="address-form-group">
                  <label>Nama penerima <span>*</span></label>
                  <input 
                    type="text" 
                    className="address-form-input" 
                    placeholder="Nama penuh penerima"
                    {...register("recipient_name", { required: "Nama penerima diperlukan" })} 
                  />
                  {errors.recipient_name && <span style={{color: 'red', fontSize: '12px'}}>{errors.recipient_name.message}</span>}
                </div>

                <div className="address-form-group full-width">
                  <label>Nombor telefon <span>*</span></label>
                  <input 
                    type="text" 
                    className="address-form-input" 
                    placeholder="Contoh: +60 12-345 6789"
                    {...register("phone", { required: "Nombor telefon diperlukan" })} 
                  />
                  {errors.phone && <span style={{color: 'red', fontSize: '12px'}}>{errors.phone.message}</span>}
                </div>
              </div>

              {/* Section 2: Alamat Penghantaran */}
              <h3 className="address-form-section-title">Alamat penghantaran</h3>
              <div className="address-form-grid">
                <div className="address-form-group full-width">
                  <label>Alamat baris 1 <span>*</span></label>
                  <input 
                    type="text" 
                    className="address-form-input" 
                    placeholder="Nombor rumah / unit dan nama jalan"
                    {...register("address_line1", { required: "Alamat baris 1 diperlukan" })} 
                  />
                  {errors.address_line1 && <span style={{color: 'red', fontSize: '12px'}}>{errors.address_line1.message}</span>}
                </div>

                <div className="address-form-group full-width">
                  <label>Alamat baris 2 <small>(Pilihan)</small></label>
                  <input 
                    type="text" 
                    className="address-form-input" 
                    placeholder="Nama bangunan, taman atau kawasan"
                    {...register("address_line2")} 
                  />
                </div>

                <div className="address-form-group">
                  <label>Bandar <span>*</span></label>
                  <input 
                    type="text" 
                    className="address-form-input" 
                    placeholder="Contoh: Klang"
                    {...register("city", { required: "Bandar diperlukan" })} 
                  />
                  {errors.city && <span style={{color: 'red', fontSize: '12px'}}>{errors.city.message}</span>}
                </div>

                <div className="address-form-group">
                  <label>Negeri <span>*</span></label>
                  <select 
                    className="address-form-select"
                    {...register("state", { required: "Negeri diperlukan" })}
                  >
                    <option value="">Pilih negeri</option>
                    <option value="Johor">Johor</option>
                    <option value="Kedah">Kedah</option>
                    <option value="Kelantan">Kelantan</option>
                    <option value="Melaka">Melaka</option>
                    <option value="Negeri Sembilan">Negeri Sembilan</option>
                    <option value="Pahang">Pahang</option>
                    <option value="Perak">Perak</option>
                    <option value="Perlis">Perlis</option>
                    <option value="Pulau Pinang">Pulau Pinang</option>
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
                  <label>Poskod <span>*</span></label>
                  <input 
                    type="text" 
                    className="address-form-input" 
                    placeholder="Contoh: 41050"
                    {...register("postcode", { required: "Poskod diperlukan" })} 
                  />
                  {errors.postcode && <span style={{color: 'red', fontSize: '12px'}}>{errors.postcode.message}</span>}
                </div>

                {/* Toggle Default Address */}
                <div className="address-form-toggle-wrapper">
                  <div className="address-form-toggle-text">
                    <h4>Tetapkan sebagai alamat lalai</h4>
                    <p>Hanya satu alamat boleh menjadi lalai. Memilih alamat ini akan menggantikan alamat lalai sebelumnya.</p>
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
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="address-form-btn-submit"
                >
                  {isEdit ? "Simpan Perubahan" : "Tambah Alamat"}
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