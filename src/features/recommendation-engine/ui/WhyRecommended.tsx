import { useTranslation } from 'react-i18next';
import './WhyRecommended.scss';

const INTEREST_MARKER = '__interest__:';

interface WhyRecommendedProps {
  reasons: string[];
  compact?: boolean;
}

const parseReason = (
  reason: string
): { type: 'interest'; genres: string[] } | { type: 'text'; text: string } => {
  if (reason.startsWith(INTEREST_MARKER)) {
    const genres = reason
      .slice(INTEREST_MARKER.length)
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);
    return { type: 'interest', genres };
  }
  return { type: 'text', text: reason };
};

export const WhyRecommended = ({ reasons, compact = false }: WhyRecommendedProps) => {
  const { t } = useTranslation();

  return (
    <div className={`why-recommended ${compact ? 'why-recommended--compact' : ''}`}>
      {reasons.map((reason) => {
        const parsed = parseReason(reason);

        if (parsed.type === 'interest') {
          return (
            <div key={reason} className="why-recommended__block">
              <span className="why-recommended__label">{t('whyRecommended.interestPrefix')}</span>
              <div className="why-recommended__genres">
                {parsed.genres.map((genre) => (
                  <span key={genre} className="why-recommended__genre">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          );
        }

        return (
          <span key={reason} className="why-recommended__text">
            {parsed.text}
          </span>
        );
      })}
    </div>
  );
};
