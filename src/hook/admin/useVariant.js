
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {getVariantList,updateVariant,addVariant} from '../../api/admin/variant';
export function useGetvariants(product_id){

    return useQuery({
    queryKey: ['admin-product_variants',product_id],
    queryFn: ()=> getVariantList(product_id),
    enabled: Boolean(product_id) && Boolean(localStorage.getItem('token')),
    staleTime: 60000,

  });
}

export function useUpdateVariant(){
  const queryClient = useQueryClient();
   
  return useMutation({
    mutationFn: ({variant_id,data}) => updateVariant(variant_id,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product_variants'] });
    },
    onError: (error) => {
      alert('Unable to update variant:', error);
    }
  });
}

export function useAddVariant(){
  const queryClient = useQueryClient();
   
  return useMutation({
    mutationFn: ({product_id,data}) => addVariant(product_id,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product_variants'] });
    },
    onError: (error) => {
      alert('Unable to add variant:', error);
    }
  });

}