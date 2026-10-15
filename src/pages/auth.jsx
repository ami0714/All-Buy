import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import '../css/user/Auth.css'; 

// ==========================================
// KOMPONEN HEADER
// ==========================================
const Header = () => (
  <header className="auth-header">
    <div className="auth-logo">ALL-BUY</div>
    <button className="btn-help">Bantuan</button>
  </header>
);

// ==========================================
// KOMPONEN FORM LOGIN
// ==========================================
const LoginForm = ({ onSwitchToRegister }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log('Login Data:', data);
  };

  return (
    <motion.div 
      className="auth-card card-login"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="auth-title">Log masuk</h1>
      <p className="auth-subtitle">
        Log masuk ke akaun ALL-BUY anda untuk meneruskan pembelian dan mengurus pesanan.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="form-input" 
            placeholder="nama@example.com"
            {...register("email", { required: true })}
          />
          {errors.email && <span style={{color: 'red', fontSize: '12px'}}>Email diperlukan</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Kata laluan</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="Masukkan kata laluan"
            {...register("password", { required: true })}
          />
          {errors.password && <span style={{color: 'red', fontSize: '12px'}}>Kata laluan diperlukan</span>}
        </div>

        <button type="submit" className="btn-submit">Log masuk</button>
      </form>

      <div className="auth-footer">
        Belum ada akaun? <span className="auth-link" onClick={onSwitchToRegister}>Daftar</span>
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
  const password = watch("password", "");

  const onSubmit = (data) => {
    console.log('Register Data:', data);
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
        Buat akaun untuk meneruskan pembelian, simpan alamat dan pantau status pesanan dengan lebih mudah.
      </div>

      <div className="auth-card card-register">
        <h1 className="auth-title">Daftar akaun</h1>
        <p className="auth-subtitle">Isi maklumat di bawah untuk mula berbelanja.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="nama@example.com"
              {...register("email", { required: true })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="nama pengguna"
              {...register("username", { required: true })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="buat kata laluan"
              {...register("password", { required: true })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="ulang kata laluan"
              {...register("confirmPassword", { 
                required: true,
                validate: value => value === password || "Kata laluan tidak sepadan"
              })}
            />
            {errors.confirmPassword && <span style={{color: 'red', fontSize: '12px'}}>{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="btn-submit">Daftar</button>
        </form>

        <div className="auth-footer">
          Sudah ada akaun? <span className="auth-link" onClick={onSwitchToLogin}>Log masuk</span>
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