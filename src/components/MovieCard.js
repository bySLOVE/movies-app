import React, { Component } from 'react';
import { Card, Image, Rate } from 'antd';

import { rateMovie } from '../api/api';

import GenresContext from './GenresContext';

import './MovieCard.css';

const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength);
  return trimmed.slice(0, trimmed.lastIndexOf(' ')) + '...';
};

export default class MovieCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRating: props.userRating || 0,
    };
    this.handleRate = this.handleRate.bind(this);
  }

  getRatingClass(rating) {
    if (rating === null || rating === undefined) return 'rating-low';
    if (rating <= 3) return 'rating-low';
    if (rating > 3 && rating <= 5) return 'rating-medium-low';
    if (rating > 5 && rating <= 7) return 'rating-medium';
    return 'rating-high';
  }

  handleRate(value) {
    const { guestSessionId, movieId, onRated } = this.props;
    console.log('Отправляем данные:', { movieId, guestSessionId, value });
    try {
      rateMovie(movieId, guestSessionId, value);
      this.setState({ userRating: value });
      if (onRated) {
        onRated(movieId, value);
      }
    } catch (error) {
      console.error('Ошибка при отправке рейтинга:', error);
    }
  }

  render() {
    const { title, poster, overview, releaseDate, genre_ids = [], vote_average } = this.props;
    const { userRating } = this.state;

    return (
      <GenresContext.Consumer>
        {(genres) => {
          const genreNames = genre_ids.map((id) => {
            const genre = genres.find((g) => g.id === id);
            return genre ? genre.name : 'Unknown';
          });

          return (
            <Card hoverable className="movie-card">
              <div className={`movie-rating-circle ${this.getRatingClass(vote_average || 0)}`}>
                {(vote_average || 0).toFixed(1)}
              </div>
              <div className="movie-card-content">
                <div className="movie-card-poster">
                  <Image
                    alt={title}
                    src={poster}
                    fallback="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                    preview={false}
                    className="movie-card-poster"
                  />
                </div>
                <div className="movie-card-info">
                  <div className="movie-card-details">
                    <h2 className="movie-title">{title}</h2>
                    <p className="movie-date">{releaseDate}</p>
                    <div className="movie-genres">
                      {genreNames.map((genre, index) => (
                        <span key={index} className="genre-tag">
                          {genre}
                        </span>
                      ))}
                    </div>
                    <p className="movie-overview">{truncateText(overview, 200)}</p>
                  </div>
                  <Rate
                    allowHalf
                    value={userRating || 0}
                    count={10}
                    className="movie-rating-stars"
                    style={{ fontSize: 18 }}
                    onChange={this.handleRate}
                  />
                </div>
              </div>
            </Card>
          );
        }}
      </GenresContext.Consumer>
    );
  }
}
