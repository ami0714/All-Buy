
import {useQuery} from '@tanstack/react-query';
import {getVariantList} from '../../api/admin/variant';
export function useGetvariants(product_id){

    return useQuery({
    queryKey: ['admin-product_variants',product_id],
    queryFn: ()=> getVariantList(product_id),
    enabled: Boolean(product_id) && Boolean(localStorage.getItem('token')),
    staleTime: 60000,

  });
}