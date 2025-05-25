import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { LoginCredentials } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { setIsAuthenticatedToken } = useAuthContext();

  const nav = useNavigate();
  // Мутация для входа в систему
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('token_ref', data.refresh_token);
      queryClient.setQueryData(['user'], data);
      setIsAuthenticatedToken(data.access_token);
      nav("/"); 
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        // Handle 401 error (Unauthorized)
        console.error("Unauthorized access - redirecting to login");
        // Assuming you're using react-router, you might need to import useNavigate
        const navigate = useNavigate();
        navigate('/login'); // Redirect to login page
      }
    },
  });

  // Мутация для выхода из системы
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Удаляем токен из localStorage
      localStorage.removeItem('token');
      
      queryClient.setQueryData(['user'], null);
    },
  });

  // Возвращаем объект с методами и состоянием авторизации
  return {
    // user,
    // isUserLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    loginError: loginMutation.error,
  };
}; 