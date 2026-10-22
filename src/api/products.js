import { get } from "../utils/apiHelper";


export async function getAllProduct(){

    try {
        const res =  await get('/products');

        if (res.status == false){
            return res
        } 
        if(res.status == true){
            return res.data;
        }


    } catch (error) {
        return {
            status: false,
            message: "error"
        }
    }
}

export async function getDetailProduct(slug){

    try {
        const res =  await get(`/products/${slug}`);

        if (res.status == false){
            return res
        } 
        if(res.status == true){
            return res.data;
        }


    } catch (error) {
        return {
            status: false,
            message: "error"
        }
    }
}