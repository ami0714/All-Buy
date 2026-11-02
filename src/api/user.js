import {patch} from '../utils/apiHelper';


export async function editUser(body){

    if(!body){
        throw new Error('User data is required.');
    }

    const response  = await patch('/user',body)

    if (response?.status === true) {
        return response.message ?? response;
    }

    throw new Error(response?.message || 'Unable to update user information.');
}