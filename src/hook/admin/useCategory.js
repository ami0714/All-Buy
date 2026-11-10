import {getCategory,addCategory,updateCategory} from '../../api/admin/category';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
export function useGetcategory(){

    return useQuery({
    queryKey: ['admin-category'],
    queryFn: getCategory,
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}

export function useAddCategory() {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => addCategory(body),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-category']);
    },
    onError: (error) => {
      alert(error || 'Unable to add category.');
    }
  });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({body,category_id}) => updateCategory(category_id, body),
    onSuccess: () => {

      queryClient.invalidateQueries(['admin-category']);
    },
    onError: (error) => {
      alert(error || 'Unable to update category.');
    }
  });
}