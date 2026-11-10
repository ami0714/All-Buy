import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import {getUserAllOrder,getUserOrder,receiveOrder} from '../api/order';


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


export function useReceiveOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (order_id) => receiveOrder(order_id),
        onSuccess: () => {
            // Invalidate the user order query to fetch the updated order details
            queryClient.invalidateQueries(['user-order']);
        },
        onError: (error) => {
            alert(error || 'Unable to mark order as received.');
        }
    });
}