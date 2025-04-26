import React, { Component } from 'react';
import { Empty } from 'antd';

export default class EmptyMessage extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '18px' }}>
        <Empty description="Фильмы не найдены" />
      </div>
    );
  }
}
