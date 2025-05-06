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

// Обработка ошибок
const handleError = (response) => {
  console.error('API Error:', response.statusText);
  throw new Error(`Ошибка: ${response.statusText} (${response.status})`);
};

// Запрос жанров
export async function fetchGenres() {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  if (!response.ok) handleError(response);
  const data = await response.json();
  return data.genres;
}

// Поиск фильмов
export const searchMovies = async (query, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );

  if (!response.ok) handleError(response);

  const data = await response.json();
  const movies = data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
    overview: movie.overview,
    releaseDate: formatDate(movie.release_date),
    genre_ids: movie.genre_ids,
    vote_average: movie.vote_average,
  }));

  return {
    movies,
    totalResults: data.total_results,
  };
};

// Создание гостевой сессии
export const createGuestSession = async () => {
  const response = await fetch(`${BASE_URL}/authentication/guest_session/new?api_key=${API_KEY}`);
  if (!response.ok) handleError(response);
  const data = await response.json();
  return data.guest_session_id;
};

// Оценка фильма
export const rateMovie = async (movieId, guestSessionId, rating) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ value: rating }),
    }
  );

  if (!response.ok) handleError(response);

  return await response.json();
};

// Получение оцененных фильмов
export const fetchRatedMovies = async (guestSessionId) => {
  const response = await fetch(`${BASE_URL}/guest_session/${guestSessionId}/rated/movies?api_key=${API_KEY}`);
  if (!response.ok) handleError(response);

  const data = await response.json();
  return data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
    overview: movie.overview,
    releaseDate: formatDate(movie.release_date),
    genre_ids: movie.genre_ids,
    vote_average: movie.vote_average,
    rating: movie.rating,
  }));
};
