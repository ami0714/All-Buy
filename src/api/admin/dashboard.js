import {get } from '../../utils/apiHelper';



export async function getAdminState() {
  const response = await get('/admin/dashboard/stats');

  if (response?.status === true && response.data !== undefined) {
    return response.data;
  }

  throw new Error(response?.message || 'Invalid dashboard statistics response format.');
}

export async function getAdminChart(period) {
  if (period === null || period === undefined || period === '') {
    throw new Error('Invalid chart period.');
  }

  const response = await get(`/admin/dashboard/chart?period=${encodeURIComponent(period)}`);

  if (response?.status === true && response.data !== undefined) {
    return response.data;
  }

  throw new Error(response?.message || 'Invalid dashboard chart response format.');
}

export async function getAdminStatusOrder() {
  const response = await get('/admin/dashboard/status');

  if (response?.status === true && response.data !== undefined) {
    return response.data;
  }

  throw new Error(response?.message || 'Invalid order status response format.');
}

export async function getRecentOrders() {
  const response = await get('/admin/dashboard/recent-order');

  if (response?.status === true && Array.isArray(response.data)) {
    return response.data;
  }

  throw new Error(response?.message || 'Invalid recent orders response format.');
}