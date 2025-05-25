import React  from 'react';
import { Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Dropdown from './Dropdown';

interface ToggleButtonProps {
    collapsed: boolean;
    toggleCollapsed: () => void;
  }

const Navbar: React.FC<ToggleButtonProps> = ({collapsed,toggleCollapsed}) => {
    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark " style={{backgroundColor: '#000c18'}}>
            <div className="navbar-brand ps-3">forkway</div>
            <div className='pt-3'>
                <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
            </div >
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div className="input-group">
                    <input className="form-control" type="text" placeholder="Поиск" aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                    <button className="btn btn-primary" id="btnNavbarSearch" type="button">
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </form>
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <Dropdown/>
                </li>
            </ul>
        </nav>
    );
};
export default Navbar;