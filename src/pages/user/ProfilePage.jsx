import React, { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Icon } from '@iconify/react';
import {useNavigate} from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import '../../css/user/ProfilePage.css';
import {useGetAddress} from '../../hook/useAddress'
import {useEditUser} from '../../hook/useUser'
import {useAuth} from '../../context/authContext'
import { getDirtyValues } from '../../utils/form';



const HomeIcon = () => <Icon icon="mdi:home-outline" width="20" height="20" aria-hidden="true" />;
const OfficeIcon = () => <Icon icon="mdi:office-building-outline" width="20" height="20" aria-hidden="true" />;

const ProfilePage = () => {
  const Navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false);
  const {data:address,isLoading:isAdress} = useGetAddress();
  const {user,isLoading} = useAuth();
  const {mutate:editUserData,isPending} = useEditUser()

  // Setup React Hook Form
  const { register, handleSubmit, reset, formState: { errors, dirtyFields } } = useForm({
    defaultValues: {
      username: '',
      email: '',
      phone: '',
    }
  });

  useEffect(() => {
    
     const setUserData = () =>{
      reset({
      username: user?.username,
      email: user?.email,
      phone: user?.phone,
    })
     }
     setUserData()
    
  }, [isLoading])
  
  

  const onSubmit = (allData) => {
    try {
       if(!allData){
        throw new Error("data kosong");
        
       }
      const changed = getDirtyValues(allData, dirtyFields);
      if (Object.keys(changed).length === 0) {
        alert('No changes were made.');
        return;
      }

      editUserData(changed, {
        onSuccess: () => setIsEditing(false),
      });
    } catch (error) {
      alert('err'+error)
    }
  };

  const handleCancel = () => {
    reset({
      username: user?.username,
      email: user?.email,
      phone: user?.phone,
    }) // Reset borang kepada nilai asal
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
          <h1 className="profile-page-title">My Profile</h1>
          <p className="profile-page-subtitle">View and update your profile information and manage your shipping addresses.</p>
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
              <div className="profile-avatar">{isLoading ? 'U': user?.username?.split('')[0]}</div>
              <h2 className="profile-user-name">{isLoading ? 'U': user?.username}</h2>
              <span className="profile-user-id">Account ID: #{isLoading ? '0000':user?.uid}</span>
            </div>

            {/* Right Side: Form */}
            <form className="profile-form-grid" onSubmit={handleSubmit(onSubmit)}>
              <div className="profile-input-group">
                <label>Username</label>
                <input 
                  type="text" 
                  className="profile-input" 
                  disabled={!isEditing}
                  {...register("username", { required: true })} 
                />
              </div>

              <div className="profile-input-group">
                <label>Email</label>
                <input 
                  type="email" 
                  className="profile-input" 
                  disabled={!isEditing}
                  {...register("email", { required: true })} 
                />
              </div>

              <div className="profile-input-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  className="profile-input" 
                  disabled={!isEditing}
                  {...register("phone", { required: true })} 
                />
              </div>

              <div className="profile-input-group">
                <label>Created At</label>
                <input 
                  type="text" 
                  className="profile-input" 
                  value={user?.created_at} 
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
                      Edit Information
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
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="profile-btn-save"
                      >
                        Save Changes
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
              <h2>Address Book</h2>
              <p>Add, edit, and set a default address.</p>
            </div>
            <button onClick={()=> Navigate('/profile/address/add')} className="profile-btn-add">
              <Icon icon="mdi:plus" width="16" height="16" aria-hidden="true" />
              Add Address
            </button>
          </div>

          <div className="profile-address-list">
            {address?.map((address,index) => (
              <div key={index} className="profile-address-item">
                <div className="profile-address-left">
                  <div className="profile-address-icon">
                    {address?.label === 'Home' ? <HomeIcon /> : <OfficeIcon />}
                  </div>
                  <div className="profile-address-details">
                    <span className="profile-address-label">{address?.label}</span>
                    <span className="profile-address-sub">{address?.recipient_name} • {address?.phone}</span>
                    <span className="profile-address-text">{address?.address_line1}</span>
                  </div>
                </div>
                <div className="profile-address-right">
                  {address?.is_default ? (
                    <span className="profile-badge-default">Default</span>
                  ) : null}
                  <button onClick={()=> Navigate('/profile/address/edit/'+address?.id)}  className="profile-btn-address-edit">Edit</button>
                  {!address?.is_default && (
                    <button className="profile-btn-address-default">Set as Default</button>
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