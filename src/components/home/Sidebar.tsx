import React from 'react';
import { Menu } from 'antd';

import {
  UsergroupAddOutlined,
  HomeOutlined,
  UserOutlined,
  BulbOutlined,
  LineChartOutlined,
  BankOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

/**
 * Интерфейс пропсов компонента Sidebar
 */
interface SidebarProps {
  collapsed: boolean;
  onSelect: (key: string) => void;
  selectedKey: string; // Добавляем обязательное свойство
}
/**
 * Пункты меню сайдбара
 */
const items = [
  { key: '1', icon: <HomeOutlined />, label: 'Детские сады' },
  { key: '2', icon: <UsergroupAddOutlined />, label: 'Группы' },
  { key: '3', icon: <UserOutlined />, label: 'Дети' },
  { key: '4', icon: <BulbOutlined />, label: 'Мероприятия' },
  { key: '5', icon: <UserOutlined />, label: 'Родители' },
  { key: '6', icon: <LineChartOutlined />, label: 'Посещения' },
  { key: '7', icon: <BankOutlined />, label: 'Финансы' },
  { key: '8', icon: <BarChartOutlined />, label: 'Отчеты' },
]
/**
 * Компонент бокового меню
 */
const Sidebar: React.FC<SidebarProps> = ({ collapsed, onSelect, selectedKey }) => {
  return (
    <div className='pt-5 min-vh-100' style={{
      width: collapsed ? 80 : 216,
      backgroundColor: '#000c18'
    }}>
      <Menu
        selectedKeys={[selectedKey]} // Используем переданный ключ
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        onSelect={({key}) => onSelect(key)}
      />
    </div>
  );
};

export default Sidebar;