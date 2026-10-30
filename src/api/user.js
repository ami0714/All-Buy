import {patch} from '../utils/apiHelper';


export async function editUser(body){

    if(!body){
        throw new Error('Data pengguna diperlukan.');
    }

    const response  = await patch('/user',body)

    if (response?.status === true) {
        return response.message ?? response;
    }

    throw new Error(response?.message || 'Gagal mengemas kini maklumat pengguna.');
}