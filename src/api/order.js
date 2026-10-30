import {get} from '../utils/apiHelper';




export async function getUserAllOrder() {
    const response = await get('/user/orders')

    if (response?.status === true && Array.isArray(response.data)) {
        return response.data
    }

    throw new Error(response?.message || 'Format respons senarai pesanan tidak sah.');
}