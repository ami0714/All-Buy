import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../css/admin/UserManagementPage.css';
import AdminSidebar from '../../components/AdminSidebar'; // Pastikan komponen ini wujud
import {useUser,useUserList} from '../../hook/admin/useUser';


const UserPlusIcon = () => <Icon icon="mdi:account-multiple-plus-outline" width="18" height="18" aria-hidden="true" />;
const UserCheckIcon = () => <Icon icon="mdi:account-check-outline" width="18" height="18" aria-hidden="true" />;
const ShieldIcon = () => <Icon icon="mdi:shield-check-outline" width="18" height="18" aria-hidden="true" />;
const ExportIcon = () => <Icon icon="mdi:download-outline" width="18" height="18" aria-hidden="true" />;
const SearchIcon = () => <Icon icon="mdi:magnify" width="18" height="18" aria-hidden="true" />;
const ChevronDownIcon = () => <Icon icon="mdi:chevron-down" width="18" height="18" aria-hidden="true" />;
const CalendarIcon = () => <Icon icon="mdi:calendar-outline" width="18" height="18" aria-hidden="true" />;
const ChevronLeftIcon = () => <Icon icon="mdi:chevron-left" width="18" height="18" aria-hidden="true" />;
const ChevronRightIcon = () => <Icon icon="mdi:chevron-right" width="18" height="18" aria-hidden="true" />;

const UserManagementPage = () => {
  const {data:userState,isLoading} = useUser();
  const {data:users,isLoading:isUserLoad} = useUserList()
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage ,setCurrentPage] = useState(1);
  const itemPerPage=10;
  // Logik Penapisan (Filtering)
  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.phone.includes(searchTerm);
      
    
    return matchesSearch 
  });


  // Logik Pagination
  const totalPages = Math.ceil(filteredUsers?.length / itemPerPage);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = filteredUsers?.slice(indexOfFirstItem, indexOfLastItem);
  const firstVisibleItem = filteredUsers?.length === 0 ? 0 : indexOfFirstItem + 1;
  const lastVisibleItem = Math.min(indexOfLastItem, filteredUsers?.length);

 
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
        
        </motion.div>

        {/* Page Title */}
        <motion.div className="admin-users-title-section" variants={cardVariants}>
          <div className="admin-users-title">
            <h1>User Management</h1>
            <p>Browse registered accounts, contact details and store access roles.</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="admin-users-stats-grid" variants={cardVariants}>
          <div className="admin-users-stat-card">
            <div className="admin-users-stat-header">
              <span className="admin-users-stat-label">Registered users</span>
              <div className="admin-users-stat-icon"><UserPlusIcon /></div>
            </div>
            <div className="admin-users-stat-value">{!isLoading ? userState?.total_user : 0}</div>
            <div className="admin-users-stat-sub">All accounts in this sample</div>
          </div>
          <div className="admin-users-stat-card">
            <div className="admin-users-stat-header">
              <span className="admin-users-stat-label">Customer accounts</span>
              <div className="admin-users-stat-icon"><UserCheckIcon /></div>
            </div>
            <div className="admin-users-stat-value">{!isLoading ? userState?.user : 0}</div>
            <div className="admin-users-stat-sub">Role: user · Storefront access</div>
          </div>
          <div className="admin-users-stat-card">
            <div className="admin-users-stat-header">
              <span className="admin-users-stat-label">Administrators</span>
              <div className="admin-users-stat-icon"><ShieldIcon /></div>
            </div>
            <div className="admin-users-stat-value">{!isLoading ? userState?.admin : 0}</div>
            <div className="admin-users-stat-sub">Role: admin · Admin panel access</div>
          </div>
        </motion.div>

        {/* Main Table Card */}
        <motion.div className="admin-users-table-card" variants={cardVariants}>
          
          <div className="admin-users-table-header">
            <h3 className="admin-users-table-title">Registered Users</h3>
            <span className="admin-users-table-badge">{!isLoading ? userState?.total_user : 0} accounts</span>
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
                {isUserLoad ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      <span>Loading...</span>
                    </td>
                  </tr>
                ) : filteredUsers?.length > 0 ? (
                  filteredUsers?.map((user) => (
                    <motion.tr 
                      key={user?.id}
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
                      <td>{user?.email}</td>
                      <td>{user?.phone}</td>
                      <td>
                        <span className={`admin-users-role ${user?.role}`}>
                          <span className="admin-users-role-dot"></span>
                          {user?.role}
                        </span>
                      </td>
                      <td>{user?.created_at}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Table Footer & Pagination */}
          <div className="admin-users-table-footer">
            <span className="admin-users-table-info">
              Showing all {filteredUsers?.length} users · Sorted by registration date, newest first
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

      

      </motion.div>
    </div>
  );
};

export default UserManagementPage;