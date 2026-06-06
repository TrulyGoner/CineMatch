import './WhyRecommended.scss';

interface WhyRecommendedProps {
  reasons: string[];
  compact?: boolean;
}

const INTEREST_PREFIX = 'На основе вашего интереса к:';

const parseReason = (
  reason: string
): { type: 'interest'; genres: string[] } | { type: 'text'; text: string } => {
  if (reason.startsWith(INTEREST_PREFIX)) {
    const genres = reason
      .slice(INTEREST_PREFIX.length)
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);
    return { type: 'interest', genres };
  }
  return { type: 'text', text: reason };
};

export const WhyRecommended = ({ reasons, compact = false }: WhyRecommendedProps) => (
  <div className={`why-recommended ${compact ? 'why-recommended--compact' : ''}`}>
    {reasons.map((reason) => {
      const parsed = parseReason(reason);

      if (parsed.type === 'interest') {
        return (
          <div key={reason} className="why-recommended__block">
            <span className="why-recommended__label">На основе интереса к</span>
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
