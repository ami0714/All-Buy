import {patch} from '../utils/apiHelper';


export async function editUser(body){

    if(!body){
        return {
            status:false,
            message: 'pastikan ade data'
        }
    }

    const response  = await patch('/user',body)

    if(response.status === false){
        return response.message
    }

    if(response.status === true){
        return response.message
    }

}