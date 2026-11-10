import {get} from '../../utils/apiHelper';



export async function getUserState(){
    const response = await get('/admin/user/state');

     if (response?.status === true) {
    return response.data;
  }

  throw new Error("errror get user state");
  
}

export async function getUserList(){
    const response = await get('/admin/user/list');

     if (response?.status === true) {
    return response.data;
  }

  throw new Error("errror get user list");
  
}