import {post } from '../utils/apiHelper';



export async function createOrder(body){

    if(!body){
        throw new Error('Order information is required.');
    }

    const response  = await post('/user/payment/hitpay',body)

    if (response?.status === true && response.data) {
        return response.data;
    }

    throw new Error(response?.message || 'Unable to create the order.');
}
