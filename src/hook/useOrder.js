import { useQuery } from "@tanstack/react-query";
import {getUserAllOrder,getUserOrder} from '../api/order';


export function useGetAllOrder(){

    return useQuery({
    queryKey: ['all-order-user'],
    queryFn: getUserAllOrder,
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}

export function useGetUserOrder(order_id) {

    return useQuery({
        queryKey: ['user-order', order_id],
        queryFn: () => getUserOrder(order_id),
        enabled: !!localStorage.getItem('token'),
        staleTime: 60000,
    });
}
