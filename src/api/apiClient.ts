import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: 'https://kindergarten.umbreella-dev.ru' // Замените на ваш базовый URL
});

// Функция для обновления access token
async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("token_ref");

  console.log("Refresh token:", refreshToken);

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  // Отправляем запрос на обновление токена
  const response = await axios.post(
    "https://kindergarten.umbreella-dev.ru/api/access-token",
    {
      refresh_token: refreshToken,
    }
  );


  const newAccessToken = response.data.access_token;
  // Сохраняем новый access token в localStorage
  localStorage.setItem("token", newAccessToken);
  return newAccessToken;
}

// Интерцептор для добавления access token в каждый запрос
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem('token');

  if (accessToken) {
    // Убедимся, что headers инициализированы
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response, // Если запрос успешен, просто возвращаем ответ
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Если ошибка 403 и это не запрос на обновление токена
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // Помечаем запрос как повторный
      console.log('Попытка обновления токена...');
      try {
        // Обновляем access token
        const newAccessToken = await refreshAccessToken();
        // Обновляем заголовок Authorization с новым токеном
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Повторяем исходный запрос
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Если не удалось обновить токен, выбрасываем ошибку
        throw refreshError;
      }
    }

    // Если это не ошибка 403, пробрасываем ошибку дальше
    throw error;
  }
);

 
export default apiClient;