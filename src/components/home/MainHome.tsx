import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const LayoutHome: React.FC = () => {
    const [collapsed, setCollapsed] = useState(window.innerWidth <= 430);
    const navigate = useNavigate();
    const location = useLocation();

    // Соответствие между путями и ключами меню
    const pathToKeyMap: Record<string, string> = {
        '/kindergartens': '1',
        '/groups': '2',
        '/childrens': '3',
        '/events': '4',
        '/parents': '5',
        '/visiting': '6',
        '/finance': '7',
        '/reports': '8',
    };

    // Получаем текущий ключ меню на основе пути
    const getCurrentMenuKey = () => {
        const basePath = Object.keys(pathToKeyMap).find(path => 
            location.pathname.startsWith(path)
        );
        return basePath ? pathToKeyMap[basePath] : '1';
    };

    const [selectedKey, setSelectedKey] = useState(getCurrentMenuKey());

    // Обновляем ключ при изменении пути
    useEffect(() => {
        setSelectedKey(getCurrentMenuKey());
    }, [location.pathname]);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    // Обработчик выбора пункта меню
    const handleMenuSelect = (key: string) => {
        setSelectedKey(key);
        const path = Object.keys(pathToKeyMap).find(
            path => pathToKeyMap[path] === key
        ) || '/kindergartens';
        navigate(path);
    };

    // Обработчик изменения размера окна
    useEffect(() => {
        const handleResize = () => {
            setCollapsed(window.innerWidth <= 430);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="sb-nav-fixed" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <Navbar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
            <div id="layoutSidenav" style={{ 
                display: 'flex', 
                flex: 1, 
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div id="layoutSidenav_nav" style={{ 
                    width: collapsed ? '80px' : '200px',
                    flexShrink: 0,
                    height: '100%',
                    overflowY: 'hidden',
                    overflowX: 'hidden',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    backgroundColor: '#f8f9fa' // добавьте фон по необходимости
                }}>
                    <Sidebar
                        collapsed={collapsed}
                        onSelect={handleMenuSelect}
                        selectedKey={selectedKey}
                    />
                </div>
                <div id="layoutSidenav_content" style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px',
                    marginLeft: collapsed ? '80px' : '200px',
                    transition: 'margin-left 0.2s ease-in-out',
                }}>
                    <Outlet /> {/* Рендерим дочерние роуты */}
                </div>
            </div>
        </div>
    );
};
export default LayoutHome;