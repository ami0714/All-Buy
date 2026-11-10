import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { getOrders,getOrderState,updateOrderStatus } from '../../api/admin/orders';


export function useGetOrders(activeTab){

    return useQuery({
    queryKey: ['admin-orders',activeTab],
    queryFn: () => getOrders(activeTab),
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}

export function useGetOrderState() {
  return useQuery({
    queryKey: ['admin-order-state'],
    queryFn: getOrderState,
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,
  });
}


export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, body }) => updateOrderStatus(orderId, body),
    onSuccess: () => {
      alert('Order status updated successfully.');
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        queryClient.invalidateQueries({ queryKey: ['admin-order-state'] });
        queryClient.invalidateQueries({ queryKey: ['user-order'] });

    },
    onError: (error) => {
      alert(error || 'Unable to update order status.');
    }
  });
}