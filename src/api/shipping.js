import { get } from "../utils/apiHelper";


export async function getAllCourier(){

    try {
        const res =  await get('/shipping');

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