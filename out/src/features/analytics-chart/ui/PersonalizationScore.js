import { formatPercent } from '@/shared/lib/formatters';
import './PersonalizationScore.scss';
export const PersonalizationScore = ({ score }) => (React.createElement("div", { className: "personalization-score" },
    React.createElement("h3", { className: "personalization-score__title" }, "\u041E\u0446\u0435\u043D\u043A\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438"),
    React.createElement("div", { className: "personalization-score__bar" },
        React.createElement("div", { className: "personalization-score__fill", style: { width: formatPercent(score) } })),
    React.createElement("p", { className: "personalization-score__value" }, formatPercent(score)),
    React.createElement("p", { className: "personalization-score__hint" }, "\u041D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442 \u0441 \u0432\u0430\u0448\u0438\u043C\u0438 \u0438\u043D\u0442\u0435\u0440\u0435\u0441\u0430\u043C\u0438")));
