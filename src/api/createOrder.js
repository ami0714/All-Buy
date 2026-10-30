import {post } from '../utils/apiHelper';



export async function createOrder(body){

    if(!body){
        throw new Error('Maklumat pesanan diperlukan.');
    }

    const response  = await post('/user/payment/hitpay',body)

    if (response?.status === true && response.data) {
        return response.data;
    }

    throw new Error(response?.message || 'Gagal membuat pesanan.');
}
