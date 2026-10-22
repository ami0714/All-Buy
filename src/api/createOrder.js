import {get,patch,post } from '../utils/apiHelper';



export async function createOrder(body){

    if(!body){
        return {
            status:false,
            message: 'pastikan ade data'
        }
    }

    const response  = await post('/user/payment/hitpay',body)

    if(response.status === false){
        return response.message
    }

    if(response.status === true){
        return response.data
    }
}
