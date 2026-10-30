import { get, post,patch,del } from '../utils/apiHelper'


export async function addToCart(body){

    if(!body){
        throw new Error('Data produk diperlukan untuk menambah ke troli.');
    }

    const response  = await post('/user/cart/add',body);

    if (response?.status === true) {
        return response.message ?? response;
    }

    throw new Error(response?.message || 'Gagal menambah produk ke troli.');
}


export async function getUserCart() {
    const response = await get('/user/cart')

    if (response?.status === true && Array.isArray(response.data)) {
        return response.data
    }

    throw new Error(response?.message || 'Format respons troli tidak sah.');
}

export async function changeQuantityeCartItem(cartId,payload){
    if (cartId === null || cartId === undefined || cartId === '') {
        throw new Error('ID item troli tidak sah.');
    }
    if (!payload) {
        throw new Error('Data kuantiti diperlukan.');
    }

     const response = await patch(`/user/cart/${encodeURIComponent(cartId)}`,payload)

    if (response?.status === true) {
        return response.message ?? response;
    }

    throw new Error(response?.message || 'Gagal mengemas kini kuantiti item troli.');
}

export async function deleteCartItem(cartId){
    if (cartId === null || cartId === undefined || cartId === '') {
        throw new Error('ID item troli tidak sah.');
    }

     const response = await del(`/user/cart/${encodeURIComponent(cartId)}`)

    if (response?.status === true) {
        return response.message ?? response;
    }

    throw new Error(response?.message || 'Gagal memadam item troli.');
}
