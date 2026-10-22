import {editUser} from '../api/user';
import {useMutation,useQueryClient} from '@tanstack/react-query'

export function useEditUser(){
const queryclient = useQueryClient();

 return useMutation({
    mutationFn:async (body)=>{
           const response = await editUser(body)
           return response
    },
    onSuccess:()=>{
        queryclient.invalidateQueries({ queryKey:['user']})
        alert("berjaya update data")
    },
    onError:(err)=>{
        alert('error'+ err.message)
    }
 })

}