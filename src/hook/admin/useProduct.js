import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {getProductList,updateStatus,getProductDetail,updateProduct,addProduct} from '../../api/admin/product';

export function useGetProductList(status){

    return useQuery({
    queryKey: ['admin-all-product',status],
    queryFn: ()=>getProductList(status),
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}





export function useUpdateStatus(){
   const queryClient = useQueryClient();

   return useMutation({
    mutationFn: async ({statusVal,product_id})=>{
      const res = await updateStatus(statusVal,product_id)
      return res
    },
    onSuccess:()=>{
      alert('Product status updated successfully.')
    },
    onError:(err)=>{
      alert(err.message || 'Unable to update product status.')
    },
    onSettled:()=>{
      queryClient.invalidateQueries({queryKey: ['admin-all-product']})
    }
   })
}

export function useGetProductDetail(product_id){

    return useQuery({
    queryKey: ['admin-detail-product',product_id],
    queryFn: ()=>getProductDetail(product_id),
    enabled: Boolean(product_id) && Boolean(localStorage.getItem('token')),
    staleTime: 60000,

  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, changed }) => updateProduct(productId, changed),
    onSuccess: (_response, { productId }) => {
      alert('Product updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-detail-product', productId] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-product'] });
    },
    onError: (error) => {
      alert(error.message || 'Unable to update product.');
    },
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ( body ) => addProduct(body),
    onSuccess: () => {
      alert('Product added successfully.');
     
      queryClient.invalidateQueries({ queryKey: ['admin-all-product'] });
    },
    onError: (error) => {
      alert(error.message || 'Unable to add product.');
    },
  });
}
