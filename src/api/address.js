import {get,patch,post } from '../utils/apiHelper';


export async function getUserAddress() {
    const response = await get('/user/address');

    if (response?.status === true && Array.isArray(response.data)) {
        return response.data;
    }

    throw new Error(response?.message || 'Invalid user address response format.');
}

export async function getUserAddressByid(addressId) {
    if (addressId === null || addressId === undefined || addressId === '') {
        throw new Error('Invalid address ID.');
    }

    const response = await get(`/user/address/${encodeURIComponent(addressId)}`);

    if (response?.status === true && response.data && typeof response.data === 'object') {
        return response.data;
    }

    throw new Error(response?.message || 'Invalid address details response format.');
}

export async function addAddress(body){

    if(!body){
        throw new Error('Address data is required.');
    }

    const response  = await post('/user/address/add',body);

    if (response?.status === true) {
        return response.message ?? response;
    }

    throw new Error(response?.message || 'Unable to add address.');
}

export async function editAddress(body,AddressId){

    if (!body) {
        throw new Error('Address data is required.');
    }

    if (AddressId === null || AddressId === undefined || AddressId === '') {
        throw new Error('Invalid address ID.');
    }

    const response  = await patch(`/user/address/edit/${encodeURIComponent(AddressId)}`,body);

    if (response?.status === true) {
        return response.message ?? response;
    }

    throw new Error(response?.message || 'Unable to update address.');
}