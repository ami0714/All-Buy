import { get, post,patch,del } from '../utils/apiHelper'


export async function addToCart(body){

    if(!body){
        throw new Error('Product data is required to add an item to the cart.');
    }

    const response  = await post('/user/cart/add',body);

    if (response?.status === true) {
        return response.message ?? response;
    }

    throw new Error(response?.message || 'Unable to add product to cart.');
}


export async function getUserCart() {
    const response = await get('/user/cart')

    if (response?.status === true && Array.isArray(response.data)) {
        return response.data
    }

    throw new Error(response?.message || 'Invalid cart response format.');
}

export async function changeQuantityeCartItem(cartId,payload){
    if (cartId === null || cartId === undefined || cartId === '') {
        throw new Error('Invalid cart item ID.');
    }
    if (!payload) {
        throw new Error('Quantity data is required.');
    }

     const response = await patch(`/user/cart/${encodeURIComponent(cartId)}`,payload)

    if (response?.status === true) {
        return response.message ?? response;
    }

    throw new Error(response?.message || 'Unable to update cart item quantity.');
}

export async function deleteCartItem(cartId){
    if (cartId === null || cartId === undefined || cartId === '') {
        throw new Error('Invalid cart item ID.');
    }

     const response = await del(`/user/cart/${encodeURIComponent(cartId)}`)

    if (response?.status === true) {
        return response.message ?? response;
    }

    throw new Error(response?.message || 'Unable to remove cart item.');
}
