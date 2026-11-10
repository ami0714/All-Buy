import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query";
import {getAllCourierAdmin,getAllshippingMethodAdmin,addNewCourierAdmin,addNewShippingMethod,updateStatus} from "../../api/admin/shipping";

  

export function useGetAllCourierAdmin(){
    return useQuery({
        queryKey: ['admin-courier'],
        queryFn: getAllCourierAdmin,
        staleTime: 60000,
    });
}

export function useGetAllShippingMethodAdmin(){
    return useQuery({
        queryKey: ['admin-shipping-method'],
        queryFn: getAllshippingMethodAdmin,
        staleTime: 60000,
    });
}

export function useAddNewCourierAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (courierData) => addNewCourierAdmin(courierData),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-courier']);
        },
        onError: (error) => {
            alert(error || 'Unable to add new courier.');
        }
    });
}

export function useAddShipMethod(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:(shippingData) => addNewShippingMethod(shippingData),
        onSuccess:()=>{
            queryClient.invalidateQueries(['admin-shipping-method'])
        },
        onError: (error) => {
            alert(error || 'Unable to add new method.');
        }
    })
}


export function useUpdateStatus(){
   const queryClient = useQueryClient();

   return useMutation({
    mutationFn: async ({statusVal,courier_id})=>{
      const res = await updateStatus(statusVal,courier_id)
      return res
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['admin-courier']});
    },
    onError:(err)=>{
      alert(err.message || 'Unable to update courier status.')
    }
   })
}
