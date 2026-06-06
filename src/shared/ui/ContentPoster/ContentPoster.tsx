import { useState } from 'react';
import { getContentPosterUrl } from '@/shared/lib/tmdbImages';
import './ContentPoster.scss';

interface ContentPosterProps {
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  className?: string;
}

export const ContentPoster = ({
  title,
  posterPath,
  backdropPath,
  className = '',
}: ContentPosterProps) => {
  const [failed, setFailed] = useState(false);
  const url = getContentPosterUrl(posterPath, backdropPath);

  if (!url || failed) {
    return (
      <div className={`content-poster content-poster--placeholder ${className}`.trim()}>
        {title.charAt(0)}
      </div>
    );
  }

  return (
    <img
      className={`content-poster ${className}`.trim()}
      src={url}
      alt={title}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
};
