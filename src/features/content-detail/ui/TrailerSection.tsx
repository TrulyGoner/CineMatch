import { useTranslation } from 'react-i18next';
import type { TmdbVideo } from '@/features/content-discovery/api/videos';
import './TrailerSection.scss';

interface TrailerSectionProps {
  videos: TmdbVideo[];
}

export const TrailerSection = ({ videos }: TrailerSectionProps) => {
  const { t } = useTranslation();
  const trailer = videos[0];
  if (!trailer) return null;

  return (
    <div className="trailer-section">
      <h4 className="trailer-section__title">{t('detail.trailer')}</h4>
      <div className="trailer-section__embed">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
          title={trailer.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="trailer-section__iframe"
        />
      </div>
    </div>
  );
};
