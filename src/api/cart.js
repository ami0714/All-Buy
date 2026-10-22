import { get, post,patch,del } from '../utils/apiHelper'


export async function addToCart(body){

    if(!body){
        return {
            status:false,
            message: 'pastikan ade data'
        }
    }

    const response  = await post('/user/cart/add',body)

    if(response.status === false){
        return response.message
    }

    if(response.status === true){
        return response.message
    }
}


export async function getUserCart() {
    const response = await get('/user/cart')

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

export async function changeQuantityeCartItem(cartId,payload){

     const response = await patch(`/user/cart/${cartId}`,payload)

    if(response.status === true){
        return response.message
    }

    if(response.status === false){
        return response.message
    }

    return {
        status: false,
        message: "gagal tukar quantity"
    }
}

export async function deleteCartItem(cartId){

     const response = await del(`/user/cart/${cartId}`)

    if(response.status === true){
        return response.message
    }

    if(response.status === false){
        return response.message
    }

    return {
        status: false,
        message: "gagal delete"
    }
}

