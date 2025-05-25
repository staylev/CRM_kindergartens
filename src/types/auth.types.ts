// Интерфейс для данных авторизации
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LogautData {
  refresh_token: string;
}

// Интерфейс ответа от сервера при авторизации
export interface AuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  token_type: string;
}

// // Интерфейс данных пользователя
// export interface User {
//   id: number;
//   email: string;
//   name: string;
// }