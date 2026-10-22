import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logUser,registerUser } from '../api/auth'   
import {useAuth} from '../context/authContext';



export function useRegister(){
    return useMutation({
        mutationFn: async (registerData) => {
            const response = await registerUser(registerData)
            if(response.status == true){
                return response
            }
            return response
        },
        onSuccess:()=> {
            alert('berjaya daftar')
        },
        onError:(err) => {
            alert('gagal kerana' + err.message);
        }
    })
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {login} = useAuth()

  return useMutation({
    mutationFn: async (loginData) => {
      const response = await logUser(loginData);
      const token = response?.token || response?.access_token;

      if (token) {
        localStorage.setItem('token', token);
        login(response.user)
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err) => {
      console.error('error mutasi login:', err?.message || err);
    },
  });
}