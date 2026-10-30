import { get } from "../utils/apiHelper";


export async function getAllProduct(){

    const res = await get('/products');

    if (res?.status === true && Array.isArray(res.data)) {
        return res.data;
    }

    throw new Error(res?.message || 'Format respons senarai produk tidak sah.');
}

export async function getDetailProduct(slug){
    if (slug === null || slug === undefined || slug === '') {
        throw new Error('Slug produk tidak sah.');
    }

    const res = await get(`/products/${encodeURIComponent(slug)}`);

    if (res?.status === true && res.data && typeof res.data === 'object') {
        return res.data;
    }

    throw new Error(res?.message || 'Format respons detail produk tidak sah.');
}