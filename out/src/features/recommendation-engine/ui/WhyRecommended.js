import { useTranslation } from 'react-i18next';
import './WhyRecommended.scss';
const INTEREST_MARKER = '__interest__:';
const parseReason = (reason) => {
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
export const WhyRecommended = ({ reasons, compact = false }) => {
    const { t } = useTranslation();
    return (React.createElement("div", { className: `why-recommended ${compact ? 'why-recommended--compact' : ''}` }, reasons.map((reason) => {
        const parsed = parseReason(reason);
        if (parsed.type === 'interest') {
            return (React.createElement("div", { key: reason, className: "why-recommended__block" },
                React.createElement("span", { className: "why-recommended__label" }, t('whyRecommended.interestPrefix')),
                React.createElement("div", { className: "why-recommended__genres" }, parsed.genres.map((genre) => (React.createElement("span", { key: genre, className: "why-recommended__genre" }, genre))))));
        }
        return (React.createElement("span", { key: reason, className: "why-recommended__text" }, parsed.text));
    })));
};
