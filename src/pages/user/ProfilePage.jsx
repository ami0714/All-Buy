import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../Components/Navbar';
import '../../css/user/ProfilePage.css';

// ==========================================
// DUMMY DATA (Berdasarkan db.sql)
// ==========================================
// Menggabungkan data dari jadual `users` dan `addresses`
const dummyUser = {
  uid: 10482,
  username: "ainaahmad",
  name: "Aina Ahmad",
  email: "aina.ahmad@example.com",
  phone: "+60 12-345 6789",
  created_at: "12 Jan 2024, 10:24 AM",
  avatar_initial: "A"
};

const dummyAddresses = [
  {
    id: 1,
    label: "Rumah",
    recipient_name: "Aina Ahmad",
    phone: "+60 12-345 6789",
    address_line1: "No. 14, Jalan Meru 2, Bandar Meru Raya, 41050 Klang, Selangor",
    is_default: true,
    type: "home"
  },
  {
    id: 2,
    label: "Pejabat",
    recipient_name: "Aina Ahmad",
    phone: "+60 12-345 6789",
    address_line1: "Tingkat 8, Menara Sentral, Jalan Stesen Sentral 2, 50470 Kuala Lumpur",
    is_default: false,
    type: "office"
  }
];

// Ikon SVG
const HomeIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
);

const OfficeIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
);

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Setup React Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      username: dummyUser.username,
      email: dummyUser.email,
      phone: dummyUser.phone,
    }
  });

  const onSubmit = (data) => {
    console.log("Data disimpan:", data);
    // Di sini anda akan panggil API untuk update database
    setIsEditing(false); // Kembali ke mode paparan selepas simpan
  };

  const handleCancel = () => {
    reset(); // Reset borang kepada nilai asal
    setIsEditing(false);
  };

  // Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-content">
        <Navbar />
        {/* Page Header */}
        <motion.div 
          className="profile-page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="profile-page-title">Profil Saya</h1>
          <p className="profile-page-subtitle">Lihat dan ubah maklumat profil, serta uruskan alamat penghantaran.</p>
        </motion.div>

        {/* User Profile Card */}
        <motion.div 
          className="profile-section-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="profile-user-layout">
            {/* Left Side: Avatar & Name */}
            <div className="profile-user-left">
              <div className="profile-avatar">{dummyUser.avatar_initial}</div>
              <h2 className="profile-user-name">{dummyUser.name}</h2>
              <span className="profile-user-id">ID Akaun: #{dummyUser.uid}</span>
            </div>

            {/* Right Side: Form */}
            <form className="profile-form-grid" onSubmit={handleSubmit(onSubmit)}>
              <div className="profile-input-group">
                <label>Nama pengguna</label>
                <input 
                  type="text" 
                  className="profile-input" 
                  disabled={!isEditing}
                  {...register("username", { required: true })} 
                />
              </div>

              <div className="profile-input-group">
                <label>Emel</label>
                <input 
                  type="email" 
                  className="profile-input" 
                  disabled={!isEditing}
                  {...register("email", { required: true })} 
                />
              </div>

              <div className="profile-input-group">
                <label>Nombor telefon</label>
                <input 
                  type="text" 
                  className="profile-input" 
                  disabled={!isEditing}
                  {...register("phone", { required: true })} 
                />
              </div>

              <div className="profile-input-group">
                <label>Dibuat pada</label>
                <input 
                  type="text" 
                  className="profile-input" 
                  value={dummyUser.created_at} 
                  disabled 
                  readOnly
                />
              </div>

              {/* Buttons (Conditional Rendering) */}
              <div className="profile-form-actions">
                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.button
                      key="edit-btn"
                      type="button"
                      className="profile-btn-edit"
                      onClick={() => setIsEditing(true)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      Edit Maklumat
                    </motion.button>
                  ) : (
                    <motion.div 
                      key="action-btns"
                      style={{ display: 'flex', gap: '16px' }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button 
                        type="button" 
                        className="profile-btn-cancel" 
                        onClick={handleCancel}
                      >
                        Batal
                      </button>
                      <button 
                        type="submit" 
                        className="profile-btn-save"
                      >
                        Simpan perubahan
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Address Book Card */}
        <motion.div 
          className="profile-section-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="profile-address-header">
            <div className="profile-address-title">
              <h2>Buku Alamat</h2>
              <p>Tambah, edit dan tetapkan alamat sebagai lalai.</p>
            </div>
            <button className="profile-btn-add">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Tambah Alamat
            </button>
          </div>

          <div className="profile-address-list">
            {dummyAddresses.map((address) => (
              <div key={address.id} className="profile-address-item">
                <div className="profile-address-left">
                  <div className="profile-address-icon">
                    {address.type === 'home' ? <HomeIcon /> : <OfficeIcon />}
                  </div>
                  <div className="profile-address-details">
                    <span className="profile-address-label">{address.label}</span>
                    <span className="profile-address-sub">{address.recipient_name} • {address.phone}</span>
                    <span className="profile-address-text">{address.address_line1}</span>
                  </div>
                </div>
                <div className="profile-address-right">
                  {address.is_default ? (
                    <span className="profile-badge-default">Lalai</span>
                  ) : null}
                  <button className="profile-btn-address-edit">Edit</button>
                  {!address.is_default && (
                    <button className="profile-btn-address-default">Jadikan lalai</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ProfilePage;