import {get,patch } from '../../utils/apiHelper';


export async function getOrders(activeTab) {
  const response = await get(`/admin/orders?status=${activeTab}`);

  if (response?.status === true && Array.isArray(response.data)) {
    return response.data;
  }

  throw new Error(response?.message || 'Invalid  orders response format.');
}



export async function getOrderState() {
  const response = await get('/admin/orders/state');

  if (response?.status === true && !Array.isArray(response.data)) {
    return response.data;
  }

  throw new Error(response?.message || 'Invalid order state response format.');
}


export async function updateOrderStatus(orderId, body) {
  if (orderId === null || orderId === undefined || orderId === '') {
    throw new Error('Invalid order ID.');
  }

  if (!body || Object.keys(body).length === 0) {
    throw new Error('There are no changes to update.');
  }

  const response = await patch(`/admin/orders/${encodeURIComponent(orderId)}/status`, body);

  if (response?.status === true) {
    return response.message ?? response;
  }

  throw new Error(response?.message || 'Unable to update order.');
}

