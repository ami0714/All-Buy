import {get,patch} from '../utils/apiHelper';




export async function getUserAllOrder() {
    const response = await get('/user/orders')

    if (response?.status === true && Array.isArray(response.data)) {
        return response.data
    }

    throw new Error(response?.message || 'Invalid order list response format.');
}

export async function getUserOrder(order_id) {
    const response = await get(`/user/orders/${order_id}`)

     const orderData = response && Object.hasOwn(response, 'data')
    ? response.data
    : response;

     if (orderData ) {
    return orderData;
  }

    if(response?.status === false){
        throw new Error("Unable to retrieve order details.");
        
    }

    throw new Error(response?.message || 'Invalid order details response format.');
    }

    export async function receiveOrder(order_id) {
        if (order_id === null || order_id === undefined || order_id === '') {
            throw new Error('Invalid order ID.');
          }

        const response = await patch(`/user/orders/${encodeURIComponent(order_id)}/status/received`);

        if (response?.status === true) {
            return response.message ?? response;
          }

        throw new Error(response?.message || 'Unable to update order status.');
    }