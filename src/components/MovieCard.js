import React, { Component } from 'react';
import { Card, Image, Rate } from 'antd';
import './MovieCard.css';

const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength);
  return trimmed.slice(0, trimmed.lastIndexOf(' ')) + '...';
};

export default class MovieCard extends Component {
  render() {
    const { title, poster, overview, releaseDate, genres, rating } = this.props;
    return (
      <Card hoverable className="movie-card">
        <div className="movie-rating-circle">{rating}</div>
        <div className="movie-card-content">
          <div className="movie-card-poster">
            <Image
              alt={title}
              src={poster}
              fallback="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg" //заглушка
              preview={false}
              className="movie-card-poster"
            />
          </div>
          <div className="movie-card-info">
            <div className="movie-card-details">
              <h2 className="movie-title">{title}</h2>
              <p className="movie-date">{releaseDate}</p>
              <div className="movie-genres">
                {genres.map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
              <p className="movie-overview">{truncateText(overview, 200)}</p>
            </div>
            <Rate
              allowHalf
              disabled
              defaultValue={rating / 1}
              count={10}
              className="movie-rating-stars"
              style={{ fontSize: 18 }}
            />
          </div>
        </div>
      </Card>
    );
  }
}
