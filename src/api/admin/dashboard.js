import {get } from '../../utils/apiHelper';



export async function getAdminState() {
  const response = await get('/admin/dashboard/stats');

  if (response?.status === true && response.data !== undefined) {
    return response.data;
  }

  throw new Error(response?.message || 'Format respons statistik dashboard tidak sah.');
}

export async function getAdminChart(period) {
  if (period === null || period === undefined || period === '') {
    throw new Error('Tempoh carta tidak sah.');
  }

  const response = await get(`/admin/dashboard/chart?period=${encodeURIComponent(period)}`);

  if (response?.status === true && response.data !== undefined) {
    return response.data;
  }

  throw new Error(response?.message || 'Format respons carta dashboard tidak sah.');
}

export async function getAdminStatusOrder() {
  const response = await get('/admin/dashboard/status');

  if (response?.status === true && response.data !== undefined) {
    return response.data;
  }

  throw new Error(response?.message || 'Format respons status pesanan tidak sah.');
}

export async function getRecentOrders() {
  const response = await get('/admin/dashboard/recent-order');

  if (response?.status === true && Array.isArray(response.data)) {
    return response.data;
  }

  throw new Error(response?.message || 'Format respons pesanan terkini tidak sah.');
}