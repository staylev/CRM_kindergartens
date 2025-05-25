import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  AuthenticatedToken: string | null;
  setIsAuthenticatedToken: (value: string | null) => void;
}

// Создаем контекст авторизации
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контекста авторизации
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Проверяем наличие токена при загрузке
  const [AuthenticatedToken, setIsAuthenticatedToken] = useState(() => {
    const token = localStorage.getItem('token');
    return token;
  });

  return (
    <AuthContext.Provider value={{ AuthenticatedToken, setIsAuthenticatedToken }}>
      {children}
    </AuthContext.Provider>
  );
};
// Хук для использования контекста авторизации
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext должен использоваться внутри AuthProvider');
  }
  return context;
};
