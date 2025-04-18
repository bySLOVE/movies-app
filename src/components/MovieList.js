import React, { Component } from 'react';

import MovieCard from './MovieCard';
import './MovieList.css';

export default class MovieList extends Component {
  render() {
    const { movies } = this.props;
    return (
      <div className="movie-list">
        {movies.map((movie, id) => (
          <MovieCard
            key={id}
            title={movie.title}
            poster={movie.poster}
            overview={movie.overview}
            releaseDate={movie.releaseDate}
            genres={movie.genres || []}
            rating={movie.rating}
          />
        ))}
      </div>
    );
  }
}
