import { post } from "../utils/apiHelper";

export function logUser(dataUser){
      
    return post('/login',dataUser)
  
}

export function registerUser(dataUser){
   

    return post('/register',dataUser);

}


/*reset pass */



export async function getEmail(email){
    const body ={
        email:email
    }
     
    const res = await post('/forgot-password',body)

    if (res?.status === true) {
        return res.status;
    }

    throw new Error(res?.message || 'Gagal menghantar pautan tetapan semula kata laluan.');
}


export async function SetNewPass(token,email, password,password_confirmation){
    const body = {
        token:token,
        email:email,
        password:password,
        password_confirmation:password_confirmation
    }

    const res = await post('/reset-password',body)

    if (res?.status === true) {
        return res.status;
    }
    throw new Error(res?.message || 'Gagal menetapkan kata laluan baharu.');
}