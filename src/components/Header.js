import React from 'react';
import { Button, Input } from 'antd';
import './Header.css';

const Header = () => {
  return (
    <div className="app-header">
      <div className="header-tabs">
        <Button type="link" className="active-tab">
          Search
        </Button>
        <Button type="link">Rated</Button>
      </div>

      <div className="header-search">
        <Input placeholder="Type to search..." />
      </div>
    </div>
  );
};

export default Header;
