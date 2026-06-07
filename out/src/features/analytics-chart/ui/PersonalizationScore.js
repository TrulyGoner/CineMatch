import { useTranslation } from 'react-i18next';
import { formatPercent } from '@/shared/lib/formatters';
import './PersonalizationScore.scss';
export const PersonalizationScore = ({ score }) => {
    const { t } = useTranslation();
    return (React.createElement("div", { className: "personalization-score" },
        React.createElement("h3", { className: "personalization-score__title" }, t('chart.personalizationTitle')),
        React.createElement("div", { className: "personalization-score__bar" },
            React.createElement("div", { className: "personalization-score__fill", style: { width: formatPercent(score) } })),
        React.createElement("p", { className: "personalization-score__value" }, formatPercent(score)),
        React.createElement("p", { className: "personalization-score__hint" }, t('chart.personalizationHint'))));
};
