import {get} from '../utils/apiHelper';




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