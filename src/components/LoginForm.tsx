import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Alert  } from "antd";

const LoginForm = () => {
  // Локальное состояние для полей формы
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Получаем методы и состояние из хука авторизации
  const { login, isLoginLoading, loginError } = useAuth();

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password }); // Дождитесь завершения login
  // Навигация после успешного выполнения
    } catch (error) {
      console.error("Ошибка при входе:", error);
    }
  };
  return (
    <div className="card shadow-lg border-0 rounded-lg mt-5">
      <div className="card-header">
        <h3 className="text-center font-weight-light my-4">Авторизация</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="form-floating mb-3">
            <input
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              name="username"
              value={username}
              placeholder="username"
              required
            />
            <label htmlFor="inputEmail">Имя пользователя</label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <label htmlFor="inputPassword">Пароль</label>
          </div>

          {loginError && (
            <div className="text-red-500 text-sm">
              <Alert
                message="Ошибкка авторизации"
                description=  {loginError.message || "Произошла ошибка при входе"}
                type="error"
                showIcon
              />
            </div>
          )}

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              id="inputRememberPassword"
              type="checkbox"
              value=""
            />
            <label className="form-check-label" htmlFor="inputRememberPassword">
              Запомнить пароль
            </label>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
            <a className="small" href="password.html">
              Забыли пароль?
            </a>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isLoginLoading}
            >
              Войти
            </button>
          </div>
        </div>
        <div className="card-footer text-center py-3"></div>
      </form>
    </div>
  );
};

export default LoginForm;
