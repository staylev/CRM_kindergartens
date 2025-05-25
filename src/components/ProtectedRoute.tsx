import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

// Компонент для защиты маршрутов
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { AuthenticatedToken } = useAuthContext();
  
  // Если пользователь не авторизован - редирект на страницу входа
  if (!AuthenticatedToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;