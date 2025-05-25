import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { ReactNode } from 'react';

// Создаем экземпляр QueryClient с настройками
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Отключаем автоматическое обновление при фокусе окна
    },
  },
});

// Настраиваем axios для автоматического добавления токена к запросам
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Пропсы компонента
interface AuthProviderProps {
  children: ReactNode;
}

// Компонент-провайдер для авторизации
export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}; 