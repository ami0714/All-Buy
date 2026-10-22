import {useQuery,useMutation} from '@tanstack/react-query';
import {createOrder} from '../api/createOrder';


export function useCreateOrder(){

    return useMutation({
        mutationFn: async (body)=>{
          const res = await createOrder(body)
          return res
        },
        onError:(err)=>{
          alert('error create order')
        }
       })
    }