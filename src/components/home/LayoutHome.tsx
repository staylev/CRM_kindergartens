import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// Извлекаем компонент Sider из Layout для создания боковой панели
const { Sider } = Layout;

/**
 * Компонент LayoutHome - основной макет домашней страницы
 * Управляет состоянием сворачивания/разворачивания сайдбара
 */
const LayoutHome: React.FC = () => {
  // Состояние для отслеживания свернутого/развернутого состояния сайдбара
  const [collapsed, setCollapsed] = useState(false);

  // Функция для переключения состояния сайдбара
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Боковая панель с возможностью сворачивания */}
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <Sidebar
          collapsed={collapsed}
          onSelect={(key) => console.log(key)} // Обработчик выбора пункта меню
          selectedKey={""}        />
      </Sider>

      {/* Верхняя панель навигации с кнопкой управления сайдбаром */}
      <Navbar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
    </Layout>
  );
};

export default LayoutHome;
