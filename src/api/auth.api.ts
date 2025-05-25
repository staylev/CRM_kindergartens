import axios, { AxiosError } from 'axios'; 
import { LoginCredentials, AuthResponse } from '../types/auth.types';
import apiClient from './apiClient'
import { useNavigate } from 'react-router-dom';

const CHECK_ACCESS_INTERVAL = 180000; // Check every 30 seconds


const checkAccessToken = async () => {
  try {
    const response = await apiClient.post('/api/check-access');
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      await refreshAccessToken();
      return false; // Token is invalid
    }
    throw new Error('Error checking access token');
  }
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('token_ref');

  console.log('Refresh token:', refreshToken);

  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  try {
    const response = await axios.post('https://kindergarten.umbreella-dev.ru/api/access-token', {
      refresh_token: refreshToken,
    });
    return response.data; // Возвращаем данные, если запрос успешен
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response && axiosError.response.status === 400) {
      console.error('Ошибка 400: Неверный запрос', axiosError.response.data);
      localStorage.removeItem('token');
      localStorage.removeItem('token_ref');
      let location = useNavigate()  
      location('/login');
    } else {
      console.error('Произошла ошибка:', axiosError.message);
    }
    throw axiosError; // Пробрасываем ошибку дальше, если нужно
  }
};
  export const startAccessTokenCheck = () => {
  const checkToken = async () => {
    const isValid = await checkAccessToken();
    if (isValid) {
      setTimeout(checkToken, CHECK_ACCESS_INTERVAL); // Wait and check again
    } else {
      try {
        const newToken = await refreshAccessToken();
        localStorage.setItem('token', newToken);
        setTimeout(checkToken, CHECK_ACCESS_INTERVAL); // Wait and check again
      } catch (error) {
        // Clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('token_ref');
        let location = useNavigate()  
        location('/login');
      }
    }
  };

  checkToken(); // Start checking the token
};

export const authApi = {
  // Метод для входа в систему
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>(
        `/api/login`,
        credentials
      );
      localStorage.setItem('user_credentials', JSON.stringify(credentials));
      return data;
    } catch (error) {
      // Обработка ошибок
      if (axios.isAxiosError(error)) {
        // Ошибка Axios (сетевая ошибка или ошибка сервера)
        if (error.response) {
          // Ошибка с ответом от сервера (например, 400 или 500)
          if (error.response.status === 401) {
            // Обработка 401 ошибки
            throw new Error('Неверные учетные данные. Пожалуйста, попробуйте снова.');
          }
          throw new Error(
            `Ошибка сервера: ${error.response.status} - ${error.response.data.message}`
          );
        } else if (error.request) {
          // Ошибка запроса (например, нет ответа от сервера)
          throw new Error('Нет ответа от сервера. Проверьте подключение к интернету.');
        } else {
          // Другие ошибки Axios
          throw new Error(`Ошибка при выполнении запроса: ${error.message}`);
        }
      } else {
        // Другие ошибки (например, ошибка в коде)
        throw new Error('Неизвестная ошибка при выполнении запроса.');
      }
    }
  },
  async logout(): Promise<void> {
    await apiClient.post(`/api/logout`, {
      refresh_token: localStorage.getItem('token_ref'),
    });
  },

};