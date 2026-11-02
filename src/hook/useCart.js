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
      alert('Item added to cart successfully.')
    },
    onError:(err)=>{
      alert('Unable to add item to cart.')
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
      alert('Cart item removed successfully.')
    },
    onError:(err)=>{
      alert('Unable to remove cart item: ' + err)
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
      alert('Unable to update cart item quantity.')
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
