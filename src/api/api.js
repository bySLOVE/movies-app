import { format } from 'date-fns';

const API_KEY = 'a0c29512a2cf1c191a1be4dad4fb0d9f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

//форматируем дату
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'MMMM d, yyyy');
};

export const searchMovies = async (query, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );

  if (!response.ok) {
    throw new Error(`Ошибка HTTP: ${response.status}`);
  }

  const data = await response.json();
  const movies = data.results.map((movie) => ({
    title: movie.title,
    poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
    overview: movie.overview,
    releaseDate: formatDate(movie.release_date),
    genres: ['Action', 'Drama'],
    rating: Number(movie.vote_average.toFixed(1)),
  }));

  return {
    movies,
    totalResults: data.total_results,
  };
};
