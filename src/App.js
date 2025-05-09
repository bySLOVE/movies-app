import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { Alert, Spin, Pagination } from 'antd';

import Header from './components/Header';
import MovieList from './components/MovieList';
import './App.css';
import { searchMovies, createGuestSession, fetchGenres, fetchRatedMovies } from './api/api';
import GenresContext from './components/GenresContext';
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
      guestSessionId: null,
      genres: [],
      ratedMovies: [],
      currentTab: 'search',
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.fetchMovies = this.fetchMovies.bind(this);
    this.handleOnlineStatus = this.handleOnlineStatus.bind(this);
    this.debouncedSearch = debounce(this.fetchMovies.bind(this), 1000);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.updateRatedMovieRating = this.updateRatedMovieRating.bind(this);
  }

  componentDidMount() {
    createGuestSession()
      .then((guestSessionId) => {
        this.setState({ guestSessionId });
      })
      .catch((error) => {
        console.log('Ошибка при создании сессии:', error);
      });
    this.loadGenres();

    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
  }

  handleSearchChange(query) {
    this.setState({ query, currentPage: 1 });
    if (query.trim() === '') {
      this.debouncedSearch.cancel();
      this.setState({ movies: [], totalResults: 0, loading: false });
      return;
    }
    this.setState({ loading: true }, () => {
      this.debouncedSearch(query, 1);
    });
  }

  handlePageChange(page) {
    this.setState({ currentPage: page }, () => {
      this.fetchMovies(this.state.query, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  handleTabChange(tab) {
    const { currentTab, query, currentPage } = this.state;
    if (tab === currentTab) return;
    this.setState({ currentTab: tab }, () => {
      if (tab === 'search' && query.trim() !== '') {
        this.fetchMovies(query, currentPage);
      } else if (tab === 'rated') {
        this.fetchRatedMovies(); // <-- всегда обновляем
      }
    });
  }

  handleOnlineStatus() {
    this.setState({ isOnline: navigator.onLine });
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

  async fetchRatedMovies() {
    const { guestSessionId } = this.state;
    if (!guestSessionId) return;
    this.setState({ loading: true, error: null });

    try {
      const ratedMovies = await fetchRatedMovies(guestSessionId);
      this.setState({ movies: ratedMovies, loading: false });
    } catch (error) {
      this.setState({
        error: 'Не удалось загрузить оценненые фильмы',
        loading: false,
      });
    }
  }

  async loadGenres() {
    try {
      const genres = await fetchGenres();
      this.setState({ genres });
    } catch (error) {
      this.setState({ error: 'Ошибка при загрузке жанров' });
    }
  }

  updateRatedMovieRating(movieId, rating) {
    this.setState((prevState) => {
      // Обновляем только рейтинг нужного фильма
      const updatedMovies = prevState.movies.map((movie) => (movie.id === movieId ? { ...movie, rating } : movie));
      return { movies: updatedMovies };
    });
  }

  render() {
    const { loading, movies, error, isOnline, currentPage, totalResults, genres, guestSessionId, currentTab, query } =
      this.state;
    return (
      <GenresContext.Provider value={genres}>
        <div className="app-container">
          <Header
            onSearchChange={this.handleSearchChange}
            onTabChange={this.handleTabChange}
            currentTab={currentTab}
            query={query}
          />
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
            <>
              {currentTab === 'search' && (
                <>
                  {query && movies.length === 0 ? (
                    <EmptyMessage />
                  ) : (
                    <>
                      <MovieList
                        movies={movies}
                        guestSessionId={guestSessionId}
                        onRated={this.updateRatedMovieRating}
                      />
                      {query && totalResults > 0 && (
                        <Pagination
                          current={currentPage}
                          total={totalResults}
                          onChange={this.handlePageChange}
                          showSizeChanger={false}
                          style={{ display: 'flex', justifyContent: 'center' }}
                        />
                      )}
                    </>
                  )}
                </>
              )}

              {currentTab === 'rated' && (
                <>
                  {movies.length === 0 ? (
                    <EmptyMessage />
                  ) : (
                    <MovieList movies={movies} guestSessionId={guestSessionId} onRated={this.updateRatedMovieRating} />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </GenresContext.Provider>
    );
  }
}
