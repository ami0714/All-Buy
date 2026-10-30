import {useQuery,useMutation} from '@tanstack/react-query';
import {getAdminState,getAdminChart,getAdminStatusOrder,getRecentOrders} from '../../api/admin/dashboard';

export function useGetState(){

    return useQuery({
    queryKey: ['admin-state-dashboard'],
    queryFn: getAdminState,
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}

export function useGetChart(period){

    return useQuery({
    queryKey: ['admin-state-chart',period],
    queryFn: () => getAdminChart(period),
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}


export function useGetStatusOrder(){

    return useQuery({
    queryKey: ['admin-status-dashboard-order'],
    queryFn: () => getAdminStatusOrder(),
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}


export function useGetRecentOrders(){

    return useQuery({
    queryKey: ['admin-status-dashboard-recent-order'],
    queryFn: () => getRecentOrders(),
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}