import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {useNavigate} from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion';
import '../css/user/Auth.css'; 
import {useLogin,useRegister} from '../hook/useAuth'

// ==========================================
// KOMPONEN HEADER
// ==========================================
const Header = () => (
  <header className="auth-header">
    <div className="auth-logo">ALL-BUY</div>
    <button className="btn-help">Help</button>
  </header>
);

// ==========================================
// KOMPONEN FORM LOGIN
// ==========================================
const LoginForm = ({ onSwitchToRegister }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const {mutate,isPending} = useLogin()
  const navigate = useNavigate()

  const onSubmit = (data) => {
     if(!data){
      alert('An error occurred.')
     }
     try {
      mutate(data,{
        onSuccess:(res)=>{
          if(res.user.role === 'user'){
            navigate('/home')
          }
          if(res.user.role === 'admin'){
            navigate('/admin/dashboard')
          }
        }
      })
     } catch (error) {
      alert(error)
     }

    
  };

  return (
    <motion.div 
      className="auth-card card-login"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="auth-title">Log In</h1>
      <p className="auth-subtitle">
        Log in to your ALL-BUY account to continue shopping and manage your orders.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="form-input" 
            placeholder="name@example.com"
            {...register("email", { required: true })}
          />
          {errors.email && <span style={{color: 'red', fontSize: '12px'}}>Email is required</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="Enter your password"
            {...register("password", { required: true })}
          />
          {errors.password && <span style={{color: 'red', fontSize: '12px'}}>Password is required</span>}
        </div>

        <button style={{cursor:isPending ? 'not-allowed':'pointer'}} type="submit" className="btn-submit">Log In</button>
      </form>

      <div className="auth-footer">
        Don't have an account? <span className="auth-link" onClick={onSwitchToRegister}>Sign Up</span>
      </div>

      <div className="copyright">
        © 2026 ALL-BUY
      </div>
    </motion.div>
  );
};

// ==========================================
// KOMPONEN FORM REGISTER
// ==========================================
const RegisterForm = ({ onSwitchToLogin }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const {mutate,isPending} = useRegister()
  const password = watch("password", "");
  const navigate = useNavigate()

  const onSubmit = (data) => {
    if(!data){
      alert('An error occurred.')
    }
    try {
      mutate(data,{
        onSuccess:(res)=>{
          if(res.status == true){
            navigate('/')
          }
        }
      })
    } catch (error) {
      alert(error)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div className="register-top-text">
        Create an account to continue shopping, save addresses, and easily track your orders.
      </div>

      <div className="auth-card card-register">
        <h1 className="auth-title">Create an Account</h1>
        <p className="auth-subtitle">Enter the details below to get started.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@example.com"
              {...register("email", { required: true })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Username"
              {...register("username", { required: true })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Phone number"
              {...register("phone", { required: true })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Create a password"
              {...register("password", { required: true })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Confirm your password"
              {...register("password_confirmation", { 
                required: true,
                validate: value => value === password || "Passwords do not match"
              })}
            />
            {errors.confirmPassword && <span style={{color: 'red', fontSize: '12px'}}>{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="btn-submit">Sign Up</button>
        </form>

        <div className="auth-footer">
          Already have an account? <span className="auth-link" onClick={onSwitchToLogin}>Log In</span>
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// KOMPONEN UTAMA (AUTH CONTAINER)
// ==========================================
const Auth = () => {
  // State untuk menentukan sama ada nak tunjuk Login atau Register
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="auth-container">
      <Header />
      
      {/* Kelas 'register-mode' akan mengubah susun atur jika di halaman Register */}
      <main className={`auth-main ${!isLoginView ? 'register-mode' : ''}`}>
        <AnimatePresence mode="wait">
          {isLoginView ? (
            <LoginForm 
              key="login"
              onSwitchToRegister={() => setIsLoginView(false)} 
            />
          ) : (
            <RegisterForm 
              key="register"
              onSwitchToLogin={() => setIsLoginView(true)} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Auth;