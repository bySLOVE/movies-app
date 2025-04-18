import React, { Component } from 'react';

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
    };

    this.fetchMovies = this.fetchMovies.bind(this);
  }

  componentDidMount() {
    this.fetchMovies(this.state.query);
  }

  async fetchMovies(query) {
    try {
      const movies = await searchMovies(query);
      this.setState({ movies });
    } catch (error) {
      console.log('Ошибка при получении фильмов', error);
    }
  }

  render() {
    return (
      <div className="app-container">
        <Header />
        <MovieList movies={this.state.movies} />
      </div>
    );
  }
}
