import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../css/admin/UserManagementPage.css';
import AdminSidebar from '../../components/AdminSidebar'; // Pastikan komponen ini wujud

// ==========================================
// DUMMY DATA (Berdasarkan db.sql - Jadual users)
// ==========================================
const initialUsers = [
  { id: 1, username: "daniel.tan", name: "Daniel Tan", email: "daniel.tan@example.com", phone: "+60 12-000 0102", role: "user", created_at: "12 Oct 2026" },
  { id: 2, username: "siti.farah", name: "Siti Farah", email: "siti.farah@example.com", phone: "+60 12-000 0103", role: "user", created_at: "11 Oct 2026" },
  { id: 3, username: "arjun.nair", name: "Arjun Nair", email: "arjun.nair@example.com", phone: "+60 12-000 0104", role: "user", created_at: "08 Oct 2026" },
  { id: 4, username: "meiling.wong", name: "Mei Ling Wong", email: "meiling.wong@example.com", phone: "+60 12-000 0105", role: "user", created_at: "30 Sep 2026" },
  { id: 5, username: "aisha.rahman", name: "Aisha Rahman", email: "aisha.rahman@example.com", phone: "+60 12-000 0106", role: "user", created_at: "24 Sep 2026" },
  { id: 6, username: "jason.lim", name: "Jason Lim", email: "jason.lim@example.com", phone: "+60 12-000 0107", role: "user", created_at: "15 Sep 2026" },
  { id: 7, username: "priya.devi", name: "Priya Devi", email: "priya.devi@example.com", phone: "+60 12-000 0108", role: "user", created_at: "29 Aug 2026" },
  { id: 8, username: "amir.hakim", name: "Amir Hakim", email: "amir.hakim@example.com", phone: "+60 12-000 0101", role: "user", created_at: "18 Jul 2026" },
  { id: 9, username: "faiz.admin", name: "Faiz Iskandar", email: "faiz.admin@example.com", phone: "+60 12-000 0192", role: "admin", created_at: "01 Jul 2026" },
  { id: 10, username: "nur.aina", name: "Nur Aina", email: "nur.aina@example.com", phone: "+60 12-000 0191", role: "admin", created_at: "01 Jun 2026" },
  
];

// Ikon SVG
const UserPlusIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
);
const UserCheckIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
);
const ExportIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

const UserManagementPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage ,setCurrentPage] = useState(1);
  const itemPerPage=10;
  // Logik Penapisan (Filtering)
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
      
    const matchesRole = roleFilter === 'all' ? true : user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });


  // Logik Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemPerPage);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const firstVisibleItem = filteredUsers.length === 0 ? 0 : indexOfFirstItem + 1;
  const lastVisibleItem = Math.min(indexOfLastItem, filteredUsers.length);

  // Kiraan Statistik
  const totalUsers = users.length;
  const customerUsers = users.filter(u => u.role === 'user').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;

  // Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="admin-users-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="users" />

      {/* Main Content Area */}
      <motion.div 
        className="admin-users-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header */}
        <motion.div className="admin-users-top-header" variants={cardVariants}>
          <div className="admin-users-breadcrumbs">
            Admin <span>›</span> <span>Users</span> <span style={{ color: '#9ca3af', fontWeight: '400' }}>/admin/users</span>
          </div>
          <div className="admin-users-header-right">
            <span className="admin-users-badge">Admin access</span>
            <span className="admin-users-date">12 Oct 2026</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-users-title-section" variants={cardVariants}>
          <div className="admin-users-title">
            <h1>User Management</h1>
            <p>Browse registered accounts, contact details and store access roles.</p>
          </div>
          <button className="admin-users-btn-export">
            <ExportIcon />
            Export users
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="admin-users-stats-grid" variants={cardVariants}>
          <div className="admin-users-stat-card">
            <div className="admin-users-stat-header">
              <span className="admin-users-stat-label">Registered users</span>
              <div className="admin-users-stat-icon"><UserPlusIcon /></div>
            </div>
            <div className="admin-users-stat-value">{totalUsers}</div>
            <div className="admin-users-stat-sub">All accounts in this sample</div>
          </div>
          <div className="admin-users-stat-card">
            <div className="admin-users-stat-header">
              <span className="admin-users-stat-label">Customer accounts</span>
              <div className="admin-users-stat-icon"><UserCheckIcon /></div>
            </div>
            <div className="admin-users-stat-value">{customerUsers}</div>
            <div className="admin-users-stat-sub">Role: user · Storefront access</div>
          </div>
          <div className="admin-users-stat-card">
            <div className="admin-users-stat-header">
              <span className="admin-users-stat-label">Administrators</span>
              <div className="admin-users-stat-icon"><ShieldIcon /></div>
            </div>
            <div className="admin-users-stat-value">{adminUsers}</div>
            <div className="admin-users-stat-sub">Role: admin · Admin panel access</div>
          </div>
        </motion.div>

        {/* Main Table Card */}
        <motion.div className="admin-users-table-card" variants={cardVariants}>
          
          <div className="admin-users-table-header">
            <h3 className="admin-users-table-title">Registered Users</h3>
            <span className="admin-users-table-badge">{totalUsers} accounts</span>
          </div>

          {/* Filters */}
          <div className="admin-users-filters">
            <div className="admin-users-search-wrapper">
              <SearchIcon />
              <input 
                type="text" 
                className="admin-users-search-input" 
                placeholder="Search username, email or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="admin-users-filter-btn" onClick={() => setRoleFilter(roleFilter === 'all' ? 'user' : 'all')}>
              <ChevronDownIcon />
              {roleFilter === 'all' ? 'All roles' : roleFilter === 'user' ? 'User' : 'Admin'}
            </button>
            <button className="admin-users-filter-btn">
              <CalendarIcon />
              Registration: All dates
            </button>
          </div>

          {/* Table */}
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Registration date</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <td>
                        <div className="admin-users-name-wrapper">
                          <span className="admin-users-username">{user.username}</span>
                          <span className="admin-users-realname">{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`admin-users-role ${user.role}`}>
                          <span className="admin-users-role-dot"></span>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.created_at}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      Tiada pengguna dijumpai.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Table Footer & Pagination */}
          <div className="admin-users-table-footer">
            <span className="admin-users-table-info">
              Showing all {filteredUsers.length} users · Sorted by registration date, newest first
            </span>
            <div className="admin-users-pagination">
              <button 
              onClick={()=> setCurrentPage((page)=> Math.max(1,page-1))}
              className="admin-users-page-btn" disabled={currentPage <=1}>
                <ChevronLeftIcon />
              </button>
              {Array.from({ length:totalPages},(_, index)=>index + 1).map((page,index)=>(
                <button
                key={index}
                onClick={()=> setCurrentPage(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page? 'page': undefined}
                 className={`admin-users-page-number ${currentPage === page ?'active': ''}`}>{page}</button>
              ))}
              <button 
              onClick={()=> setCurrentPage((page)=> Math.max(1,page-1))}
              className="admin-users-page-btn" disabled={currentPage >=1}>
                <ChevronRightIcon />
              </button>
            </div>
          </div>

        </motion.div>

        {/* Footer */}
        <motion.div className="admin-users-footer" variants={cardVariants}>
          <span>Illustrative sample data only · Not live data</span>
          <span>© 2026 ALL-BUY</span>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default UserManagementPage;