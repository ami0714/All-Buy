import {get,patch,post } from '../utils/apiHelper';


export async function getUserAddress() {
    const response = await get('/user/address')

    if(response.status === true){
        return response.data
    }

    if(response.status === false){
        return response.message
    }

    return {
        status: false,
        message: "gagal fetch"
    }
    
}

export async function getUserAddressByid(addressId) {
    const response = await get(`/user/address/${addressId}`)

    if(response.status === true){
        return response.data
    }

    if(response.status === false){
        return response.message
    }

    return {
        status: false,
        message: "gagal fetch"
    }
    
}

export async function addAddress(body){

    if(!body){
        return {
            status:false,
            message: 'pastikan ade data'
        }
    }

    const response  = await post('/user/address/add',body)

    if(response.status === false){
        return response.message
    }

    if(response.status === true){
        return response.message
    }
}

export async function editAddress(body,AddressId){

    if(!body){
        return {
            status:false,
            message: 'pastikan ade data'
        }
    }

    const response  = await patch(`/user/address/edit/${AddressId}`,body)

    if(response.status === false){
        return response.message
    }

    if(response.status === true){
        return response.message
    }
}