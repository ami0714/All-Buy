import { get } from "../utils/apiHelper";


export async function getAllCourier(){

    const res = await get('/shipping');

    if (res?.status === true && Array.isArray(res.data)) {
        return res.data;
    }

    throw new Error(res?.message || 'Invalid courier list response format.');
}