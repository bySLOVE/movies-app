import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { Alert, Spin, Pagination } from 'antd';

import Header from './components/Header';
import MovieList from './components/MovieList';
import './App.css';
import { searchMovies } from './api/api';
import EmptyMessage from './components/EmptyMessage';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      query: '',
      loading: false,
      error: null,
      isOnline: navigator.onLine,
      currentPage: 1,
      totalResults: 0,
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.fetchMovies = this.fetchMovies.bind(this);
    this.handleOnlineStatus = this.handleOnlineStatus.bind(this);
    this.debouncedSearch = debounce(this.fetchMovies.bind(this), 1000);
    this.handlePageChange = this.handlePageChange.bind(this);
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

  handleSearchChange(query) {
    this.setState({ query, currentPage: 1, loading: true }, () => {
      this.debouncedSearch(query, 1);
    });
  }

  handlePageChange(page) {
    this.setState({ currentPage: page }, () => {
      this.fetchMovies(this.state.query, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  async fetchMovies(query, page = 1) {
    this.setState({ error: null });

    try {
      const { movies, totalResults } = await searchMovies(query, page);
      this.setState({ movies, totalResults, loading: false });
    } catch (error) {
      this.setState({
        error: 'Не удалось загрузить фильмы. Проверьте подключение.',
        loading: false,
      });
    }
  }

  render() {
    const { loading, movies, error, isOnline, query, currentPage, totalResults } = this.state;

    return (
      <div className="app-container">
        <Header onSearchChange={this.handleSearchChange} />
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
        ) : movies.length > 0 ? (
          <>
            <MovieList movies={movies} />
            <Pagination
              current={currentPage}
              total={totalResults}
              onChange={this.handlePageChange}
              showSizeChanger={false}
              style={{ display: 'flex', justifyContent: 'center' }}
            />
          </>
        ) : query !== '' ? (
          <EmptyMessage />
        ) : null}
      </div>
    );
  }
}
