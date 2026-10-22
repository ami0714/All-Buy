import {getAllCourier} from '../api/shipping';
import {useQuery} from '@tanstack/react-query';

export function useGetCourier(){

    return useQuery({
    queryKey: ['courier-shipping'],
    queryFn: getAllCourier,
    staleTime: 60000,

  });
}