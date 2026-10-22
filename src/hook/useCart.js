import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import {addToCart,getUserCart,deleteCartItem,changeQuantityeCartItem} from '../api/cart';


export function useToCart(){
  const queryClient = useQueryClient();

   return useMutation({
    mutationFn: async (body)=>{
      const res = await addToCart(body)
      return res
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userCart'] });
      alert('berjaya tambah ke dalam car')
    },
    onError:(err)=>{
      alert('err tambah cart')
    }
   })
}
export function useDeleteCart(){
  const queryClient = useQueryClient();

   return useMutation({
    mutationFn: async (cartId)=>{
      const res = await deleteCartItem(cartId)
      return res
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userCart'] });
      alert('berjaya delete item cart')
    },
    onError:(err)=>{
      alert('err delete cart'+err)
    }
   })
}
export function useChangeQuantityCart(){
  const queryClient = useQueryClient();

   return useMutation({
    mutationFn: async ({cartId,payload})=>{
      const res = await changeQuantityeCartItem(cartId,payload)
      return res
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userCart'] });
    },
    onError:(err)=>{
      alert('err tukar kuantiti cart')
    }
   })
}

export function useGetCart(){

    return useQuery({
    queryKey: ['userCart'],
    queryFn: getUserCart,
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}
