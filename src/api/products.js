import { get } from "../utils/apiHelper";


export async function getAllProduct(){

    const res = await get('/products');

    if (res?.status === true && Array.isArray(res.data)) {
        return res.data;
    }

    throw new Error(res?.message || 'Invalid product list response format.');
}

export async function getDetailProduct(slug){
    if (slug === null || slug === undefined || slug === '') {
        throw new Error('Invalid product slug.');
    }

    const res = await get(`/products/${encodeURIComponent(slug)}`);

    if (res?.status === true && res.data && typeof res.data === 'object') {
        return res.data;
    }

    throw new Error(res?.message || 'Invalid product details response format.');
}