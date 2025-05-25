import React from 'react';
import { SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../contexts/AuthContext';

const App: React.FC = () => {
  const { logout } = useAuth();

  const { setIsAuthenticatedToken } = useAuthContext();

  function handleLogout() {
    logout();
    setIsAuthenticatedToken(null);
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Admin',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Профиль',
    },
    {
      key: '3',
      label: 'Настройки',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      danger: true,
      label: 'Выйти',
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <div className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="fas fa-user fa-fw"></i>
          </div>
        </Space>
      </a>
    </Dropdown>
  );
};

export default App;