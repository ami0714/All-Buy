import {useQuery,useMutation} from '@tanstack/react-query';
import {getUserAddress} from '../api/address';
import {addAddress,editAddress,getUserAddressByid} from '../api/address';

export function useGetAddress(){

    return useQuery({
    queryKey: ['userAddress'],
    queryFn: getUserAddress,
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}

export function useGetAddressById(addressId){

    return useQuery({
    queryKey: ['userAddress',addressId],
    queryFn:()=> getUserAddressByid(addressId),
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}

export  function useAddAddress(){

   return useMutation({
    mutationFn: async (body)=>{
      const res = await addAddress(body)
      return res
    },
    onSuccess:()=>{
      alert('berjaya tambah alamat')
    },
    onError:(err)=>{
      alert('error tambah alamat')
    }
   })
}


export function useEditAddress(){

   return useMutation({
    mutationFn: async ({body,id})=>{
      const res = await editAddress(body,id)
      return res
    },
    onSuccess:()=>{
      alert('berjaya edit alamat')
    },
    onError:(err)=>{
      alert('error edit alamat')
    }
   })
}