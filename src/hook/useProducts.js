import {getAllProduct,getDetailProduct} from '../api/products';
import {useQuery} from '@tanstack/react-query';



export function useGetAllProduct(){

return useQuery({
    queryKey: ['all-product'],
  queryFn: getAllProduct,
    staleTime: 60000,

  });

}

export function useGetDetailProduct(slug){

return useQuery({
    queryKey: ['all-product',slug],
  queryFn: () => getDetailProduct(slug),
    staleTime: 60000,

  });

}