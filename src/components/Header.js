import React, { Component } from 'react';
import { Button, Input } from 'antd';
import './Header.css';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const value = e.target.value;
    this.props.onSearchChange(value);
  }

  render() {
    return (
      <div className="app-header">
        <div className="header-tabs">
          <Button type="link" className="active-tab">
            Search
          </Button>
          <Button type="link">Rated</Button>
        </div>

        <div className="header-search">
          <Input placeholder="Type to search..." onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}
