export interface Content {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  genres: string[];
  genreIds: number[];
  mediaType: 'movie' | 'tv';
  popularity: number;
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface ContentMetrics {
  clickCount: number;
  viewDuration: number;
  lastInteracted: number;
}

export interface ContentPage {
  page: number;
  results: Content[];
  totalPages: number;
  totalResults: number;
}