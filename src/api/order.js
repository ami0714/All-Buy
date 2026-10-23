import {get} from '../utils/apiHelper';




export async function getUserAllOrder() {
    const response = await get('/user/orders')

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