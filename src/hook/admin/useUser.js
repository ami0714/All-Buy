import {getUserState,getUserList} from '../../api/admin/user';
import {useQuery} from '@tanstack/react-query';


export function useUser(){

    return useQuery({
        queryKey: ['admin-user-state'],
        queryFn: ()=>getUserState(),
        enabled: !!localStorage.getItem('token'),
        staleTime: 60000,
    
      });
}

export function useUserList(){

    return useQuery({
        queryKey: ['admin-user-lidt'],
        queryFn: ()=>getUserList(),
        enabled: !!localStorage.getItem('token'),
        staleTime: 60000,
    
      });
}

