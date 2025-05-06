import React, { Component } from 'react';

import MovieCard from './MovieCard';
import './MovieList.css';

export default class MovieList extends Component {
  render() {
    const { movies, guestSessionId, onRated } = this.props;
    return (
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movieId={movie.id}
            title={movie.title}
            poster={movie.poster}
            overview={movie.overview}
            releaseDate={movie.releaseDate}
            genre_ids={movie.genre_ids}
            vote_average={movie.vote_average}
            rating={movie.rating}
            guestSessionId={guestSessionId}
            onRated={onRated}
            userRating={movie.rating}
          />
        ))}
      </div>
    );
  }
}
