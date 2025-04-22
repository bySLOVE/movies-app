import React, { Component } from 'react';
import { Alert, Spin } from 'antd';

import Header from './components/Header';
import MovieList from './components/MovieList';
import './App.css';
import { searchMovies } from './api/api';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      query: 'return',
      loading: false,
      error: null,
      isOnline: navigator.onLine,
    };

    this.fetchMovies = this.fetchMovies.bind(this);
    this.handleOnlineStatus = this.handleOnlineStatus.bind(this);
  }

  componentDidMount() {
    this.fetchMovies(this.state.query);

    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
  }

  handleOnlineStatus() {
    this.setState({ isOnline: navigator.onLine });
  }

  async fetchMovies(query) {
    this.setState({ loading: true, error: null });

    try {
      const movies = await searchMovies(query);
      this.setState({ movies, loading: false });
    } catch (error) {
      console.log('Ошибка при получении фильмов', error);
      this.setState({ error: 'Не удалось загрузить фильмы. Проверьте подключение.', loading: false });
    }
  }

  render() {
    const { loading, movies, error, isOnline } = this.state;

    return (
      <div className="app-container">
        <Header />
        {!isOnline && (
          <div style={{ margin: '20px auto', maxWidth: '600px' }}>
            <Alert
              message="Нет подключения к интернету"
              description="Проверьте сеть и попробуйте снова."
              type="warning"
              showIcon
            />
          </div>
        )}
        {error && (
          <div style={{ margin: '20px auto', maxWidth: '600px' }}>
            <Alert message="Ошибка" description={error} type="error" showIcon />
          </div>
        )}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <MovieList movies={movies} />
        )}
      </div>
    );
  }
}
