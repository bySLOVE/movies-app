import React, { Component } from 'react';
import { Button, Input } from 'antd';
import './Header.css';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(tab) {
    this.props.onTabChange(tab);
  }

  handleChange(e) {
    const value = e.target.value;
    this.props.onSearchChange(value);
  }

  render() {
    const { currentTab, query } = this.props;

    return (
      <div className="app-header">
        <div className="header-tabs">
          <Button
            type="link"
            className={currentTab === 'search' ? 'active-tab' : ''}
            onClick={() => this.handleTabChange('search')}
          >
            Search
          </Button>
          <Button
            type="link"
            className={currentTab === 'rated' ? 'active-tab' : ''}
            onClick={() => this.handleTabChange('rated')}
          >
            Rated
          </Button>
        </div>
        {currentTab === 'search' && (
          <div className="header-search">
            <Input placeholder="Type to search..." onChange={this.handleChange} value={query} />
          </div>
        )}
      </div>
    );
  }
}
