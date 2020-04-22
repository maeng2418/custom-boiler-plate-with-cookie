import React, { useState } from 'react';
import LeftMenu from './Sections/LeftMenu/LeftMenu';
import RightMenu from './Sections/RightMenu/RightMenu';
import { Drawer, Button } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import './NavBar.css';

const NavBar = () => {
  const [visible, setvisible] = useState(false);

  const showDrawer = () => {
    setvisible(true);
  };

  const onClose = () => {
    setvisible(false);
  };

  return (
    <nav className="menuContainer">
      <div className="menuLogo">
        <a href="/" >Logo</a>
      </div>
      <div className="menuLeft">
        <LeftMenu mode="horizontal" />
      </div>
      <div className="menuRight">
        <RightMenu mode="horizontal" />
      </div>
      <Button
        type="primary"
        onClick={showDrawer}
        className="menuMobileButton"
      >
        <MenuFoldOutlined />
      </Button>
      <Drawer
        title="Basic Drawer"
        placement="right"
        className="menuDrawer"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <LeftMenu mode="inline" />
        <RightMenu mode="inline"/>
      </Drawer>
    </nav>
  );
}

export default NavBar;
