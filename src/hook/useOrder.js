import { useQuery } from "@tanstack/react-query";
import {getUserAllOrder} from '../api/order';


export function useGetAllOrder(){

    return useQuery({
    queryKey: ['all-order-user'],
    queryFn: getUserAllOrder,
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}