import {get,patch,post } from '../utils/apiHelper';


export async function getUserAddress() {
    const response = await get('/user/address');

    if (response?.status === true && Array.isArray(response.data)) {
        return response.data;
    }

    throw new Error(response?.message || 'Format respons alamat pengguna tidak sah.');
}

export async function getUserAddressByid(addressId) {
    if (addressId === null || addressId === undefined || addressId === '') {
        throw new Error('ID alamat tidak sah.');
    }

    const response = await get(`/user/address/${encodeURIComponent(addressId)}`);

    if (response?.status === true && response.data && typeof response.data === 'object') {
        return response.data;
    }

    throw new Error(response?.message || 'Format respons detail alamat tidak sah.');
}

export async function addAddress(body){

    if(!body){
        throw new Error('Data alamat diperlukan.');
    }

    const response  = await post('/user/address/add',body);

    if (response?.status === true) {
        return response.message ?? response;
    }

    throw new Error(response?.message || 'Gagal menambah alamat.');
}

export async function editAddress(body,AddressId){

    if (!body) {
        throw new Error('Data alamat diperlukan.');
    }

    if (AddressId === null || AddressId === undefined || AddressId === '') {
        throw new Error('ID alamat tidak sah.');
    }

    const response  = await patch(`/user/address/edit/${encodeURIComponent(AddressId)}`,body);

    if (response?.status === true) {
        return response.message ?? response;
    }

    throw new Error(response?.message || 'Gagal mengemas kini alamat.');
}