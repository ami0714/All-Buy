import {getCategory} from '../../api/admin/category';
import {useQuery} from '@tanstack/react-query';
export function useGetcategory(){

    return useQuery({
    queryKey: ['admin-category'],
    queryFn: getCategory,
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });
}